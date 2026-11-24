# Resume Screening Engine

A full-stack resume screening application that extracts text from uploaded resumes, compares them against a job description, calculates keyword match scores, and ranks multiple candidates for shortlisting.

The backend is built with Spring Boot and Apache Tika. The frontend is a React and Vite application styled with Tailwind CSS. It supports both single-resume and batch-resume analysis.

## Features

- Upload one or multiple resumes
- Drag-and-drop file selection
- Extract text from PDF, DOCX, and other Tika-supported formats
- Compare resume text against job-description keywords
- Generate a match score from 0–100
- Automatically classify candidates as **Shortlisted** or **Rejected**
- Sort batch results by descending match score
- Display matched keywords, processed candidate count, and shortlist count
- Provide individual and batch REST API endpoints
- Include JUnit unit tests, a Spring context test, and Selenium browser tests

## Technology Stack

### Backend

- Java 17
- Spring Boot 3.2.4
- Apache Tika 2.9.2
- Maven
- Lombok
- JUnit 5
- Selenium 4.19.1
- WebDriverManager 5.7.0

### Frontend

- React 18.3.1
- Vite 6.2.0
- Tailwind CSS 3.4.19
- PostCSS
- Lucide React

## Project Structure

```text
resumeScreening/
├── frontEnd/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AiFigure.jsx
│   │   │   ├── BatchResultTable.jsx
│   │   │   ├── ResultCard.jsx
│   │   │   ├── StarField.jsx
│   │   │   └── UploadSection.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── src/
│   ├── main/
│   │   ├── java/com/resumescreening/
│   │   │   ├── controller/
│   │   │   ├── dto/
│   │   │   ├── exception/
│   │   │   ├── service/
│   │   │   └── Application.java
│   │   └── resources/
│   │       ├── application.properties
│   │       └── static/
│   └── test/
│       ├── java/com/resumescreening/
│       └── resources/
├── pom.xml
└── build_final.txt
```

## How It Works

### 1. Resume upload

The frontend accepts one or more files using an upload control or drag-and-drop. It sends them to the backend as `multipart/form-data` together with the job-description text.

### 2. Text extraction

`ResumeParserService` uses Apache Tika to detect the uploaded file format and extract plain text. Tika can support formats such as PDF and DOCX, subject to the parsers available in the application dependencies.

The uploaded file must not be empty, and extracted text must not be blank. Unsupported or unreadable files result in a parsing error or are skipped in batch mode.

### 3. Keyword matching

`MatchingService` performs deterministic, word-level matching:

1. Converts the resume and job description to lowercase.
2. Splits both texts on whitespace and separators such as commas, slashes, pipes, semicolons, and hyphens.
3. Removes punctuation and trims empty tokens.
4. Removes common English stopwords from the job description.
5. Removes duplicate JD keywords.
6. Builds a set of words found in the resume.
7. Checks whether each JD keyword exists as an exact resume token.

Exact-word matching reduces false positives. For example, `C` should not match inside words such as `certificate` or `course`.

### 4. Score calculation

```text
match score = matched JD keywords / meaningful JD keywords × 100
```

Scores are rounded to two decimal places.

### 5. Shortlisting decision

A candidate is marked as `Shortlisted` when the score is at least 60. Otherwise, the candidate is marked as `Rejected`.

```text
score >= 60  →  Shortlisted
score < 60   →  Rejected
```

### 6. Batch ranking

In batch mode, the backend derives a display name from the filename, processes each resume independently, skips failed or empty files, and sorts successful candidates from the highest score to the lowest.

Underscores and hyphens in filenames are replaced with spaces. File extensions are removed. For example:

```text
john_doe_resume.pdf  →  john doe resume
Alice-CV.docx        →  Alice CV
```

## API Endpoints

The backend runs on port `8081` by default.

### Analyze one resume

```http
POST /analyze
Content-Type: multipart/form-data
```

