package org.ssafyb109.here_law.jwt;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Date;

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
                .signWith(SignatureAlgorithm.HS512, JWT_SECRET)  // 서명 알고리즘 및 비밀키 설정
                .compact();
    }

    // JWT 토큰에서 사용자 이메일 추출
    public String getUserEmailFromJWT(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(JWT_SECRET)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // JWT 토큰 유효성 검증
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(JWT_SECRET)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            // 검증 실패 시 상세 로그 출력
            System.out.println("JWT 토큰 검증 실패: " + e.getMessage());
            return false;
        }
    }

    // 비밀키를 바이트 배열로 변환
    private SecretKeySpec getSigningKey() {
        byte[] keyBytes = JWT_SECRET.getBytes(StandardCharsets.UTF_8);
        return new SecretKeySpec(keyBytes, SignatureAlgorithm.HS512.getJcaName());
    }
}
