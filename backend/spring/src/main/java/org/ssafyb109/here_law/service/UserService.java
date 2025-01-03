package org.ssafyb109.here_law.service;

import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
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

import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Optional;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class UserService {

    private static final String UPLOAD_DIR = "/app/here_law_profile_img/";
    private static final String DEFAULT_PROFILE_IMG = "default.png";
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

    public String uploadProfile(MultipartFile file) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication == null || !authentication.isAuthenticated())
            throw new RuntimeException("유저 인증정보가 없거나 인증하지 못했습니다.");

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

            logger.info("File uploaded successfully: {}", filePath.toString());
            return filePath.toString();
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

    public Resource getCurrentProfileImg() throws Exception {
        UserEntity userEntity;
        FileInputStream fileInputStream = null;
        try {
            userEntity = getCurrentUserEntity();
            String path = userEntity.getProfileImg();
            if (path == null || path.isEmpty()) {
                path = Paths.get(UPLOAD_DIR).resolve(DEFAULT_PROFILE_IMG).toString();
            }
            logger.debug("getCurrentProfileImg Service path:{}", path);
            FileSystemResource resource = new FileSystemResource(path);
            if (!resource.exists()) {
                throw new IOException("File not found: " + path);
            }
            return resource;
        } catch (Exception e) {
            throw new IOException("File not found: ");
        }
    }

    public UserEntity getCurrentUserEntity(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication == null || !authentication.isAuthenticated())
            throw new RuntimeException("유저 인증정보가 없거나 인증하지 못했습니다.");
        String userEmail = authentication.getName();
        if(userEmail == null)
            throw new RuntimeException("유저 인증정보는 있지만 유저 Email이 없습니다.");
        UserEntity userEntity = userJpaRepository.findByEmail(userEmail);
        return userEntity;
    }
    
    @Transactional
    public void deleteProfileImage() {
        UserEntity userEntity = getCurrentUserEntity();
        String profileImgPath = userEntity.getProfileImg();

        if (profileImgPath == null || profileImgPath.isEmpty()) {
            // User has no profile image set, nothing to delete
            return;
        }

        // Extract the filename from profileImgPath
        String profileImgFileName = Paths.get(profileImgPath).getFileName().toString();

        if (DEFAULT_PROFILE_IMG.equals(profileImgFileName)) {
            // User's profile image is the default image, do not delete
            return;
        }

        // Attempt to delete the file
        try {
            Path pathToDelete = Paths.get(profileImgPath);
            Files.deleteIfExists(pathToDelete);
            logger.info("Deleted profile image: {}", profileImgPath);
        } catch (IOException e) {
            logger.error("Failed to delete profile image: {}", e.getMessage());
            throw new RuntimeException("Failed to delete profile image", e);
        }

        // Update the user's profileImg field to null
        userEntity.setProfileImg(null);
        userJpaRepository.save(userEntity);
    }
}

