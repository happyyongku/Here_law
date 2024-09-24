package org.ssafyb109.here_law.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.ssafyb109.here_law.document.CaseEntity;
import org.ssafyb109.here_law.repository.elasticsearch.CaseRepository;
import org.ssafyb109.here_law.repository.elasticsearch.CustomCaseRepository;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class CaseService {

    private final CaseRepository caseRepository;
    private final CustomCaseRepository customCaseRepository;

    public CaseService(CaseRepository caseRepository, CustomCaseRepository customCaseRepository) {
        this.caseRepository = caseRepository;
        this.customCaseRepository = customCaseRepository;
    }

    public Map<String, Object> searchCases(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        String[] keywords = query.split("\\s+");
        Page<CaseEntity> casesPage;

        if (keywords.length == 1) {
            casesPage = caseRepository.findBySummaryContaining(keywords[0], pageable);
        } else {
            casesPage = customCaseRepository.findBySummaryContainingMultipleKeywords(keywords, pageable);
        }

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("totalResults", casesPage.getTotalElements());
        response.put("currentPage", casesPage.getNumber() + 1);
        response.put("totalPages", casesPage.getTotalPages());
        response.put("cases", casesPage.getContent());

        return response;
    }
}
