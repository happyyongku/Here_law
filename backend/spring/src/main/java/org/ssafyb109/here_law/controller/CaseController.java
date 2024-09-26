package org.ssafyb109.here_law.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.ssafyb109.here_law.service.CaseService;

@Tag(name = "단순 판례")
@RestController
@RequestMapping("/spring_api/cases")
public class CaseController {

    private final CaseService caseService;

    public CaseController(CaseService caseService) {
        this.caseService = caseService;
    }

    @Operation(summary = "단순 판례 검색", description = "단순 판례 검색")
    @GetMapping("/search")
    public ResponseEntity<?> searchCases(
            @RequestParam String query,
            @RequestParam int page,
            @RequestParam int size) {
        return ResponseEntity.ok(caseService.searchCases(query, page, size));
    }
}

