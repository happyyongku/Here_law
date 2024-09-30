package org.ssafyb109.here_law.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.ssafyb109.here_law.entity.CaseEntity;
import org.ssafyb109.here_law.service.CaseService;

@Tag(name = "단순 판례")
@RestController
@RequestMapping("/spring_api/cases")
public class CaseController {

    private final CaseService caseService;

    private static final Logger logger = LoggerFactory.getLogger(CaseController.class);

    public CaseController(CaseService caseService) {
        this.caseService = caseService;
    }

    @Operation(summary = "케이스 조회", description = "케이스 ID로 케이스 조회")
    @GetMapping("/{caseInfoId}")
    public ResponseEntity<?> getCaseById(@PathVariable String caseInfoId) {  // Long에서 String으로 변경
        logger.info("케이스 조회 요청 수신: caseInfoId={}", caseInfoId);

        CaseEntity caseEntity = caseService.getCaseById(caseInfoId);

        if (caseEntity != null) {
            logger.info("케이스 조회 완료: caseInfoId={}", caseInfoId);
            return ResponseEntity.ok(caseEntity);
        } else {
            logger.warn("케이스를 찾을 수 없음: caseInfoId={}", caseInfoId);
            return ResponseEntity.notFound().build();
        }
    }
}