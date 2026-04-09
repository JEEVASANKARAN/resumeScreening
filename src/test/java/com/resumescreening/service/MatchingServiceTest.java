package com.resumescreening.service;

import com.resumescreening.dto.ResponseDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for {@link MatchingService}.
 * No Spring context needed – plain JUnit 5 tests.
 */
class MatchingServiceTest {

    private MatchingService matchingService;

    @BeforeEach
    void setUp() {
        matchingService = new MatchingService();
    }

    // -----------------------------------------------------------------------
    // 1. High-match scenario – resume clearly covers the JD
    // -----------------------------------------------------------------------
    @Test
    void whenResumeCoversJd_thenShortlisted() {
        String resume = "Experienced Java developer with Spring Boot and REST API expertise. "
                + "Proficient in SQL, Docker, and Kubernetes. Familiar with CI/CD pipelines.";

        String jd = "We need a Java Spring Boot developer with REST API and SQL skills. "
                + "Experience with Docker and Kubernetes is a plus.";

        ResponseDto result = matchingService.analyze(resume, jd);

        assertTrue(result.getScore() >= 60,
                "Score should be >= 60 for a matching resume, but was " + result.getScore());
        assertEquals("Shortlisted", result.getStatus());
        assertFalse(result.getMatchedSkills().isEmpty(), "Matched skills should not be empty");
        assertTrue(result.getMatchedSkills().contains("java"),
                "Expected 'java' in matched skills");
    }

    // -----------------------------------------------------------------------
    // 2. Low-match scenario – resume is unrelated to the JD
    // -----------------------------------------------------------------------
    @Test
    void whenResumeMismatchesJd_thenRejected() {
        String resume = "Experienced chef specialising in Italian cuisine and pastry arts.";
        String jd    = "Looking for a Python machine learning engineer with TensorFlow experience.";

        ResponseDto result = matchingService.analyze(resume, jd);

        assertTrue(result.getScore() < 60,
                "Score should be < 60 for a non-matching resume, but was " + result.getScore());
        assertEquals("Rejected", result.getStatus());
    }

    // -----------------------------------------------------------------------
    // 3. Empty JD → score 0, rejected, empty matched skills
    // -----------------------------------------------------------------------
    @Test
    void whenJdIsEmpty_thenRejectedWithZeroScore() {
        String resume = "Java developer with 5 years of experience.";
        String jd     = "";

        ResponseDto result = matchingService.analyze(resume, jd);

        assertEquals(0.0, result.getScore(), 0.001);
        assertEquals("Rejected", result.getStatus());
        assertEquals(List.of(), result.getMatchedSkills());
    }

    // -----------------------------------------------------------------------
    // 4. JD contains only stopwords → treated as empty keywords list
    // -----------------------------------------------------------------------
    @Test
    void whenJdContainsOnlyStopwords_thenRejectedWithZeroScore() {
        String resume = "Java developer with extensive experience.";
        String jd     = "and the with a an in of to for is are on at by or as be";

        ResponseDto result = matchingService.analyze(resume, jd);

        assertEquals(0.0, result.getScore(), 0.001,
                "All stopwords should yield zero score");
        assertEquals("Rejected", result.getStatus());
    }

    // -----------------------------------------------------------------------
    // 5. Exact full keyword match → score = 100, shortlisted
    // -----------------------------------------------------------------------
    @Test
    void whenResumeMatchesEveryJdKeyword_thenHundredPercent() {
        String jd     = "java spring docker";
        String resume = "I know java, spring framework, and docker containers.";

        ResponseDto result = matchingService.analyze(resume, jd);

        assertEquals(100.0, result.getScore(), 0.001);
        assertEquals("Shortlisted", result.getStatus());
        assertEquals(3, result.getMatchedSkills().size());
    }

    // -----------------------------------------------------------------------
    // 6. Case insensitivity – JD keyword in upper-case, resume in lower case
    // -----------------------------------------------------------------------
    @Test
    void whenKeywordsAreMixedCase_thenCaseInsensitiveMatch() {
        String jd     = "JAVA SPRING BOOT";
        String resume = "experienced java spring boot developer";

        ResponseDto result = matchingService.analyze(resume, jd);

        assertTrue(result.getScore() > 0,
                "Case-insensitive match should yield a score > 0");
        assertTrue(result.getMatchedSkills().contains("java"));
    }

    // -----------------------------------------------------------------------
    // 7. Score boundary – exactly 60 % → shortlisted
    // -----------------------------------------------------------------------
    @Test
    void whenScoreExactlySixty_thenShortlisted() {
        // JD has 5 meaningful keywords after stopword removal.
        // Resume contains 3 of them → 3/5 = 60 %.
        String jd     = "python tensorFlow docker kafka elasticsearch";
        String resume = "I use python, docker and kafka daily.";

        ResponseDto result = matchingService.analyze(resume, jd);

        assertEquals(60.0, result.getScore(), 0.01);
        assertEquals("Shortlisted", result.getStatus());
    }
}
