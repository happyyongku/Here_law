package org.ssafyb109.here_law.document;

import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.elasticsearch.annotations.Document;

import java.util.List;

@Getter
@Setter
@Document(indexName = "users")
public class UserDocument {

    @Id
    private Long id;

    private String nickname;
    private String email;
    private List<String> interests;
    private List<String> subscriptions;
}