| Parameter | Type | Required | Description |
|---|---|---:|---|
| `file` | multipart file | Yes | Resume file |
| `jd` | string | Yes | Job description or keyword list |

Example using `curl`:

```bash
curl -X POST http://localhost:8081/analyze \
  -F "file=@resume.pdf" \
  -F "jd=Java Spring Boot REST API MySQL Docker Kubernetes Maven Git"
```

Example response:

```json
{
  "score": 75.0,
  "status": "Shortlisted",
  "matchedSkills": [
    "java",
    "spring",
    "boot",
    "rest",
    "api",
    "docker"
  ]
}
```

### Analyze multiple resumes

```http
POST /analyze-batch
Content-Type: multipart/form-data
```

| Parameter | Type | Required | Description |
|---|---|---:|---|
| `files` | repeated multipart files | Yes | One or more resume files |
| `jd` | string | Yes | Job description or keyword list |

Example using `curl`:

```bash
curl -X POST http://localhost:8081/analyze-batch \
  -F "files=@john_doe_resume.pdf" \
  -F "files=@alice_cv.docx" \
  -F "jd=Java Spring Boot REST API MySQL Docker Kubernetes"
```

Example response:

```json
{
  "candidates": [
    {
      "candidateName": "john doe resume",
      "fileName": "john_doe_resume.pdf",
      "score": 83.33,
      "status": "Shortlisted",
      "matchedSkills": [
        "java",
        "spring",
        "boot",
        "rest",
        "api"
      ]
    }
  ],
  "totalProcessed": 1,
  "shortlistedCount": 1
}
```

## Configuration

Backend configuration is located in:

```text
src/main/resources/application.properties
```

```properties
server.port=8081
spring.application.name=resume-screening
spring.servlet.multipart.max-file-size=50MB
spring.servlet.multipart.max-request-size=50MB
```

The backend permits cross-origin requests from the frontend through:

```java
@CrossOrigin(origins = "*")
```

For production use, restrict this to the frontend's trusted origin instead.

The frontend development server uses port `5173`. Vite proxies `/analyze` to the backend on `8081`, while the batch UI directly calls:

```text
http://localhost:8081/analyze-batch
```

## Prerequisites

Install the following tools:

- Java 17 or later
- Maven 3.8 or later
- Node.js 18 or later
- npm
- Google Chrome, if running Selenium tests

Verify the installations:

```bash
java -version
mvn -version
node -version
npm -version
```

## Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/JEEVASANKARAN/resumeScreening.git
cd resumeScreening
```

### 2. Start the backend

```bash
mvn spring-boot:run
```

The backend should become available at:

```text
http://localhost:8081
```

You can also build and run the packaged JAR:

```bash
mvn clean package
java -jar target/resume-screening-1.0.0.jar
```

### 3. Start the frontend

Open a second terminal:

```bash
cd frontEnd
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

The frontend and backend must run simultaneously for resume analysis to work.

## Frontend Scripts

Run these commands from the `frontEnd` directory:

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build locally |

## Testing

### Run all Maven tests

```bash
mvn test
```

The test suite can include:

- Spring application context loading
- Matching-service unit tests
- Selenium browser tests

### Run only the Spring context test

```bash
mvn test -Dtest=ApplicationTest
```

### Run only the matching unit tests

```bash
mvn test -Dtest=MatchingServiceTest
```

### Unit-test coverage

`MatchingServiceTest` covers:

- High match and shortlisting
- Low match and rejection
- Empty job description
- Job description containing only stopwords
- 100% keyword matches
- Case-insensitive matching
- The exact 60% shortlist boundary

### Selenium test

The Selenium test suite is in:

```text
src/test/java/com/resumescreening/selenium/ResumeSubmissionSeleniumTest.java
```

It uses Selenium and WebDriverManager. Google Chrome must be installed and the frontend/backend must be running as required by the test setup.

Run the Selenium test with:

