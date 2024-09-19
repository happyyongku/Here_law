package org.ssafyb109.here_law.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.ssafyb109.here_law.entity.CaseEntity;

public interface CaseRepository extends JpaRepository<CaseEntity, Long> {
    Page<CaseEntity> findBySummaryContaining(String keyword, Pageable pageable);
}
