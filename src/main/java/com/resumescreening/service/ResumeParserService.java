package com.resumescreening.service;

import org.apache.tika.Tika;
import org.apache.tika.exception.TikaException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

/**
 * Service responsible for extracting plain text from uploaded resume files.
 * Supports PDF, DOCX, and any other format Apache Tika can handle.
 */
@Service
public class ResumeParserService {

    // Apache Tika instance (thread-safe, reusable)
    private final Tika tika = new Tika();

    /**
     * Extracts raw text content from a MultipartFile (PDF, DOCX, etc.).
     *
     * @param file the uploaded resume file
     * @return the extracted plain text
     * @throws RuntimeException if the file cannot be read or parsed
     */
    public String extractText(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Uploaded file is empty or missing.");
        }

        try (InputStream inputStream = file.getInputStream()) {
            // Tika auto-detects the file format and extracts text
            String text = tika.parseToString(inputStream);
            if (text == null || text.isBlank()) {
                throw new RuntimeException("No text could be extracted from the uploaded file.");
            }
            return text;
        } catch (IOException e) {
            throw new RuntimeException("Failed to read the uploaded file: " + e.getMessage(), e);
        } catch (TikaException e) {
            throw new RuntimeException("Failed to parse the resume file: " + e.getMessage(), e);
        }
    }
}
