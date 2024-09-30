package org.ssafyb109.here_law.repository.jpa;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.ssafyb109.here_law.entity.CaseEntity;

public interface CaseJpaRepository extends JpaRepository<CaseEntity, Long> {
    CaseEntity findByCaseInfoId(String caseInfoId);
}
