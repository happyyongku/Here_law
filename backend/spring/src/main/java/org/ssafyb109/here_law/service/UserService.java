package org.ssafyb109.here_law.service;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.ssafyb109.here_law.controller.UserController;
import org.ssafyb109.here_law.entity.UserEntity;
import org.ssafyb109.here_law.jwt.JwtUtil;
import org.ssafyb109.here_law.repository.jpa.UserJpaRepository;
import org.ssafyb109.here_law.repository.jpa.VerificationTokenRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
@RequiredArgsConstructor
@Service
public class UserService {

    private static final String UPLOAD_DIR = "/app/here_law_profile_img/";
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    private final JavaMailSender mailSender;
    private final  JwtUtil jwtUtil;
    private final  UserJpaRepository userJpaRepository;
    private final  VerificationTokenRepository verificationTokenRepository;

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

    public void uploadProfile(MultipartFile file) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication == null || !authentication.isAuthenticated())
            throw new RuntimeException("유저 인증정보가 없거나 인증하지 못했습니다.");

        UserEntity userEntity = userJpaRepository.findByEmail((String) authentication.getPrincipal());

        String originalFileName = file.getOriginalFilename();
        if (originalFileName == null || originalFileName.isEmpty()) {
            throw new RuntimeException("Invalid file");
        }

        // 파일 확장자 추출
        String fileExtension = getFileExtension(originalFileName).toLowerCase();
        if (fileExtension == null || fileExtension.isEmpty()) {
            throw new RuntimeException("File must have an extension");
        }

        // 확장자 체크
        if (!fileExtension.equals("png") && !fileExtension.equals("jpg") && !fileExtension.equals("jpeg")) {
            throw new RuntimeException("Only PNG and JPG files are allowed");
        }

        // 최종 파일명 설정
        String fileName = UUID.randomUUID() + "." + fileExtension;

        Path filePath = Paths.get(UPLOAD_DIR).resolve(fileName);

        try {
            // 디렉토리가 존재하지 않으면 생성
            Files.createDirectories(filePath.getParent());

            // 파일 저장 (기존 파일이 있는 경우 덮어쓰기)
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // 파일 경로를 절대 경로로 설정
            userEntity.setProfileImg(filePath.toAbsolutePath().toString());
            userJpaRepository.save(userEntity);

            logger.info("File uploaded successfully: {}", filePath.toString());
        } catch (IOException e) {
            logger.info("File uploaded failed: {}", e.getMessage());
            throw new RuntimeException("Failed to upload file", e);
        }
    }

    private String getFileExtension(String fileName) {
        int lastIndexOfDot = fileName.lastIndexOf('.');
        if (lastIndexOfDot == -1) {
            return ""; // 확장자가 없는 경우 빈 문자열 반환
        }
        return fileName.substring(lastIndexOfDot + 1);
    }

}

