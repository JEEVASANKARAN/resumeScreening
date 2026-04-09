package com.resumescreening.dto;

import java.util.List;

/**
 * DTO representing the resume analysis result returned to the client.
 */
public class ResponseDto {

    /** Match score as a percentage (0–100) */
    private double score;

    /** "Shortlisted" if score >= 60, otherwise "Rejected" */
    private String status;

    /** List of JD keywords found in the resume */
    private List<String> matchedSkills;

    public ResponseDto() {}

    public ResponseDto(double score, String status, List<String> matchedSkills) {
        this.score = score;
        this.status = status;
        this.matchedSkills = matchedSkills;
    }

    public double getScore() {
        return score;
    }

    public void setScore(double score) {
        this.score = score;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<String> getMatchedSkills() {
        return matchedSkills;
    }

    public void setMatchedSkills(List<String> matchedSkills) {
        this.matchedSkills = matchedSkills;
    }
}
