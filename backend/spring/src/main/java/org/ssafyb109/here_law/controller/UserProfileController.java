package org.ssafyb109.here_law.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
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

    @Operation(summary = "회원 정보 조회", description = "회원 정보 조회")
    @GetMapping("/user/profile") // 회원 정보 조회
    public ResponseEntity<Object> getUserProfile(Authentication authentication) {
        UserEntity user = userJpaRepository.findByEmail(authentication.getName());

        // 변호사일 경우 변호사 정보를 함께 리턴
        if ("lawyer".equals(user.getUserType())) {
            Optional<LawyerEntity> lawyerOpt = lawyerRepository.findByUserId(user.getId());

            if (lawyerOpt.isPresent()) {
                LawyerEntity lawyer = lawyerOpt.get();
                UserDTO userDTO = createUserDTOWithLawyer(user, lawyer);  // 변호사 정보 포함한 DTO 반환
                return ResponseEntity.ok(userDTO);
            } else {
                return ResponseEntity.ok(Map.of("user", user, "message", "변호사 정보가 없습니다."));
            }
        } else {
            // 변호사가 아닌 경우 일반 사용자 정보만 리턴
            UserDTO userDTO = createUserDTO(user);  // 변호사 정보 없이 반환
            return ResponseEntity.ok(userDTO);
        }
    }

    @Operation(summary = "회원 정보 수정", description = "회원 정보 수정")
    @PutMapping("/user/profile") // 회원 정보 수정
    public ResponseEntity<Object> updateUserProfile(Authentication authentication, @RequestBody UserDTO updatedUserDTO) {
        // 사용자 인증을 통해 현재 사용자 정보 가져오기
        UserEntity user = userJpaRepository.findByEmail(authentication.getName());

        // 닉네임 중복 확인
        if (updatedUserDTO.getNickname() != null && !user.getNickname().equals(updatedUserDTO.getNickname()) && userJpaRepository.existsByNickname(updatedUserDTO.getNickname())) {
            return ResponseEntity.badRequest().body("해당 닉네임은 이미 사용 중입니다.");
        }

        // 수정된 값만 반영 (null이 아닐 경우만)
        if (updatedUserDTO.getNickname() != null) {
            user.setNickname(updatedUserDTO.getNickname());
        }
        if (updatedUserDTO.getProfileImg() != null) {
            user.setProfileImg(updatedUserDTO.getProfileImg());
        }
        if (updatedUserDTO.getInterests() != null) {
            user.setInterests(updatedUserDTO.getInterests());
        }
        if (updatedUserDTO.getSubscriptions() != null) {
            user.setSubscriptions(updatedUserDTO.getSubscriptions());
        }
        user.setUpdateDate(LocalDateTime.now());

        // 변호사일 경우 변호사 정보 수정
        if ("lawyer".equals(user.getUserType())) {
            Optional<LawyerEntity> lawyerOpt = lawyerRepository.findByUserId(user.getId());
            if (lawyerOpt.isPresent() && updatedUserDTO.getLawyerDTO() != null) {
                LawyerEntity lawyer = lawyerOpt.get();
                LawyerDTO updatedLawyerDTO = updatedUserDTO.getLawyerDTO();

                if (updatedLawyerDTO.getExpertise() != null) {
                    lawyer.setExpertise(updatedLawyerDTO.getExpertise());
                }
                if (updatedLawyerDTO.getOfficeLocation() != null) {
                    lawyer.setOfficeLocation(updatedLawyerDTO.getOfficeLocation());
                }
                if (updatedLawyerDTO.getQualification() != null) {
                    lawyer.setQualification(updatedLawyerDTO.getQualification());
                }
                if (updatedLawyerDTO.getDescription() != null) {
                    lawyer.setDescription(updatedLawyerDTO.getDescription());
                }
                if (updatedLawyerDTO.getPhoneNumber() != null) {
                    lawyer.setPhoneNumber(updatedLawyerDTO.getPhoneNumber());
                }

                lawyerRepository.save(lawyer);  // 변호사 정보 저장
            }
        }

        // 수정된 사용자 정보 저장
        userJpaRepository.save(user);

        return ResponseEntity.ok("회원정보가 성공적으로 수정되었습니다.");
    }



    // 변호사 정보를 포함한 UserDTO 생성
    private UserDTO createUserDTOWithLawyer(UserEntity user, LawyerEntity lawyer) {
        UserDTO userDTO = createUserDTO(user);

        // 변호사 정보를 LawyerDTO에 저장
        LawyerDTO lawyerDTO = new LawyerDTO();
        lawyerDTO.setExpertise(lawyer.getExpertise());
        lawyerDTO.setOfficeLocation(lawyer.getOfficeLocation());
        lawyerDTO.setQualification(lawyer.getQualification());
        lawyerDTO.setDescription(lawyer.getDescription());
        lawyerDTO.setPhoneNumber(lawyer.getPhoneNumber());

        userDTO.setLawyerDTO(lawyerDTO);  // 변호사 정보를 UserDTO에 설정

        return userDTO;
    }

    // 변호사 정보가 없는 UserDTO 생성
    private UserDTO createUserDTO(UserEntity user) {
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
        return userDTO;
    }
}
