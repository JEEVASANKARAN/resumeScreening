package com.resumescreening.service;

import com.resumescreening.dto.ResponseDto;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Core matching engine that compares resume text against job description keywords.
 *
 * <p>Matching is performed at the <strong>word level</strong> – the resume is
 * tokenized into a set of individual words and each JD keyword must appear as
 * an exact word in that set.  This prevents false positives where a short
 * keyword (e.g. "C") would match as a substring inside unrelated words such as
 * "certificate" or "course".</p>
 */
@Service
public class MatchingService {

    // Common English stopwords to exclude from JD keyword extraction
    private static final Set<String> STOPWORDS = Set.of(
            "and", "the", "with", "a", "an", "in", "of", "to", "for",
            "is", "are", "on", "at", "by", "or", "as", "be", "this",
            "that", "it", "we", "you", "have", "has", "from", "will"
    );

    /**
     * Splits text on whitespace AND common separator characters (slash, comma,
     * pipe, semicolon, dash) so that compound tokens like "Java/Spring" or
     * "Python, R" are correctly broken into individual words before matching.
     */
    private static final String TOKEN_SPLIT_REGEX = "[\\s,;/|\\-]+";

    /**
     * Analyzes resume text against a job description and returns a match result.
     *
     * @param resumeText raw text extracted from the resume
     * @param jd         the job description provided by the user
     * @return ResponseDto containing score, status, and matched skills
     */
    public ResponseDto analyze(String resumeText, String jd) {

        // --- Step 1: Normalize both inputs to lowercase ---
        String normalizedResume = resumeText.toLowerCase().trim();
        String normalizedJd    = jd.toLowerCase().trim();

        // --- Step 2: Tokenize JD into individual keywords ---
        String[] jdTokens = normalizedJd.split(TOKEN_SPLIT_REGEX);

        // --- Step 3: Clean tokens, remove stopwords, deduplicate ---
        List<String> keywords = Arrays.stream(jdTokens)
                .map(String::trim)
                .map(token -> token.replaceAll("[^a-z0-9#+.]", ""))   // strip stray punctuation
                .filter(token -> !token.isBlank())
                .filter(token -> !STOPWORDS.contains(token))
                .distinct()
                .toList();

        if (keywords.isEmpty()) {
            return new ResponseDto(0.0, "Rejected", List.of());
        }

        // --- Step 4: Build a word-level token SET from the resume ---
        // Splitting on the same separators ensures "Java/Spring" → {"java","spring"}
        Set<String> resumeWordSet = Arrays.stream(normalizedResume.split(TOKEN_SPLIT_REGEX))
                .map(token -> token.replaceAll("[^a-z0-9#+.]", ""))
                .filter(token -> !token.isBlank())
                .collect(Collectors.toSet());

        // --- Step 5: Exact-word match: keyword must be its own token in the resume ---
        // This prevents "c" from matching inside "certificate", "course", etc.
        List<String> matchedSkills = new ArrayList<>();
        for (String keyword : keywords) {
            if (resumeWordSet.contains(keyword)) {
                matchedSkills.add(keyword);
            }
        }

        // --- Step 6: Calculate match score ---
        double score = ((double) matchedSkills.size() / keywords.size()) * 100;
        score = Math.round(score * 100.0) / 100.0;   // 2 decimal places

        // --- Step 7: Determine shortlisting status ---
        String status = score >= 60 ? "Shortlisted" : "Rejected";

        return new ResponseDto(score, status, matchedSkills);
    }
}
