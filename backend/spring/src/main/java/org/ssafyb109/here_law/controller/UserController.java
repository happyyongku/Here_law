package org.ssafyb109.here_law.controller;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.ssafyb109.here_law.dto.user.LawyerDTO;
import org.ssafyb109.here_law.dto.user.UserDTO;
import org.ssafyb109.here_law.dto.user.UserDeleteDTO;
import org.ssafyb109.here_law.entity.LawyerEntity;
import org.ssafyb109.here_law.entity.UserEntity;
import org.ssafyb109.here_law.entity.VerificationTokenEntity;
import org.ssafyb109.here_law.repository.jpa.LawyerRepository;
import org.ssafyb109.here_law.repository.jpa.UserJpaRepository;
import org.ssafyb109.here_law.repository.jpa.VerificationTokenRepository;
import org.ssafyb109.here_law.service.EmailService;
import org.ssafyb109.here_law.service.EmailVerificationService;
import org.ssafyb109.here_law.service.UserService;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.*;

@Tag(name = "회원관리")
@RestController
@RequiredArgsConstructor
@RequestMapping("/spring_api")
public class UserController {

    private final UserJpaRepository userJpaRepository;

    private final LawyerRepository lawyerRepository;

    private final PasswordEncoder passwordEncoder;

    private final EmailService emailService;

    private final VerificationTokenRepository verificationTokenRepository;

    private final UserService userService;

