package org.ssafyb109.here_law.repository.elasticsearch;

import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.query.NativeSearchQuery;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.stereotype.Repository;
import org.ssafyb109.here_law.document.CaseEntity;

import java.util.List;
import java.util.stream.Collectors;

@Repository
public class CustomCaseRepositoryImpl implements CustomCaseRepository {
    private final ElasticsearchOperations elasticsearchOperations;

    public CustomCaseRepositoryImpl(ElasticsearchOperations elasticsearchOperations) {
        this.elasticsearchOperations = elasticsearchOperations;
    }

    @Override
    public Page<CaseEntity> findBySummaryContainingMultipleKeywords(String[] keywords, Pageable pageable) {
        BoolQueryBuilder boolQuery = QueryBuilders.boolQuery();
        for (String keyword : keywords) {
            boolQuery.should(QueryBuilders.matchQuery("summary", keyword));
        }
        NativeSearchQuery searchQuery = new NativeSearchQueryBuilder()
                .withQuery(boolQuery)
                .withPageable(pageable)
                .build();
        SearchHits<CaseEntity> searchHits = elasticsearchOperations.search(searchQuery, CaseEntity.class);
        List<CaseEntity> cases = searchHits.stream().map(hit -> hit.getContent()).collect(Collectors.toList());
        return new PageImpl<>(cases, pageable, searchHits.getTotalHits());
    }
}

