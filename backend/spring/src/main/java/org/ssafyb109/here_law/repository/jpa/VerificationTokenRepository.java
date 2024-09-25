package org.ssafyb109.here_law.repository.jpa;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.ssafyb109.here_law.entity.VerificationTokenEntity;
import org.ssafyb109.here_law.entity.UserEntity;

import java.util.List;
import java.util.Optional;

public interface VerificationTokenRepository extends JpaRepository<VerificationTokenEntity, Long> {
    Optional<VerificationTokenEntity> findByToken(String token);  // 토큰으로 VerificationToken 조회

    List<VerificationTokenEntity> findByUser(UserEntity user);

    @Modifying
    @Transactional
    @Query("DELETE FROM VerificationTokenEntity v WHERE v.user = :user")
    void deleteByUser(@Param("user") UserEntity user);
}
