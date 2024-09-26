package org.ssafyb109.here_law.repository.jpa;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.ssafyb109.here_law.entity.UserEntity;

import java.util.Optional;

@Repository("userJpaRepository")
public interface UserJpaRepository extends JpaRepository<UserEntity, Long> {
    UserEntity findByEmail(String email);

    boolean existsByEmail(String email);  // 이메일 중복 확인용 메서드
    boolean existsByNickname(String nickname);  // 닉네임 중복 확인용 메서드

    Optional<UserEntity> findByEmailToken(String emailToken);  // 이메일 인증 토큰으로 사용자 찾기
}