package org.ssafyb109.here_law.service;

import org.springframework.stereotype.Service;
import org.ssafyb109.here_law.entity.CaseEntity;
import org.ssafyb109.here_law.repository.jpa.CaseJpaRepository;

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

}
