package org.ssafyb109.here_law.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.ssafyb109.here_law.dto.jwt.JwtLoginResponseDTO;
import org.ssafyb109.here_law.dto.jwt.LoginRequestDTO;
import org.ssafyb109.here_law.jwt.JwtBlacklistService;
import org.ssafyb109.here_law.jwt.JwtUtil;

@Tag(name = "로그인/로그아웃")
@RestController
@RequestMapping("/spring_api")
public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtTokenProvider;  // JWT 토큰 생성 클래스 주입

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Operation(
            summary = "로그인",
            description = "로그인",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    content = @io.swagger.v3.oas.annotations.media.Content(
                            mediaType = "application/json",
                            examples = @io.swagger.v3.oas.annotations.media.ExampleObject(
                                    name = "로그인 요청 예시",
                                    summary = "로그인 요청 예시",
                                    value = "{\n" +
                                            "  \"email\": \"user@example.com\",\n" +
                                            "  \"password\": \"password123\"\n" +
                                            "}"
                            )
                    )
            ),
            responses = @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    content = @io.swagger.v3.oas.annotations.media.Content(
                            mediaType = "application/json",
                            examples = @io.swagger.v3.oas.annotations.media.ExampleObject(
                                    name = "로그인 응답 예시",
                                    value = "{\n" +
                                            "  \"token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\"\n" +
                                            "}"
                            )
                    )
            )
    )
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequestDTO loginRequest) {
        logger.info("로그인 요청 수신: {}", loginRequest.getEmail());

        try {
            // 사용자 인증
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            // JWT 토큰 생성
            String jwt = jwtTokenProvider.generateToken(loginRequest.getEmail());
            logger.info("로그인 성공: {}", loginRequest.getEmail());

            // 토큰 반환
            return ResponseEntity.ok(new JwtLoginResponseDTO(jwt));
        } catch (Exception e) {
            logger.warn("로그인 실패: {}", e.getMessage());
            return ResponseEntity.status(401).body("로그인 실패: 이메일 또는 비밀번호를 확인하세요.");
        }
    }


    @Autowired
    private JwtBlacklistService jwtBlacklistService;

    @Operation(
            summary = "로그아웃",
            description = "로그아웃",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    content = @io.swagger.v3.oas.annotations.media.Content(
                            mediaType = "application/json",
                            examples = @io.swagger.v3.oas.annotations.media.ExampleObject(
                                    name = "로그아웃 요청 예시",
                                    value = "{\n" +
                                            "  \"Authorization\": \"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\"\n" +
                                            "}"
                            )
                    )
            ),
            responses = @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    content = @io.swagger.v3.oas.annotations.media.Content(
                            mediaType = "application/json",
                            examples = @io.swagger.v3.oas.annotations.media.ExampleObject(
                                    name = "로그아웃 응답 예시",
                                    value = "{\n" +
                                            "  \"message\": \"로그아웃되었습니다.\"\n" +
                                            "}"
                            )
                    )
            )
    )
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String token) {
        logger.info("로그아웃 요청 수신");

        // JWT 토큰을 블랙리스트에 추가
        if (token.startsWith("Bearer ")) {
            String jwt = token.substring(7);
            jwtBlacklistService.addToBlacklist(jwt);
            logger.info("JWT 토큰 블랙리스트에 추가됨");
        } else {
            logger.warn("유효하지 않은 토큰으로 로그아웃 시도");
            return ResponseEntity.badRequest().body("유효하지 않은 토큰입니다.");
        }
        return ResponseEntity.ok("로그아웃되었습니다.");
    }

    @Operation(
            summary = "루트 엔드포인트",
            description = "/spring_api로 접근 시 동작",
            responses = @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    content = @io.swagger.v3.oas.annotations.media.Content(
                            mediaType = "application/json",
                            examples = @io.swagger.v3.oas.annotations.media.ExampleObject(
                                    name = "루트 엔드포인트 응답 예시",
                                    value = "{\n" +
                                            "  \"message\": \"정상작동합니다.\"\n" +
                                            "}"
                            )
                    )
            )
    )
    @GetMapping
    public ResponseEntity<String> rootEndpoint() {
        logger.info("루트 엔드포인트 접근");
        return ResponseEntity.ok("정상작동합니다.");
    }
}
