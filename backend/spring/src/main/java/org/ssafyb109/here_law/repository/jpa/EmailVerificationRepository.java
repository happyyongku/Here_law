package org.ssafyb109.here_law.repository.jpa;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.ssafyb109.here_law.entity.EmailVerificationEntity;

import java.util.Optional;

@Repository
public interface EmailVerificationRepository extends JpaRepository<EmailVerificationEntity, Long> {

    Optional<EmailVerificationEntity> findByEmail(String email);

    boolean existsByEmailAndVerifiedTrue(String email);

    void deleteByEmail(String email);
}