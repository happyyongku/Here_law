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

    @ElementCollection
    @CollectionTable(name = "lawyer_expertise", joinColumns = @JoinColumn(name = "lawyer_id"))
    private List<String> expertise;

    private String officeLocation;
    private String qualification;
    private String description;
    private Integer point = 0;  // 변호사의 내공, 기본값은 0
    private String phoneNumber;  // 변호사의 전화번호

    @OneToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;  // UserEntity와의 일대일 관계 설정
}
