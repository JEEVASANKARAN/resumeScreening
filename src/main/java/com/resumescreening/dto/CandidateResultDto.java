package com.resumescreening.dto;

import java.util.List;

/**
 * DTO representing the analysis result for a single candidate's resume
 * in a batch screening request.
 */
public class CandidateResultDto {

    /** Candidate name derived from the filename (without extension) */
    private String candidateName;

    /** Original uploaded filename */
    private String fileName;

    /** Match score as a percentage (0–100) */
    private double score;

    /** "Shortlisted" if score >= 60, otherwise "Rejected" */
    private String status;

    /** List of JD keywords found in this resume */
    private List<String> matchedSkills;

    public CandidateResultDto() {}

    public CandidateResultDto(String candidateName, String fileName,
                               double score, String status, List<String> matchedSkills) {
        this.candidateName = candidateName;
        this.fileName      = fileName;
        this.score         = score;
        this.status        = status;
        this.matchedSkills = matchedSkills;
    }

    public String getCandidateName()              { return candidateName; }
    public void   setCandidateName(String v)      { this.candidateName = v; }

    public String getFileName()                   { return fileName; }
    public void   setFileName(String v)           { this.fileName = v; }

    public double getScore()                      { return score; }
    public void   setScore(double v)              { this.score = v; }

    public String getStatus()                     { return status; }
    public void   setStatus(String v)             { this.status = v; }

    public List<String> getMatchedSkills()        { return matchedSkills; }
    public void   setMatchedSkills(List<String> v){ this.matchedSkills = v; }
}