    private final EmailVerificationService emailVerificationService;

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Operation(
            summary = "회원가입",
            description = "회원가입",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    content = @io.swagger.v3.oas.annotations.media.Content(
                            mediaType = "application/json",
                            examples = @io.swagger.v3.oas.annotations.media.ExampleObject(
                                    name = "회원가입 요청 예시",
                                    summary = "회원가입 요청 예시",
                                    value = "{\n" +
                                            "  \"email\": \"example@example.com\",\n" +
                                            "  \"password\": \"examplePassword\",\n" +
                                            "  \"nickname\": \"exampleNickname\",\n" +
                                            "  \"userType\": \"lawyer\",\n" +
                                            "  \"interests\": [\"법률\", \"IT\"],\n" +
                                            "  \"subscriptions\": [\"구독1\", \"구독2\"],\n" +
                                            "  \"lawyerDTO\": {\n" +
                                            "    \"expertise\": \"사법\",\n" +
                                            "    \"officeLocation\": \"서울\",\n" +
                                            "    \"qualification\": \"변호사 자격\",\n" +
                                            "    \"description\": \"변호사 설명\",\n" +
                                            "    \"phoneNumber\": \"010-1234-5678\"\n" +
                                            "  },\n" +
                                            "  \"profileImgFile\": \"프로필 이미지 파일 경로\"\n" +
                                            "}"
                            )
                    )
            )
    )
    @PostMapping("/register")
    @Transactional
    public ResponseEntity<?> registerUser(
            @ModelAttribute UserDTO userDTO,
            @RequestPart(value = "profileImgFile", required = false) MultipartFile profileImgFile
    ) {
        logger.info("회원가입 요청 수신");

        String email = userDTO.getEmail();

        // 이메일 유효성 확인
        if (email == null || email.trim().isEmpty()) {
            logger.warn("유효하지 않은 이메일입니다.");
            return ResponseEntity.badRequest().body("이메일이 유효하지 않습니다.");
        }

        // 이메일 인증 여부 확인
        if (!emailVerificationService.isEmailVerified(email)) {
            logger.warn("이메일 인증이 완료되지 않았습니다: {}", email);
            return ResponseEntity.badRequest().body("이메일 인증이 필요합니다.");
        }

        // 닉네임 중복 확인
        if (userJpaRepository.existsByNickname(userDTO.getNickname())) {
            logger.warn("닉네임 중복: {}", userDTO.getNickname());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("이미 사용 중인 닉네임입니다.");
        }

        logger.info("회원 정보 유효성 검사 통과");

        // 파일 업로드 처리
        String imgStr = null;
        if (profileImgFile != null && !profileImgFile.isEmpty()) {
            try {
                imgStr = userService.uploadProfile(profileImgFile);
            } catch (Exception e) {
                logger.error("파일 업로드 중 오류 발생: ", e);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("파일 업로드 중 오류가 발생했습니다.");
            }
        }

        // UserEntity 생성 및 저장
        UserEntity user = new UserEntity();
        user.setNickname(userDTO.getNickname());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user.setProfileImg(imgStr);
        user.setUserType(userDTO.getUserType());
        user.setIsFirst(true);
        user.setCreatedDate(LocalDateTime.now());
        user.setUpdateDate(LocalDateTime.now());
        user.setInterests(userDTO.getInterests());
        user.setSubscriptions(userDTO.getSubscriptions());
        user.setIsEmailVerified(true);  // 이메일 인증 완료

        userJpaRepository.save(user);  // 사용자 저장
        logger.info("사용자 정보 저장 완료: {}", user.getEmail());

        // 변호사일 경우 LawyerEntity 생성 및 저장
        if ("lawyer".equals(userDTO.getUserType()) && userDTO.getLawyerDTO() != null) {
            LawyerDTO lawyerDTO = userDTO.getLawyerDTO();
            LawyerEntity lawyer = new LawyerEntity();
            lawyer.setExpertise(lawyerDTO.getExpertise());
            lawyer.setOfficeLocation(lawyerDTO.getOfficeLocation());
            lawyer.setQualification(lawyerDTO.getQualification());
            lawyer.setDescription(lawyerDTO.getDescription());
            lawyer.setPoint(0);
            lawyer.setPhoneNumber(lawyerDTO.getPhoneNumber());
            lawyer.setUser(user);  // 변호사 정보와 사용자 정보를 연결

            lawyerRepository.save(lawyer);  // 변호사 저장
            logger.info("변호사 정보 저장 완료: {}", user.getEmail());
        }

        // 이메일 인증 정보 삭제
        emailVerificationService.removeVerificationInfo(email);
        logger.info("이메일 인증 정보 삭제 완료: {}", email);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "회원가입이 성공적으로 완료되었습니다.");
        logger.info("회원가입 완료: {}", user.getEmail());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/profileimg")
    public ResponseEntity<?> getProfileImg() {
        try {
            Resource resource = userService.getCurrentProfileImg();

            if (resource == null || !resource.exists()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            // MIME 타입 설정 (파일 확장자에 따라 다를 수 있음)
            String contentType = Files.probeContentType(Paths.get(resource.getURI()));

            if (contentType == null) {
                contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE; // 기본 MIME 타입
            }

            // HTTP 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(contentType));
            logger.debug("parseMediaType :{}", MediaType.parseMediaType(contentType));
            headers.setContentLength(resource.contentLength()); // 파일 크기 설정
            logger.debug("resource.contentLength() : {}", resource.contentLength());
            headers.setContentDisposition(ContentDisposition.inline().filename(resource.getFilename()).build()); // 파일 이름 설정
            logger.debug("PROFILE IMAGE LOAD Success");
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(resource);

        } catch (IOException e) {
            logger.error("PROFILE IMAGE LOAD ERROR: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Operation(
            summary = "회원 탈퇴",
            description = "회원 탈퇴",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    content = @io.swagger.v3.oas.annotations.media.Content(
                            mediaType = "application/json",
                            examples = @io.swagger.v3.oas.annotations.media.ExampleObject(
                                    name = "회원탈퇴 요청 예시",
                                    summary = "회원탈퇴 요청 예시",
                                    value = "{\n" +
                                            "  \"password\": \"examplePassword\"\n" +
                                            "}"
                            )
                    )
            )
    )
    @DeleteMapping("/user/profile") //회원 탈퇴
    public ResponseEntity<String> deleteUser(Authentication authentication, @RequestBody UserDeleteDTO userDeleteDTO) {
        logger.info("회원 탈퇴 요청 수신");
        UserEntity user = userJpaRepository.findByEmail(authentication.getName());
        logger.debug("현재 사용자: {}", user.getEmail());

        // 비밀번호 확인
        if (!passwordEncoder.matches(userDeleteDTO.getPassword(), user.getPassword())) {
            logger.warn("비밀번호 불일치: {}", user.getEmail());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("비밀번호가 일치하지 않습니다.");
        }

        // 변호사일 경우 LawyerEntity 삭제
        if ("lawyer".equals(user.getUserType())) {
            LawyerEntity lawyer = lawyerRepository.findByUserId(user.getId()).orElse(null);
            if (lawyer != null) {
                lawyerRepository.delete(lawyer);
                logger.info("변호사 정보 삭제 완료: {}", user.getEmail());
            }
        }

        // 관련된 VerificationTokenEntity 삭제 (연관된 토큰 수동 삭제)
        List<VerificationTokenEntity> tokens = verificationTokenRepository.findByUser(user);
        verificationTokenRepository.deleteAll(tokens);
        logger.info("인증 토큰 삭제 완료: {}", user.getEmail());

        // 프로파일 이미지 삭제
        userService.deleteProfileImage();

        // UserEntity 삭제
        userJpaRepository.delete(user);
        logger.info("사용자 삭제 완료: {}", user.getEmail());
        return ResponseEntity.ok("회원탈퇴가 완료되었습니다.");
    }

    // 이메일 중복 확인
    @Operation(
            summary = "이메일 중복 확인",
            description = "이메일 중복 확인",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    content = @io.swagger.v3.oas.annotations.media.Content(
                            mediaType = "application/json",
                            examples = @io.swagger.v3.oas.annotations.media.ExampleObject(
                                    name = "이메일 중복 확인 요청 예시",
                                    summary = "이메일 중복 확인 요청 예시",
                                    value = "{\n" +
                                            "  \"email\": \"example@example.com\"\n" +
                                            "}"
                            )
                    )
            )
    )
    @PostMapping("/check-email")
    public ResponseEntity<Map<String, Boolean>> checkEmail(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        logger.info("이메일 중복 확인 요청: {}", email);

        boolean isAvailable = !userJpaRepository.existsByEmail(email);  // 이메일 중복 확인

        Map<String, Boolean> response = new HashMap<>();
        response.put("isAvailable", isAvailable);

        logger.info("이메일 사용 가능 여부: {}", isAvailable);
        return ResponseEntity.ok(response);
    }

    // 닉네임 중복 확인
    @Operation(
            summary = "닉네임 중복 확인",
            description = "닉네임 중복 확인",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    content = @io.swagger.v3.oas.annotations.media.Content(
                            mediaType = "application/json",
                            examples = @io.swagger.v3.oas.annotations.media.ExampleObject(
                                    name = "닉네임 중복 확인 요청 예시",
                                    summary = "닉네임 중복 확인 요청 예시",
                                    value = "{\n" +
                                            "  \"nickname\": \"exampleNickname\"\n" +
                                            "}"
                            )
                    )
            )
    )
    @PostMapping("/check-nickname")
    public ResponseEntity<Map<String, Boolean>> checkNickname(@RequestBody Map<String, String> request) {
        String nickname = request.get("nickname");
        logger.info("닉네임 중복 확인 요청: {}", nickname);

        boolean isAvailable = !userJpaRepository.existsByNickname(nickname);  // 닉네임 중복 확인

        Map<String, Boolean> response = new HashMap<>();
        response.put("isAvailable", isAvailable);

        logger.info("닉네임 사용 가능 여부: {}", isAvailable);
        return ResponseEntity.ok(response);
    }

}
