package org.ssafyb109.here_law.dto.jwt;

import org.ssafyb109.here_law.entity.LawyerEntity;
import org.ssafyb109.here_law.entity.UserEntity;

public class LawyerResponseDTO {
    private UserEntity user;
    private LawyerEntity lawyer;

    public LawyerResponseDTO(UserEntity user, LawyerEntity lawyer) {
        this.user = user;
        this.lawyer = lawyer;
    }

    // Getters and Setters
    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public LawyerEntity getLawyer() {
        return lawyer;
    }

    public void setLawyer(LawyerEntity lawyer) {
        this.lawyer = lawyer;
    }
}