```bash
mvn test -Dtest=ResumeSubmissionSeleniumTest
```

Test resources include:

```text
src/test/resources/sample_resume.pdf
src/test/resources/test_frontend.html
```

## Core Backend Classes

| Class | Responsibility |
|---|---|
| `Application` | Spring Boot entry point |
| `ResumeController` | Exposes `/analyze` and `/analyze-batch` REST endpoints |
| `ResumeParserService` | Extracts text from uploaded files using Apache Tika |
| `MatchingService` | Normalizes, tokenizes, matches, scores, and shortlists candidates |
| `ResponseDto` | Represents a single-resume analysis result |
| `CandidateResultDto` | Represents one candidate in a batch response |
| `BatchResponseDto` | Wraps ranked candidates and aggregate batch counts |
| `GlobalExceptionHandler` | Converts application errors into consistent HTTP responses |

## Frontend Components

| Component | Responsibility |
|---|---|
| `App.jsx` | Main application state and API interaction |
| `UploadSection.jsx` | File selection and drag-and-drop UI |
| `BatchResultTable.jsx` | Displays ranked batch results |
| `ResultCard.jsx` | Displays individual result details |
| `StarField.jsx` | Creates the animated visual background |
| `AiFigure.jsx` | Decorative AI-themed interface element |

## Error Handling

The API returns validation and processing errors as JSON responses.

Common cases include:

- No resume file was uploaded
- The uploaded file is empty
- The job description is empty
- No text can be extracted
- The resume could not be parsed
- The backend is unavailable

For batch requests, malformed or unreadable individual files are skipped rather than preventing successful files from being processed.

## Limitations

This project is a keyword-based screening prototype, not a production-grade AI hiring system.

Current limitations include:

- Matching is exact-token based rather than semantic
- Synonyms and abbreviations may not match
- Multi-word skills are split into separate keywords
- Stopwords are limited to a small built-in list
- Candidate names are inferred from filenames
- No database or persistent candidate storage is included
- No authentication or authorization is implemented
- CORS currently permits all origins
- Upload and processing limits are stored in local configuration
- Parsing quality depends on Apache Tika and the uploaded document structure

## Security and Privacy Considerations

Resume data may contain personally identifiable information. Before deploying publicly:

- Restrict CORS to trusted frontend origins
- Authenticate API requests
- Add authorization and role-based access control
- Limit allowed file types and scan file content
- Validate file names and sizes
- Store and process data according to applicable privacy requirements
- Encrypt sensitive data in transit and at rest
- Add request rate limiting
- Remove uploaded files or results when no longer needed
- Avoid logging candidate data or resume content

## Production Build

Build the backend:

```bash
mvn clean package
```

Build the frontend:

```bash
cd frontEnd
npm install
npm run build
```

The backend JAR is generated under:

```text
target/
```

The frontend production assets are generated under:

```text
frontEnd/dist/
```

In a production deployment, serve the frontend through a separate web server or integrate the built assets with the Spring application as appropriate.

## Future Improvements

- Semantic matching using embeddings or NLP models
- Skills and experience extraction
- Weighted job-description keywords
- Industry and role-specific stopword lists
- Resume section parsing
- Candidate deduplication
- Database-backed candidate history
- Authentication and recruiter accounts
- Pagination and persistent batch reports
- Export to CSV or PDF
- Configurable shortlist thresholds
- PDF/DOCX file type validation
- Async batch processing
- Docker and Docker Compose deployment
- CI/CD pipeline integration
- Accessibility and internationalization improvements

## Author

Jeeva Sankaran

- GitHub: [@JEEVASANKARAN](https://github.com/JEEVASANKARAN)

## Repository

[https://github.com/JEEVASANKARAN/resumeScreening](https://github.com/JEEVASANKARAN/resumeScreening)

## License

No license is currently specified in this repository. Add a license file if the project is intended for reuse or distribution.
