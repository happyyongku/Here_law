package org.ssafyb109.here_law.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Entity
public class LawyerEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long lawyerId;

    private String expertiseMain;

    @ElementCollection
    @CollectionTable(name = "lawyer_expertise_sub", joinColumns = @JoinColumn(name = "lawyer_id"))
    private List<String> expertiseSub;

    private String officeLocation;
    private String qualification;
    private String description;

    @OneToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;  // UserEntity와의 일대일 관계 설정
}
