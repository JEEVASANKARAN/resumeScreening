package com.resumescreening.dto;

import java.util.List;

/**
 * DTO wrapping the batch screening result – a list of per-candidate results
 * sorted by score descending, plus aggregate counts.
 */
public class BatchResponseDto {

    /** Per-candidate results, sorted by score descending */
    private List<CandidateResultDto> candidates;

    /** Number of resumes successfully processed */
    private int totalProcessed;

    /** Number of candidates with status "Shortlisted" */
    private int shortlistedCount;

    public BatchResponseDto() {}

    public BatchResponseDto(List<CandidateResultDto> candidates, int totalProcessed, int shortlistedCount) {
        this.candidates       = candidates;
        this.totalProcessed   = totalProcessed;
        this.shortlistedCount = shortlistedCount;
    }

    public List<CandidateResultDto> getCandidates()             { return candidates; }
    public void setCandidates(List<CandidateResultDto> v)       { this.candidates = v; }

    public int getTotalProcessed()                              { return totalProcessed; }
    public void setTotalProcessed(int v)                        { this.totalProcessed = v; }

    public int getShortlistedCount()                            { return shortlistedCount; }
    public void setShortlistedCount(int v)                      { this.shortlistedCount = v; }
}
