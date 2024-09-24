package org.ssafyb109.here_law.service;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.ssafyb109.here_law.entity.EmailVerificationEntity;
import org.ssafyb109.here_law.repository.jpa.EmailVerificationRepository;
import org.ssafyb109.here_law.repository.jpa.UserJpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class EmailVerificationService {

    @Autowired
    private EmailVerificationRepository emailVerificationRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private UserJpaRepository userJpaRepository;

    // 이메일 중복 확인
    public boolean isEmailAlreadyRegistered(String email) {
        String normalizedEmail = email.trim().toLowerCase(); // 이메일 소문자 변환 및 공백 제거
        return userJpaRepository.existsByEmail(normalizedEmail);
    }

    // 인증번호 발송
    public void sendVerificationCode(String email) {
        String normalizedEmail = email.trim().toLowerCase(); // 이메일 소문자 변환 및 공백 제거

        // 이미 등록된 이메일인지 확인
        if (isEmailAlreadyRegistered(normalizedEmail)) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        String code = String.format("%06d", new Random().nextInt(1000000));

        // 이메일 전송
        sendEmail(normalizedEmail, code);

        // 인증 정보 저장 (기존 정보가 있으면 업데이트)
        EmailVerificationEntity verification = emailVerificationRepository.findByEmail(normalizedEmail)
                .orElse(new EmailVerificationEntity());
        verification.setEmail(normalizedEmail);
        verification.setCode(code);
        verification.setExpiryDate(LocalDateTime.now().plusMinutes(5)); // 5분 유효
        verification.setVerified(false);
        emailVerificationRepository.save(verification);
    }

    // 이메일로 인증번호 전송
    private void sendEmail(String toEmail, String code) {
        String subject = "여기로 회원가입 인증번호";
        String text = "인증번호: " + code + "\n\n5분 이내에 입력해주세요.";

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }

    // 인증번호 확인
    public boolean verifyCode(String email, String code) {
        String normalizedEmail = email.trim().toLowerCase(); // 이메일 소문자 변환 및 공백 제거

        Optional<EmailVerificationEntity> verificationOpt = emailVerificationRepository.findByEmail(normalizedEmail);
        if (verificationOpt.isPresent()) {
            EmailVerificationEntity verification = verificationOpt.get();

            // 만료 시간 및 인증번호 확인
            if (!verification.isVerified()
                    && verification.getCode().equals(code)
                    && verification.getExpiryDate().isAfter(LocalDateTime.now())) {
                verification.setVerified(true);
                emailVerificationRepository.save(verification);
                return true;
            }
        }
        return false;
    }

    // 이메일 인증 여부 확인
    public boolean isEmailVerified(String email) {
        String normalizedEmail = email.trim().toLowerCase(); // 이메일 소문자 변환 및 공백 제거
        return emailVerificationRepository.existsByEmailAndVerifiedTrue(normalizedEmail);
    }

    // 인증 정보 삭제 (회원가입 완료 시)
    @Transactional
    public void removeVerificationInfo(String email) {
        String normalizedEmail = email.trim().toLowerCase(); // 이메일 소문자 변환 및 공백 제거
        emailVerificationRepository.deleteByEmail(normalizedEmail);
    }
}