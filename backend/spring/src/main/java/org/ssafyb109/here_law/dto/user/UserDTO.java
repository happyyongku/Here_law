package org.ssafyb109.here_law.dto.user;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class UserDTO {
    private String nickname;
    private String email;
    private String password;
    private String profileImg;
    private String userType;  // "normal" or "lawyer"
    private Boolean isFirst;
    private LocalDateTime createdDate;
    private LocalDateTime updateDate;
    private List<String> interests;
    private List<String> subscriptions;
    private LawyerDTO lawyerDTO;
}