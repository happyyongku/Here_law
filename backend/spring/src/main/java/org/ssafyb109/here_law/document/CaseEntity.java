package org.ssafyb109.here_law.document;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.elasticsearch.annotations.Document;

@Setter
@Getter
@Entity
@Document(indexName = "cases")
public class CaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String summary;

    // 기본 생성자
    public CaseEntity() {
    }

    // 생성자
    public CaseEntity(String summary) {
        this.summary = summary;
    }
}