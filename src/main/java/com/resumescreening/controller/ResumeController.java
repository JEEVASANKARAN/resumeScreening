package com.resumescreening.controller;

import com.resumescreening.dto.BatchResponseDto;
import com.resumescreening.dto.CandidateResultDto;
import com.resumescreening.dto.ResponseDto;
import com.resumescreening.service.MatchingService;
import com.resumescreening.service.ResumeParserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

/**
 * REST controller exposing resume screening endpoints.
 *
 * <ul>
 *   <li>{@code POST /analyze}       – single resume (legacy, unchanged)</li>
 *   <li>{@code POST /analyze-batch} – multiple resumes against one JD</li>
 * </ul>
 */
@RestController
@CrossOrigin(origins = "*")
public class ResumeController {

    private static final Logger log = LoggerFactory.getLogger(ResumeController.class);

    private final ResumeParserService parserService;
    private final MatchingService     matchingService;

    public ResumeController(ResumeParserService parserService, MatchingService matchingService) {
        this.parserService  = parserService;
        this.matchingService = matchingService;
    }

    // -------------------------------------------------------------------------
    // Single-resume endpoint (original – unchanged)
    // -------------------------------------------------------------------------

    /**
     * Analyzes a single resume file against a job description.
     *
     * @param file the uploaded resume (PDF or DOCX)
     * @param jd   the job description text
     * @return JSON response with score, status, and matched skills
     */
    @PostMapping("/analyze")
    public ResponseEntity<ResponseDto> analyzeResume(
            @RequestParam("file") MultipartFile file,
            @RequestParam("jd")   String jd) {

        String resumeText = parserService.extractText(file);
        ResponseDto result = matchingService.analyze(resumeText, jd);
        return ResponseEntity.ok(result);
    }

    // -------------------------------------------------------------------------
    // Batch-resume endpoint (new)
    // -------------------------------------------------------------------------

    /**
     * Analyzes multiple resume files against a single job description.
     *
     * <p>Each file is parsed independently. If a file fails to parse it is
     * skipped (a warning is logged) so the remaining resumes are still
     * processed. Results are sorted by score descending.</p>
     *
     * @param files array of uploaded resume files (PDF or DOCX)
     * @param jd    the job description text
     * @return {@link BatchResponseDto} containing per-candidate results and summary counts
     */
    @PostMapping("/analyze-batch")
    public ResponseEntity<BatchResponseDto> analyzeBatch(
            @RequestParam("files") MultipartFile[] files,
            @RequestParam("jd")    String jd) {

        if (files == null || files.length == 0) {
            throw new IllegalArgumentException("Please upload at least one resume file.");
        }
        if (jd == null || jd.isBlank()) {
            throw new IllegalArgumentException("Job description cannot be empty.");
        }

        List<CandidateResultDto> candidates = new ArrayList<>();

        for (MultipartFile file : files) {
            if (file == null || file.isEmpty()) {
                log.warn("Skipping an empty or null file entry in the batch.");
                continue;
            }

            String originalFilename = file.getOriginalFilename() != null
                    ? file.getOriginalFilename()
                    : "unknown";

            // Derive a human-readable candidate name from the filename
            String candidateName = deriveCandidateName(originalFilename);

            try {
                String resumeText = parserService.extractText(file);
                ResponseDto match = matchingService.analyze(resumeText, jd);

                candidates.add(new CandidateResultDto(
                        candidateName,
                        originalFilename,
                        match.getScore(),
                        match.getStatus(),
                        match.getMatchedSkills()
                ));
            } catch (Exception ex) {
                // Skip files that cannot be parsed; log a warning
                log.warn("Failed to process file '{}': {}", originalFilename, ex.getMessage());
            }
        }

        // Sort by score descending (highest match first)
        candidates.sort(Comparator.comparingDouble(CandidateResultDto::getScore).reversed());

        int shortlistedCount = (int) candidates.stream()
                .filter(c -> "Shortlisted".equals(c.getStatus()))
                .count();

        BatchResponseDto response = new BatchResponseDto(candidates, candidates.size(), shortlistedCount);
        return ResponseEntity.ok(response);
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    /**
     * Strips the file extension and replaces underscores/hyphens with spaces
     * to produce a display-friendly candidate name.
     *
     * <p>Examples:
     * <ul>
     *   <li>{@code john_doe_resume.pdf} → {@code john doe resume}</li>
     *   <li>{@code Alice-CV.docx}       → {@code Alice CV}</li>
     * </ul>
     * </p>
     */
    private String deriveCandidateName(String filename) {
        // Remove extension
        int dotIndex = filename.lastIndexOf('.');
        String base = (dotIndex > 0) ? filename.substring(0, dotIndex) : filename;
        // Replace underscores and hyphens with spaces, trim extra whitespace
        return base.replaceAll("[_\\-]+", " ").trim();
    }
}
