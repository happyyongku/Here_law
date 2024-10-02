package org.ssafyb109.here_law.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.ssafyb109.here_law.repository.jpa.UserJpaRepository;
import org.ssafyb109.here_law.service.EmailVerificationService;

import java.util.Map;

@Tag(name = "이메일 인증")
@RestController
@RequestMapping("/spring_api")
public class EmailVerificationController {

    @Autowired
    private EmailVerificationService emailVerificationService;

    private static final Logger logger = LoggerFactory.getLogger(EmailVerificationController.class);

    // 이메일 인증번호 발송
    @Operation(summary = "인증번호 발송", description = "인증번호 발송")
    @PostMapping("/send-verification-code")
    public ResponseEntity<String> sendVerificationCode(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        logger.info("인증번호 발송 요청 수신: {}", email);
        try {
            // 인증번호 발송
            emailVerificationService.sendVerificationCode(email);
            logger.info("인증번호 이메일 전송 완료: {}", email);
            return ResponseEntity.ok("인증번호가 이메일로 전송되었습니다.");
        } catch (IllegalArgumentException e) {
            logger.warn("인증번호 발송 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "인증번호 입력", description = "인증번호 입력")
    @PostMapping("/verify-code")
    public ResponseEntity<String> verifyCode(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String code = request.get("code");
        logger.info("인증번호 검증 요청 수신: 이메일={}, 코드={}", email, code);

        boolean isVerified = emailVerificationService.verifyCode(email, code);

        if (isVerified) {
            logger.info("이메일 인증 성공: {}", email);
            return ResponseEntity.ok("이메일 인증이 완료되었습니다.");
        } else {
            logger.warn("이메일 인증 실패: {}", email);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("인증번호가 일치하지 않거나 만료되었습니다.");
        }
    }
}
