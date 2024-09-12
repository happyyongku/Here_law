package org.ssafyb109.here_law.controller;

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
import org.ssafyb109.here_law.repository.LawyerRepository;
import org.ssafyb109.here_law.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/spring_api")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LawyerRepository lawyerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")  // 회원가입
    public ResponseEntity<UserDTO> registerUser(@RequestBody UserDTO userDTO) {
        // UserEntity 생성 및 저장
        UserEntity user = new UserEntity();
        user.setNickname(userDTO.getNickname());
        user.setEmail(userDTO.getEmail());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user.setPhoneNumber(userDTO.getPhoneNumber());
        user.setProfileImg(userDTO.getProfileImg());
        user.setUserType(userDTO.getUserType());
        user.setIsFirst(true);
        user.setCreatedDate(LocalDateTime.now());
        user.setUpdateDate(LocalDateTime.now());
        user.setInterests(userDTO.getInterests());

        userRepository.save(user);

        // 변호사일 경우 LawyerEntity 생성 및 저장
        if ("lawyer".equals(userDTO.getUserType()) && userDTO.getLawyerDTO() != null) {
            LawyerDTO lawyerDTO = userDTO.getLawyerDTO();
            LawyerEntity lawyer = new LawyerEntity();
            lawyer.setExpertiseMain(lawyerDTO.getExpertiseMain());
            lawyer.setExpertiseSub(lawyerDTO.getExpertiseSub());
            lawyer.setOfficeLocation(lawyerDTO.getOfficeLocation());
            lawyer.setQualification(lawyerDTO.getQualification());
            lawyer.setDescription(lawyerDTO.getDescription());
            lawyer.setUser(user);  // 변호사 정보와 사용자 정보를 연결

            lawyerRepository.save(lawyer);  // 변호사 정보 저장

            // 변호사 정보를 포함한 UserDTO 반환
            return ResponseEntity.ok(createUserDTOWithLawyer(user, lawyer));
        }

        // 변호사가 아닌 경우 일반 UserDTO 반환
        return ResponseEntity.ok(createUserDTO(user));
    }

    @DeleteMapping("/user/profile") //회원 탈퇴
    public ResponseEntity<String> deleteUser(Authentication authentication, @RequestBody UserDeleteDTO userDeleteDTO) {
        UserEntity user = userRepository.findByEmail(authentication.getName());

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

        userRepository.delete(user);
        return ResponseEntity.ok("회원탈퇴가 완료되었습니다.");
    }

    // 변호사 정보를 포함한 UserDTO 생성
    private UserDTO createUserDTOWithLawyer(UserEntity user, LawyerEntity lawyer) {
        UserDTO userDTO = createUserDTO(user);

        // 변호사 정보를 LawyerDTO에 저장
        LawyerDTO lawyerDTO = new LawyerDTO();
        lawyerDTO.setExpertiseMain(lawyer.getExpertiseMain());
        lawyerDTO.setExpertiseSub(lawyer.getExpertiseSub());
        lawyerDTO.setOfficeLocation(lawyer.getOfficeLocation());
        lawyerDTO.setQualification(lawyer.getQualification());
        lawyerDTO.setDescription(lawyer.getDescription());

        userDTO.setLawyerDTO(lawyerDTO);  // 변호사 정보를 UserDTO에 설정

        return userDTO;
    }

    // 변호사 정보가 없는 UserDTO 생성
    private UserDTO createUserDTO(UserEntity user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setNickname(user.getNickname());
        userDTO.setEmail(user.getEmail());
        userDTO.setPassword(user.getPassword());
        userDTO.setPhoneNumber(user.getPhoneNumber());
        userDTO.setProfileImg(user.getProfileImg());
        userDTO.setUserType(user.getUserType());
        userDTO.setIsFirst(user.getIsFirst());
        userDTO.setCreatedDate(user.getCreatedDate());
        userDTO.setUpdateDate(user.getUpdateDate());
        userDTO.setInterests(user.getInterests());
        return userDTO;
    }
}
