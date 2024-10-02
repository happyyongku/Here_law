package org.ssafyb109.here_law.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsMvcConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                        "http://localhost:8080",
                        "http://localhost:5173",
                        "http://192.168.31.65:8080",
                        "https://j11b109.p.ssafy.io",
                        "http://j11b109.p.ssafy.io",
                        "https://")  // 프론트엔드 도메인 허용
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")  // 모든 헤더 허용
                .exposedHeaders("Authorization")
                .allowCredentials(true);  // 자격 증명 허용
    }
}