package org.ssafyb109.here_law.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.ssafyb109.here_law.dto.user.LawyerDTO;
import org.ssafyb109.here_law.dto.user.UserDTO;
import org.ssafyb109.here_law.entity.LawyerEntity;
import org.ssafyb109.here_law.entity.UserEntity;
import org.ssafyb109.here_law.repository.jpa.LawyerRepository;
import org.ssafyb109.here_law.repository.jpa.UserJpaRepository;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@Tag(name = "회원 정보")
@RestController
@RequestMapping("/spring_api")
public class UserProfileController {

    @Autowired
    private UserJpaRepository userJpaRepository;

    @Autowired
    private LawyerRepository lawyerRepository;

    private static final Logger logger = LoggerFactory.getLogger(UserProfileController.class);

    @Operation(
            summary = "회원 정보 조회",
            description = "회원 정보 조회",
            responses = @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    content = @io.swagger.v3.oas.annotations.media.Content(
                            mediaType = "application/json",
                            examples = @io.swagger.v3.oas.annotations.media.ExampleObject(
                                    name = "회원 정보 조회 응답 예시",
                                    value = "{\n" +
                                            "  \"nickname\": \"exampleNickname\",\n" +
                                            "  \"email\": \"example@example.com\",\n" +
                                            "  \"profileImg\": \"/images/profile.jpg\",\n" +
                                            "  \"userType\": \"lawyer\",\n" +
                                            "  \"isFirst\": true,\n" +
                                            "  \"createdDate\": \"2024-01-01T12:34:56\",\n" +
                                            "  \"updateDate\": \"2024-10-02T12:34:56\",\n" +
                                            "  \"interests\": [\"법률\", \"IT\"],\n" +
                                            "  \"subscriptions\": [\"구독1\", \"구독2\"],\n" +
                                            "  \"lawyerDTO\": {\n" +
                                            "    \"expertise\": \"사법\",\n" +
                                            "    \"officeLocation\": \"서울\",\n" +
                                            "    \"qualification\": \"변호사 자격\",\n" +
                                            "    \"description\": \"변호사 설명\",\n" +
                                            "    \"phoneNumber\": \"010-1234-5678\"\n" +
                                            "  }\n" +
                                            "}"
                            )
                    )
            )
    )
    @GetMapping("/user/profile") // 회원 정보 조회
    public ResponseEntity<Object> getUserProfile(Authentication authentication) {
        logger.info("회원 정보 조회 요청 수신");

        UserEntity user = userJpaRepository.findByEmail(authentication.getName());
        logger.info("사용자 정보 조회 완료: {}", user.getEmail());

        // 변호사일 경우 변호사 정보를 함께 리턴
        if ("lawyer".equals(user.getUserType())) {
            Optional<LawyerEntity> lawyerOpt = lawyerRepository.findByUserId(user.getId());
            logger.info("변호사 정보 조회 시도: 사용자 ID {}", user.getId());

            if (lawyerOpt.isPresent()) {
                LawyerEntity lawyer = lawyerOpt.get();
                UserDTO userDTO = createUserDTOWithLawyer(user, lawyer);
                logger.info("변호사 정보 포함한 UserDTO 생성 완료");
                return ResponseEntity.ok(userDTO);
            } else {
                logger.warn("변호사 정보가 없습니다: 사용자 ID {}", user.getId());
                return ResponseEntity.ok(Map.of("user", user, "message", "변호사 정보가 없습니다."));
            }
        } else {
            // 변호사가 아닌 경우 일반 사용자 정보만 리턴
            UserDTO userDTO = createUserDTO(user);
            logger.info("일반 사용자 UserDTO 생성 완료");
            return ResponseEntity.ok(userDTO);
        }
    }

    @Operation(
            summary = "회원 정보 수정",
            description = "회원 정보 수정",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    content = @io.swagger.v3.oas.annotations.media.Content(
                            mediaType = "application/json",
                            examples = @io.swagger.v3.oas.annotations.media.ExampleObject(
                                    name = "회원 정보 수정 요청 예시",
                                    summary = "회원 정보 수정 요청 예시",
                                    value = "{\n" +
                                            "  \"nickname\": \"updatedNickname\",\n" +
                                            "  \"profileImg\": \"/images/new-profile.jpg\",\n" +
                                            "  \"interests\": [\"개발\", \"법률\"],\n" +
                                            "  \"subscriptions\": [\"새 구독1\", \"새 구독2\"],\n" +
                                            "  \"lawyerDTO\": {\n" +
                                            "    \"expertise\": \"헌법\",\n" +
                                            "    \"officeLocation\": \"부산\",\n" +
                                            "    \"qualification\": \"변호사 자격2\",\n" +
                                            "    \"description\": \"변호사 설명2\",\n" +
                                            "    \"phoneNumber\": \"010-4321-5678\"\n" +
                                            "  }\n" +
                                            "}"
                            )
                    )
            )
    )
    @PutMapping("/user/profile") // 회원 정보 수정
    public ResponseEntity<Object> updateUserProfile(Authentication authentication, @RequestBody UserDTO updatedUserDTO) {
        logger.info("회원 정보 수정 요청 수신");

        // 사용자 인증을 통해 현재 사용자 정보 가져오기
        UserEntity user = userJpaRepository.findByEmail(authentication.getName());
        logger.info("현재 사용자 정보 조회 완료: {}", user.getEmail());

        // 닉네임 중복 확인
        if (updatedUserDTO.getNickname() != null && !user.getNickname().equals(updatedUserDTO.getNickname()) && userJpaRepository.existsByNickname(updatedUserDTO.getNickname())) {
            logger.warn("닉네임 중복 발생: {}", updatedUserDTO.getNickname());
            return ResponseEntity.badRequest().body("해당 닉네임은 이미 사용 중입니다.");
        }

        logger.info("닉네임 중복 확인 완료");

        // 수정된 값만 반영 (null이 아닐 경우만)
        if (updatedUserDTO.getNickname() != null) {
            user.setNickname(updatedUserDTO.getNickname());
            logger.info("닉네임 수정: {}", updatedUserDTO.getNickname());
        }
        if (updatedUserDTO.getProfileImg() != null) {
            user.setProfileImg(updatedUserDTO.getProfileImg());
            logger.info("프로필 이미지 수정");
        }
        if (updatedUserDTO.getInterests() != null) {
            user.setInterests(updatedUserDTO.getInterests());
            logger.info("관심사 수정");
        }
        if (updatedUserDTO.getSubscriptions() != null) {
            user.setSubscriptions(updatedUserDTO.getSubscriptions());
            logger.info("구독 정보 수정");
        }
        user.setUpdateDate(LocalDateTime.now());
        logger.info("업데이트 날짜 수정: {}", user.getUpdateDate());

        // 변호사일 경우 변호사 정보 수정
        if ("lawyer".equals(user.getUserType())) {
            Optional<LawyerEntity> lawyerOpt = lawyerRepository.findByUserId(user.getId());
            logger.info("변호사 정보 수정 시도: 사용자 ID {}", user.getId());
            if (lawyerOpt.isPresent() && updatedUserDTO.getLawyerDTO() != null) {
                LawyerEntity lawyer = lawyerOpt.get();
                LawyerDTO updatedLawyerDTO = updatedUserDTO.getLawyerDTO();

                if (updatedLawyerDTO.getExpertise() != null) {
                    lawyer.setExpertise(updatedLawyerDTO.getExpertise());
                    logger.info("전문 분야 수정");
                }
                if (updatedLawyerDTO.getOfficeLocation() != null) {
                    lawyer.setOfficeLocation(updatedLawyerDTO.getOfficeLocation());
                    logger.info("사무실 위치 수정");
                }
                if (updatedLawyerDTO.getQualification() != null) {
                    lawyer.setQualification(updatedLawyerDTO.getQualification());
                    logger.info("자격 사항 수정");
                }
                if (updatedLawyerDTO.getDescription() != null) {
                    lawyer.setDescription(updatedLawyerDTO.getDescription());
                    logger.info("설명 수정");
                }
                if (updatedLawyerDTO.getPhoneNumber() != null) {
                    lawyer.setPhoneNumber(updatedLawyerDTO.getPhoneNumber());
                    logger.info("전화번호 수정");
                }

                lawyerRepository.save(lawyer);  // 변호사 정보 저장
                logger.info("변호사 정보 저장 완료");
            } else {
                logger.warn("변호사 정보가 존재하지 않습니다: 사용자 ID {}", user.getId());
            }
        }

        // 수정된 사용자 정보 저장
        userJpaRepository.save(user);
        logger.info("사용자 정보 저장 완료: {}", user.getEmail());

        return ResponseEntity.ok("회원정보가 성공적으로 수정되었습니다.");
    }



    // 변호사 정보를 포함한 UserDTO 생성
    private UserDTO createUserDTOWithLawyer(UserEntity user, LawyerEntity lawyer) {
        logger.info("변호사 정보를 포함한 UserDTO 생성 중");

        UserDTO userDTO = createUserDTO(user);

        // 변호사 정보를 LawyerDTO에 저장
        LawyerDTO lawyerDTO = new LawyerDTO();
        lawyerDTO.setExpertise(lawyer.getExpertise());
        lawyerDTO.setOfficeLocation(lawyer.getOfficeLocation());
        lawyerDTO.setQualification(lawyer.getQualification());
        lawyerDTO.setDescription(lawyer.getDescription());
        lawyerDTO.setPhoneNumber(lawyer.getPhoneNumber());
        logger.info("LawyerDTO 생성 완료");

        userDTO.setLawyerDTO(lawyerDTO);  // 변호사 정보를 UserDTO에 설정
        logger.info("UserDTO에 LawyerDTO 설정 완료");

        return userDTO;
    }

    // 변호사 정보가 없는 UserDTO 생성
    private UserDTO createUserDTO(UserEntity user) {
        logger.info("UserDTO 생성 중");

        UserDTO userDTO = new UserDTO();
        userDTO.setNickname(user.getNickname());
        userDTO.setEmail(user.getEmail());
        userDTO.setPassword(user.getPassword());
        userDTO.setProfileImg(user.getProfileImg());
        userDTO.setUserType(user.getUserType());
        userDTO.setIsFirst(user.getIsFirst());
        userDTO.setCreatedDate(user.getCreatedDate());
        userDTO.setUpdateDate(user.getUpdateDate());
        userDTO.setInterests(user.getInterests());
        userDTO.setSubscriptions(user.getSubscriptions());
        logger.info("UserDTO 생성 완료");

        return userDTO;
    }
}
