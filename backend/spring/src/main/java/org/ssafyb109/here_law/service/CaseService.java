package org.ssafyb109.here_law.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.ssafyb109.here_law.entity.CaseEntity;
import org.ssafyb109.here_law.repository.CaseRepository;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class CaseService {

    private final CaseRepository caseRepository;

    public CaseService(CaseRepository caseRepository) {
        this.caseRepository = caseRepository;
    }

    public Map<String, Object> searchCases(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<CaseEntity> casesPage = caseRepository.findBySummaryContaining(query, pageable);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("totalResults", casesPage.getTotalElements());
        response.put("currentPage", casesPage.getNumber() + 1);
        response.put("totalPages", casesPage.getTotalPages());
        response.put("cases", casesPage.getContent());

        return response;
    }
}
