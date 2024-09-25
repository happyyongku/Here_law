package org.ssafyb109.here_law.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.ssafyb109.here_law.entity.UserEntity;
import org.ssafyb109.here_law.entity.VerificationTokenEntity;
import org.ssafyb109.here_law.repository.jpa.VerificationTokenRepository;

import java.io.UnsupportedEncodingException;
import java.util.Optional;

@Service
public class EmailService {

    @Autowired
    private VerificationTokenRepository tokenRepository;

    @Autowired
    private JavaMailSender mailSender;  // 이메일 전송 기능 추가

    // 토큰 저장 메서드
    public void saveVerificationTokenForUser(String token, UserEntity user) {
        VerificationTokenEntity verificationToken = new VerificationTokenEntity(token, user);
        tokenRepository.save(verificationToken);
    }

    // 토큰으로 VerificationTokenEntity 조회
    public Optional<VerificationTokenEntity> getToken(String token) {
        return tokenRepository.findByToken(token);
    }

    // 이메일 전송 메서드 수정 (보낸 사람 이름 설정)
    public void sendVerificationEmail(String toEmail, String token) throws MessagingException {
        String subject = "이메일 인증";
        String verificationLink = token;

        // MimeMessage 사용
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(toEmail);
        helper.setSubject(subject);
        helper.setText("이메일 인증을 위해 다음 링크를 클릭하세요: " + verificationLink, true);

        try {
            // 보낸 사람 이메일 주소와 이름 설정
            helper.setFrom("herelaw@herelaw.com", "여기로(Here-law)");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }

        mailSender.send(message);  // 이메일 전송
    }
}
