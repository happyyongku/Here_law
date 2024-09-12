package org.ssafyb109.here_law.controller;

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

@RestController
@RequestMapping("/spring_api")
public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtTokenProvider;  // JWT 토큰 생성 클래스 주입

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequestDTO loginRequest) {
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

        // 토큰 반환
        return ResponseEntity.ok(new JwtLoginResponseDTO(jwt));
    }


    @Autowired
    private JwtBlacklistService jwtBlacklistService;

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String token) {
        // JWT 토큰을 블랙리스트에 추가
        if (token.startsWith("Bearer ")) {
            String jwt = token.substring(7);
            jwtBlacklistService.addToBlacklist(jwt);
        }
        return ResponseEntity.ok("로그아웃되었습니다.");
    }
}
