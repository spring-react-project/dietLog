package jpabook.jpabasic.config;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.util.StreamUtils;

import java.nio.charset.StandardCharsets;

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "app.db.migration.enabled", havingValue = "true", matchIfMissing = false)
public class DatabaseMigration {

    private final JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void migrate() {
        try {
            log.info("Starting database migration: removing name column from meals table");
            
            // name 컬럼이 존재하는지 확인
            String checkColumnSql = "SELECT COUNT(*) FROM information_schema.COLUMNS " +
                    "WHERE TABLE_SCHEMA = DATABASE() " +
                    "AND TABLE_NAME = 'meals' " +
                    "AND COLUMN_NAME = 'name'";
            
            Integer columnExists = jdbcTemplate.queryForObject(checkColumnSql, Integer.class);
            
            if (columnExists != null && columnExists > 0) {
                // MySQL 8.0.19+ 에서는 DROP COLUMN IF EXISTS 지원
                try {
                    jdbcTemplate.execute("ALTER TABLE meals DROP COLUMN name");
                    log.info("Successfully removed 'name' column from meals table");
                } catch (Exception e) {
                    // IF EXISTS를 지원하지 않는 경우
                    log.warn("Could not use DROP COLUMN IF EXISTS, trying without IF EXISTS");
                    try {
                        jdbcTemplate.execute("ALTER TABLE meals DROP COLUMN name");
                        log.info("Successfully removed 'name' column from meals table");
                    } catch (Exception e2) {
                        log.error("Failed to remove 'name' column: " + e2.getMessage());
                    }
                }
            } else {
                log.info("'name' column does not exist in meals table, skipping migration");
            }
        } catch (Exception e) {
            log.error("Database migration failed: " + e.getMessage(), e);
        }
    }
}
