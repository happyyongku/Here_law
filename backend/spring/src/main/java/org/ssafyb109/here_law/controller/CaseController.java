package org.ssafyb109.here_law.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.ssafyb109.here_law.entity.CaseEntity;
import org.ssafyb109.here_law.service.CaseService;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Tag(name = "단순 판례")
@RestController
@RequestMapping("/spring_api/cases")
public class CaseController {

    private final CaseService caseService;

    private static final Logger logger = LoggerFactory.getLogger(CaseController.class);

    public CaseController(CaseService caseService) {
        this.caseService = caseService;
    }

    @Operation(
            summary = "케이스 조회",
            description = "케이스 ID로 케이스 조회",
            responses = @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    content = @io.swagger.v3.oas.annotations.media.Content(
                            mediaType = "application/json",
                            examples = @io.swagger.v3.oas.annotations.media.ExampleObject(
                                    name = "케이스 조회 응답 예시",
                                    value = "{\n" +
                                            "  \"caseInfoId\": \"100006\",\n" +
                                            "  \"caseName\": \"양도소득세부과처분취소\",\n" +
                                            "  \"judgment\": \"선고\",\n" +
                                            "  \"courtName\": \"대법원\",\n" +
                                            "  \"caseType\": \"세무\",\n" +
                                            "  \"issues\": \"담보권자명의의 소유권이전...\",\n" +
                                            "  \"judgmentSummary\": \"가등기담보권자가 제소전 화해조항에...\",\n" +
                                            "  \"referenceClause\": \"소득세법 제23조\",\n" +
                                            "  \"fullText\": \"【원고, 피상고인】 김인배...\"\n" +
                                            "}"
                            )
                    )
            )
    )
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

    @Operation(
            summary = "케이스 검색",
            description = "키워드로 케이스 검색",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    content = @io.swagger.v3.oas.annotations.media.Content(
                            mediaType = "application/json",
                            examples = @io.swagger.v3.oas.annotations.media.ExampleObject(
                                    name = "케이스 검색 요청 예시",
                                    value = "{\n" +
                                            "  \"keyword\": \"소득세\",\n" +
                                            "  \"page\": 1,\n" +
                                            "  \"size\": 10\n" +
                                            "}"
                            )
                    )
            ),
            responses = @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    content = @io.swagger.v3.oas.annotations.media.Content(
                            mediaType = "application/json",
                            examples = @io.swagger.v3.oas.annotations.media.ExampleObject(
                                    name = "케이스 검색 응답 예시",
                                    value = "{\n" +
                                            "  \"totalResults\": 50,\n" +
                                            "  \"currentPage\": 1,\n" +
                                            "  \"totalPages\": 5,\n" +
                                            "  \"cases\": [\n" +
                                            "    {\n" +
                                            "      \"caseInfoId\": \"100001\",\n" +
                                            "      \"caseName\": \"소득세 부과처분 취소\",\n" +
                                            "      \"courtName\": \"대법원\",\n" +
                                            "      \"caseType\": \"세무\",\n" +
                                            "      \"issues\": \"소득세 관련 문제...\",\n" +
                                            "      \"judgmentSummary\": \"소득세법 관련...\"\n" +
                                            "    }\n" +
                                            "  ]\n" +
                                            "}"
                            )
                    )
            )
    )
    @GetMapping("/search")
    public ResponseEntity<?> searchCases(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        logger.info("케이스 검색 요청 수신: keyword={}, page={}, size={}", keyword, page, size);

        // 페이지 번호는 0부터 시작하므로 1을 빼줍니다.
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<CaseEntity> searchResult = caseService.searchCases(keyword, pageable);

        // 결과를 지정된 형식의 JSON으로 변환
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("totalResults", searchResult.getTotalElements());
        response.put("currentPage", searchResult.getNumber() + 1); // 페이지 번호를 1부터 시작하도록 조정
        response.put("totalPages", searchResult.getTotalPages());
        response.put("cases", searchResult.getContent());

        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "전체 케이스 검색",
            description = "키워드로 전체 케이스 검색",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    content = @io.swagger.v3.oas.annotations.media.Content(
                            mediaType = "application/json",
                            examples = @io.swagger.v3.oas.annotations.media.ExampleObject(
                                    name = "전체 케이스 검색 요청 예시",
                                    value = "{\n" +
                                            "  \"keyword\": \"소득세\"\n" +
                                            "}"
                            )
                    )
            ),
            responses = @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    content = @io.swagger.v3.oas.annotations.media.Content(
                            mediaType = "application/json",
                            examples = @io.swagger.v3.oas.annotations.media.ExampleObject(
                                    name = "전체 케이스 검색 응답 예시",
                                    value = "{\n" +
                                            "  \"totalResults\": 100,\n" +
                                            "  \"cases\": [\n" +
                                            "    {\n" +
                                            "      \"caseInfoId\": \"100001\",\n" +
                                            "      \"caseName\": \"소득세 부과처분 취소\",\n" +
                                            "      \"courtName\": \"대법원\",\n" +
                                            "      \"caseType\": \"세무\",\n" +
                                            "      \"issues\": \"소득세 관련 문제...\",\n" +
                                            "      \"judgmentSummary\": \"소득세법 관련...\"\n" +
                                            "    }\n" +
                                            "  ]\n" +
                                            "}"
                            )
                    )
            )
    )
    @GetMapping("/search/all")
    public ResponseEntity<?> searchAllCases(@RequestParam String keyword) {
        logger.info("전체 케이스 검색 요청 수신: keyword={}", keyword);

        List<CaseEntity> searchResult = caseService.searchAllCases(keyword);

        // 결과를 지정된 형식의 JSON으로 변환
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("totalResults", searchResult.size());
        response.put("cases", searchResult);

        return ResponseEntity.ok(response);
    }
}