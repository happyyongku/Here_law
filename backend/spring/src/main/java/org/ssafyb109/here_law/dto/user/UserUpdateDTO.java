package org.ssafyb109.here_law.dto.user;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UserUpdateDTO {
    private String nickname;
    private String phoneNumber;
    private String profileImg;
    private List<String> interests;

    private LawyerUpdateDTO lawyerUpdate;
}
