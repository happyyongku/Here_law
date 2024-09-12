package org.ssafyb109.here_law.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.ssafyb109.here_law.entity.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
    UserEntity findByEmail(String email);
}