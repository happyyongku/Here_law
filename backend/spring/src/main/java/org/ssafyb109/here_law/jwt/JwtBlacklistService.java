package org.ssafyb109.here_law.jwt;

import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class JwtBlacklistService {

    private Set<String> blacklist = new HashSet<>();

    // JWT 토큰을 블랙리스트에 추가
    public void addToBlacklist(String token) {
        blacklist.add(token);
    }

    // 토큰이 블랙리스트에 있는지 확인
    public boolean isBlacklisted(String token) {
        return blacklist.contains(token);
    }
}