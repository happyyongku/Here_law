package org.ssafyb109.here_law.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
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

import java.time.LocalDateTime;
import java.util.*;

@Tag(name = "회원관리")
@RestController
@RequestMapping("/spring_api")
public class UserController {

    @Autowired
    private UserJpaRepository userJpaRepository;

    @Autowired
    private LawyerRepository lawyerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Autowired
    private VerificationTokenRepository verificationTokenRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private EmailVerificationService emailVerificationService;

    @Operation(summary = "회원가입", description = "회원가입")
    @PostMapping("/register")
    @Transactional
    public ResponseEntity<?> registerUser(@RequestBody UserDTO userDTO) {
        String email = userDTO.getEmail();

        // 이메일 인증 여부 확인
        if (!emailVerificationService.isEmailVerified(email)) {
            return ResponseEntity.badRequest().body("이메일 인증이 필요합니다.");
        }

        // 닉네임 중복 확인
        if (userJpaRepository.existsByNickname(userDTO.getNickname())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("이미 사용 중인 닉네임입니다.");
        }

        // UserEntity 생성 및 저장
        UserEntity user = new UserEntity();
        user.setNickname(userDTO.getNickname());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user.setProfileImg(userDTO.getProfileImg());
        user.setUserType(userDTO.getUserType());
        user.setIsFirst(true);
        user.setCreatedDate(LocalDateTime.now());
        user.setUpdateDate(LocalDateTime.now());
        user.setInterests(userDTO.getInterests());
        user.setSubscriptions(userDTO.getSubscriptions());
        user.setIsEmailVerified(true);  // 이메일 인증 완료

        userJpaRepository.save(user);  // 사용자 저장

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
        }

        // 이메일 인증 정보 삭제
        emailVerificationService.removeVerificationInfo(email);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "회원가입이 성공적으로 완료되었습니다.");
        return ResponseEntity.ok(response);
    }


    @Operation(summary = "회원 탈퇴", description = "회원 탈퇴")
    @DeleteMapping("/user/profile") //회원 탈퇴
    public ResponseEntity<String> deleteUser(Authentication authentication, @RequestBody UserDeleteDTO userDeleteDTO) {
        UserEntity user = userJpaRepository.findByEmail(authentication.getName());

        // 비밀번호 확인
        if (!passwordEncoder.matches(userDeleteDTO.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("비밀번호가 일치하지 않습니다.");
        }

        // 변호사일 경우 LawyerEntity 삭제
        if ("lawyer".equals(user.getUserType())) {
            LawyerEntity lawyer = lawyerRepository.findByUserId(user.getId()).orElse(null);
            if (lawyer != null) {
                lawyerRepository.delete(lawyer);
            }
        }

        // 관련된 VerificationTokenEntity 삭제 (연관된 토큰 수동 삭제)
        List<VerificationTokenEntity> tokens = verificationTokenRepository.findByUser(user);
        verificationTokenRepository.deleteAll(tokens);

        // UserEntity 삭제
        userJpaRepository.delete(user);
        return ResponseEntity.ok("회원탈퇴가 완료되었습니다.");
    }

    // 이메일 중복 확인
    @Operation(summary = "이메일 중복 확인", description = "이메일 중복 확인")
    @PostMapping("/check-email")
    public ResponseEntity<Map<String, Boolean>> checkEmail(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        boolean isAvailable = !userJpaRepository.existsByEmail(email);  // 이메일 중복 확인

        Map<String, Boolean> response = new HashMap<>();
        response.put("isAvailable", isAvailable);

        return ResponseEntity.ok(response);
    }

    // 닉네임 중복 확인
    @Operation(summary = "닉네임 중복 확인", description = "닉네임 중복 확인")
    @PostMapping("/check-nickname")
    public ResponseEntity<Map<String, Boolean>> checkNickname(@RequestBody Map<String, String> request) {
        String nickname = request.get("nickname");
        boolean isAvailable = !userJpaRepository.existsByNickname(nickname);  // 닉네임 중복 확인

        Map<String, Boolean> response = new HashMap<>();
        response.put("isAvailable", isAvailable);

        return ResponseEntity.ok(response);
    }

}
