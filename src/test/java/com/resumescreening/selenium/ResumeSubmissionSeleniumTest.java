package com.resumescreening.selenium;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.nio.file.Paths;
import java.time.Duration;

/**
 * Selenium end-to-end tests for the Resume Screening frontend.
 *
 * Spring Boot is started automatically on a defined port (8080) before
 * the tests run, so NO manual server startup is required.
 *
 * The frontend (index.html) is served by Spring Boot from
 * src/main/resources/static/ at http://localhost:8080/.
 *
 * Prerequisites:
 *   - Google Chrome installed (WebDriverManager downloads ChromeDriver automatically)
 *   - Sample resume PDF at src/test/resources/sample_resume.pdf
 *
 * Run with: mvn test -Dtest=ResumeSubmissionSeleniumTest
 */
@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class ResumeSubmissionSeleniumTest {

    /** Injected by Spring – resolves to the random assigned port */
    @LocalServerPort
    private int port;

    /** Absolute path to the sample resume PDF used for upload */
    private static final String SAMPLE_RESUME =
            Paths.get("src/test/resources/sample_resume.pdf")
                 .toAbsolutePath()
                 .toString();

    /** Wait up to 20 s for UI elements to appear (API call can take a moment) */
    private static final int WAIT_SECONDS = 20;

    // -----------------------------------------------------------------------
    // Driver lifecycle – one browser instance shared across all tests
    // -----------------------------------------------------------------------
    private static WebDriver driver;
    private static WebDriverWait wait;

    @BeforeAll
    static void setUpDriver() {
        WebDriverManager.chromedriver().setup();

        ChromeOptions options = new ChromeOptions();
        // Uncomment to run headless (no visible browser window):
        // options.addArguments("--headless=new");
        options.addArguments("--start-maximized");
        options.addArguments("--disable-extensions");
        // Allow file upload via sendKeys even in headless mode
        options.addArguments("--allow-file-access-from-files");

        driver = new ChromeDriver(options);
        wait   = new WebDriverWait(driver, Duration.ofSeconds(WAIT_SECONDS));
    }

    @AfterAll
    static void tearDownDriver() {
        if (driver != null) {
            driver.quit();
        }
    }

    /** Helper: returns the base URL using the injected port */
    private String baseUrl() {
        return "http://localhost:" + port + "/";
    }

    // -----------------------------------------------------------------------
    // TC-01 : Page loads and all form elements are visible
    // -----------------------------------------------------------------------
    @Test
    @Order(1)
    void testPageLoadsWithForm() {
        driver.get(baseUrl());

        WebElement fileInput = wait.until(
                ExpectedConditions.presenceOfElementLocated(By.id("resumeFile")));
        Assertions.assertTrue(fileInput.isDisplayed(), "File input should be visible");

        WebElement jdInput = driver.findElement(By.id("jobDescription"));
        Assertions.assertTrue(jdInput.isDisplayed(), "JD textarea should be visible");

        WebElement btn = driver.findElement(By.id("analyzeBtn"));
        Assertions.assertTrue(btn.isDisplayed(), "Analyse button should be visible");
    }

    // -----------------------------------------------------------------------
    // TC-02 : Full flow – upload resume + JD → result shows score & status
    // -----------------------------------------------------------------------
    @Test
    @Order(2)
    void testResumeSubmissionShowsResult() {
        driver.get(baseUrl());

        // Upload resume
        WebElement fileInput = wait.until(
                ExpectedConditions.presenceOfElementLocated(By.id("resumeFile")));
        fileInput.sendKeys(SAMPLE_RESUME);

        // Fill JD
        WebElement jdInput = driver.findElement(By.id("jobDescription"));
        jdInput.clear();
        jdInput.sendKeys(
                "We are looking for a Java Spring Boot developer with REST API and SQL experience. "
              + "Experience with Docker and Kubernetes is a plus.");

        // Click Analyse
        driver.findElement(By.id("analyzeBtn")).click();

        // Wait for result section OR error message
        WebElement resultSection = driver.findElement(By.id("resultSection"));
        WebElement errorMsg = driver.findElement(By.id("errorMessage"));

        wait.until(d -> {
            if (errorMsg.isDisplayed()) {
                Assertions.fail("Frontend returned error instead of success: " + errorMsg.getText());
            }
            return resultSection.isDisplayed();
        });

        // Score must be a non-empty string
        String scoreText = driver.findElement(By.id("score")).getText();
        Assertions.assertFalse(scoreText.isBlank(), "Score must not be blank");

        // Status must be Shortlisted or Rejected
        String statusText = driver.findElement(By.id("status")).getText();
        Assertions.assertTrue(
                statusText.contains("Shortlisted") || statusText.contains("Rejected"),
                "Status must be 'Shortlisted' or 'Rejected', but was: " + statusText);
    }

    // -----------------------------------------------------------------------
    // TC-03 : Submit without file → error message appears
    // -----------------------------------------------------------------------
    @Test
    @Order(3)
    void testSubmitWithoutFileShouldShowError() {
        driver.get(baseUrl());

        // Fill JD but skip file upload
        WebElement jdInput = wait.until(
                ExpectedConditions.presenceOfElementLocated(By.id("jobDescription")));
        jdInput.clear();
        jdInput.sendKeys("Java Spring Boot developer needed.");

        driver.findElement(By.id("analyzeBtn")).click();

        // Error element must appear
        WebElement errorEl = wait.until(
                ExpectedConditions.visibilityOfElementLocated(By.id("errorMessage")));
        Assertions.assertFalse(errorEl.getText().isBlank(),
                "An error message should appear when no file is selected");
    }
}
