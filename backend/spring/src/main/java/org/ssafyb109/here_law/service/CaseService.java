package org.ssafyb109.here_law.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.ssafyb109.here_law.entity.CaseEntity;
import org.ssafyb109.here_law.repository.jpa.CaseJpaRepository;

import java.util.List;

@Service
public class CaseService {


    private final CaseJpaRepository caseRepository;

    public CaseService(CaseJpaRepository caseRepository) {
        this.caseRepository = caseRepository;
    }

    // caseInfoId로 케이스 조회
    public CaseEntity getCaseById(String caseInfoId) {  // Long에서 String으로 변경
        return caseRepository.findByCaseInfoId(caseInfoId);
    }

    // 키워드로 케이스 검색 (페이지네이션 포함)
    public Page<CaseEntity> searchCases(String keyword, Pageable pageable) {
        return caseRepository.findByCaseNameContainingOrIssuesContainingOrJudgmentSummaryContainingOrderByCaseInfoIdAsc(
                keyword, keyword, keyword, pageable);
    }

    // 키워드로 전체 케이스 검색 (페이지네이션 없음)
    public List<CaseEntity> searchAllCases(String keyword) {
        return caseRepository.findByCaseNameContainingOrIssuesContainingOrJudgmentSummaryContainingOrderByCaseInfoIdAsc(
                keyword, keyword, keyword);
    }

}
