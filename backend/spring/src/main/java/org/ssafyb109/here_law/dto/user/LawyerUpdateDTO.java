package org.ssafyb109.here_law.dto.user;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class LawyerUpdateDTO {
    private String expertiseMain;
    private List<String> expertiseSub;
    private String officeLocation;
    private String qualification;
    private String description;
}
