package org.ssafyb109.here_law.jwt;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.UUID;

@Component
public class JwtUtil {
    @Value("${jwt.secret}")
    private String JWT_SECRET;

    @Value("${jwt.expiration}")
    private long JWT_EXPIRATION;

    // JWT 토큰 생성
    public String generateToken(String email) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + JWT_EXPIRATION);

        return Jwts.builder()
                .setSubject(email)  // 토큰에 email 정보 저장
                .setIssuedAt(new Date())  // 토큰 발급 시간
                .setExpiration(expiryDate)  // 토큰 만료 시간
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)  // SecretKeySpec을 사용해 서명
                .compact();
    }

    // JWT 토큰에서 사용자 이메일 추출
    public String getUserEmailFromJWT(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())  // SecretKeySpec을 사용
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // JWT 토큰 유효성 검증
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())  // SecretKeySpec을 사용
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            // 검증 실패 시 상세 로그 출력
            System.out.println("JWT 토큰 검증 실패: " + e.getMessage());
            return false;
        }
    }

    // 비밀키를 SecretKeySpec으로 변환
    private Key getSigningKey() {
        byte[] keyBytes = JWT_SECRET.getBytes(StandardCharsets.UTF_8);
        return new SecretKeySpec(keyBytes, SignatureAlgorithm.HS512.getJcaName());
    }

    // 이메일 인증
    public String generateEmailToken() {
        return UUID.randomUUID().toString();
    }
}
