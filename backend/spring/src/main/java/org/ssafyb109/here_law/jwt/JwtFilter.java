package org.ssafyb109.here_law.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil tokenProvider;

    @Autowired
    private JwtBlacklistService blacklistService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String token = getJwtFromRequest(request);

        if (token != null && tokenProvider.validateToken(token)) {
            if (blacklistService.isBlacklisted(token)) {
                logger.warn("이 토큰은 블랙리스트에 등록되어 있습니다: " + token);
            } else {
                try {
                    String userEmail = tokenProvider.getUserEmailFromJWT(token);
                    logger.debug("JWT 토큰 검증 성공. 사용자 이메일: " + userEmail);

                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userEmail, null, null);
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                } catch (Exception e) {
                    logger.error("JWT 토큰 검증 중 오류 발생: " + e.getMessage());
                }
            }
        } else {
            logger.warn("유효하지 않은 JWT 토큰이거나 존재하지 않습니다.");
        }

        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");

        if (bearerToken == null) {
            logger.warn("Authorization 헤더가 존재하지 않습니다.");
            return null;
        }

        if (!bearerToken.startsWith("Bearer ")) {
            logger.warn("Authorization 헤더가 'Bearer '로 시작하지 않습니다.");
            return null;
        }

        String token = bearerToken.substring(7);
        logger.info("JWT 토큰 추출 성공: " + token);
        return token;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();

        // JWT 검증이 필요 없는 엔드포인트들을 지정합니다.
        return path.startsWith("/swagger-ui") ||
                path.startsWith("/v3/api-docs") ||
                path.startsWith("/swagger-resources") ||
                path.equals("/spring_api/register") ||                 // 회원가입 엔드포인트 제외
                path.equals("/spring_api/login") ||                    // 로그인 엔드포인트 제외
                path.equals("/spring_api/send-verification-code") ||   // 이메일 인증 코드 발송 제외
                path.equals("/spring_api/verify-code");                // 이메일 인증 코드 검증 제외
    }
}
