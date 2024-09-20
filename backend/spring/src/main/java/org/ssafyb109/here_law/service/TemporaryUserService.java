package org.ssafyb109.here_law.service;

import org.springframework.stereotype.Service;
import org.ssafyb109.here_law.dto.user.UserDTO;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TemporaryUserService {

    private final Map<String, UserDTO> temporaryUsers = new ConcurrentHashMap<>();

    // 사용자 정보 임시 저장
    public void saveUser(String token, UserDTO userDTO) {
        temporaryUsers.put(token, userDTO);
    }

    // 토큰으로 사용자 정보 가져오기
    public Optional<UserDTO> getUser(String token) {
        return Optional.ofNullable(temporaryUsers.get(token));
    }

    // 임시 저장된 사용자 정보 삭제
    public void deleteUser(String token) {
        temporaryUsers.remove(token);
    }
}
