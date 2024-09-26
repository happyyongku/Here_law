package org.ssafyb109.here_law.dto.jwt;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JwtLoginResponseDTO {
    private String token;

    public JwtLoginResponseDTO(String token) {
        this.token = token;
    }
}
