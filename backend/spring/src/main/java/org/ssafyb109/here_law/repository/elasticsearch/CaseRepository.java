package org.ssafyb109.here_law.repository.elasticsearch;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.data.jpa.repository.Query;
import org.ssafyb109.here_law.document.CaseEntity;

public interface CaseRepository extends ElasticsearchRepository<CaseEntity, String> {
    Page<CaseEntity> findBySummaryContaining(String summary, Pageable pageable);
}
