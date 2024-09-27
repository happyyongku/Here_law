package org.ssafyb109.here_law.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.ssafyb109.here_law.entity.UserEntity;
import org.ssafyb109.here_law.jwt.JwtUtil;
import org.ssafyb109.here_law.repository.jpa.UserJpaRepository;
import org.ssafyb109.here_law.repository.jpa.VerificationTokenRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserJpaRepository userJpaRepository;

    @Autowired
    private VerificationTokenRepository verificationTokenRepository;

    // 이메일 인증 링크 전송
    public void sendEmail(UserEntity user) {
        String to = user.getEmail();
        String subject = "이메일 인증";
        String verificationToken = jwtUtil.generateEmailToken(); // 이메일 인증 토큰 생성
        user.setEmailToken(verificationToken); // 사용자 엔티티에 토큰 저장 (DB 저장 필요)

        String verificationLink = "http://localhost:8080/spring_api/user/verify-email?token=" + verificationToken;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText("이메일 인증을 위해 다음 링크를 클릭하세요: " + verificationLink);

        mailSender.send(message); // 이메일 전송
    }

    // 회원 삭제 메서드
    @Transactional
    public void deleteUser(Long userId) {
        Optional<UserEntity> user = userJpaRepository.findById(userId);
        if (user.isPresent()) {
            // VerificationTokenEntity를 먼저 삭제
            verificationTokenRepository.deleteByUser(user.get());
            // 그 후 UserEntity를 삭제
            userJpaRepository.deleteById(userId);
        }
    }

}

