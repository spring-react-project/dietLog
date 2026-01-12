package jpabook.jpabasic;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class JpabasicApplication {

	public static void main(String[] args) {
		SpringApplication.run(JpabasicApplication.class, args);
	}

}
