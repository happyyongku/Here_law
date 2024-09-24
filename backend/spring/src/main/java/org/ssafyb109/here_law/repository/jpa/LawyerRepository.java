package org.ssafyb109.here_law.repository.jpa;

import org.springframework.data.jpa.repository.JpaRepository;
import org.ssafyb109.here_law.entity.LawyerEntity;

import java.util.Optional;

public interface LawyerRepository extends JpaRepository<LawyerEntity, Long> {
    Optional<LawyerEntity> findByUserId(Long userId);  // user의 id로 변호사 정보 찾기
}