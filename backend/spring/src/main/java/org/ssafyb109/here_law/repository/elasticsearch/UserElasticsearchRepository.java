package org.ssafyb109.here_law.repository.elasticsearch;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;
import org.ssafyb109.here_law.document.UserDocument;

import java.util.List;

@Repository("userElasticsearchRepository")
public interface UserElasticsearchRepository extends ElasticsearchRepository<UserDocument, Long> {
    List<UserDocument> findByNicknameContaining(String nickname);
}