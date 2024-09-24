package org.ssafyb109.here_law.repository.elasticsearch;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.ssafyb109.here_law.document.CaseEntity;

public interface CustomCaseRepository {
    Page<CaseEntity> findBySummaryContainingMultipleKeywords(String[] keywords, Pageable pageable);
}
