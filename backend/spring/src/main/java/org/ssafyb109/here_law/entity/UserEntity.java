package org.ssafyb109.here_law.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Entity
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nickname;
    private String email;
    private String password;
    private String phoneNumber;
    private String profileImg;
    private String userType;  // "normal" or "lawyer"
    private Boolean isFirst;
    private LocalDateTime createdDate;
    private LocalDateTime updateDate;

    @ElementCollection
    private List<String> interests;

    private Boolean isEmailVerified = false;  // 이메일 인증 여부
    private String emailToken;    // 이메일 인증 토큰

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<VerificationTokenEntity> tokens;  // VerificationTokenEntity와의 관계 설정
}