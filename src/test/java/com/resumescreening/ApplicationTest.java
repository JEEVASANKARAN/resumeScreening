package com.resumescreening;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Smoke test: verifies the Spring application context loads without errors.
 * Run with: mvn test -Dtest=ApplicationTest
 */
@SpringBootTest
class ApplicationTest {

    @Test
    void contextLoads() {
        // If the Spring context fails to start, this test will fail automatically.
    }
}
