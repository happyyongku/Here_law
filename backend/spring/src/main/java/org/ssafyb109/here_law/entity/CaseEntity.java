package org.ssafyb109.here_law.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@Entity
@Table(name = "legal_cases")
public class CaseEntity {

    @Id
    @Column(name = "case_info_id")
    private String caseInfoId;

    @Column(name = "case_name")
    private String caseName;

    @Column(name = "case_number_judgment_date")
    private String caseNumberJudgmentDate;

    @Column(name = "judgment")
    private String judgment;

    @Column(name = "court_name")
    private String courtName;

    @Column(name = "case_type")
    private String caseType;

    @Column(name = "judgment_type")
    private String judgmentType;

    @Column(name = "issues")
    private String issues;

    @Column(name = "judgment_summary")
    private String judgmentSummary;

    @Column(name = "reference_clause")
    private String referenceClause;

    @Column(name = "reference_cases")
    private String referenceCases;

    @Column(name = "full_text")
    private String fullText;
}
