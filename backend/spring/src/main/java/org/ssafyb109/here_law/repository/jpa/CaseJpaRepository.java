package org.ssafyb109.here_law.repository.jpa;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.ssafyb109.here_law.entity.CaseEntity;

import java.util.List;

public interface CaseJpaRepository extends JpaRepository<CaseEntity, Long> {
    // caseInfoId로 케이스 조회
    CaseEntity findByCaseInfoId(String caseInfoId);

    // 검색 기능 (페이지네이션 포함)
    Page<CaseEntity> findByCaseNameContainingOrIssuesContainingOrJudgmentSummaryContainingOrFullTextContainingOrderByCaseInfoIdAsc(
            String caseName, String issues, String judgmentSummary, String fullText, Pageable pageable);

    // 전체 검색 기능 (페이지네이션 없음)
    List<CaseEntity> findByCaseNameContainingOrIssuesContainingOrJudgmentSummaryContainingOrFullTextContainingOrderByCaseInfoIdAsc(
            String caseName, String issues, String judgmentSummary, String fullText);
}