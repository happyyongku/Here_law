package org.ssafyb109.here_law;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableTransactionManagement
@EnableJpaRepositories(basePackages = "org.ssafyb109.here_law.repository.jpa")  // JPA 레포지토리 패키지 지정
@EnableElasticsearchRepositories(basePackages = "org.ssafyb109.here_law.repository.elasticsearch")  // Elasticsearch 레포지토리 패키지 지정
public class HereLawApplication {

	public static void main(String[] args) {
		SpringApplication.run(HereLawApplication.class, args);
	}

}
