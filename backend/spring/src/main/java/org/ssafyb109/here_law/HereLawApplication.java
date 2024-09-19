package org.ssafyb109.here_law;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableTransactionManagement
public class HereLawApplication {

	public static void main(String[] args) {
		SpringApplication.run(HereLawApplication.class, args);
	}

}
