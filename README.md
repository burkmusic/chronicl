# Chronicl - AI-Generated GitHub Changelogs

Chronicl is a web application that generates beautiful changelogs from GitHub commit history. It uses AI to intelligently categorize and summarize commit messages.

## Features

- Generate changelogs from any GitHub repository
- AI-powered commit message analysis and categorization
- Beautiful, modern UI with a starry background
- Fallback to simple keyword-based categorization when AI is not available

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- GitHub API token (for accessing repositories)
- OpenAI API key (optional, for AI-powered changelog generation)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with your API keys:
   ```
   GITHUB_TOKEN=your_github_token_here
   OPENAI_API_KEY=your_openai_api_key_here  # Optional
   ```

### Running the Application

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Input Requirements

### Repository URL
- Must be a valid GitHub repository URL (e.g., `https://github.com/owner/repo`)
- The repository must be public

### Commit Range
- **From Commit**: The starting point of the changelog
  - Can be a commit SHA (e.g., `a1b2c3d`)
  - Can be a branch name (e.g., `main`, `develop`)
  - Can be a tag name (e.g., `v1.0.0`)
- **To Commit**: The ending point of the changelog
  - Same format options as From Commit
  - Must be a commit that comes after the From Commit in the git history

## How It Works

1. Enter a GitHub repository URL and the commit range you want to analyze
2. The application fetches the commits from GitHub using the GitHub API
3. If an OpenAI API key is provided, the commits are analyzed by AI to generate a structured changelog
4. If no OpenAI API key is available or if there's an error, the application falls back to a simple keyword-based categorization
5. The changelog is displayed in a beautiful UI, grouped by type (features, fixes, improvements, etc.)

## AI Changelog Generation

The AI-powered changelog generation:
- Analyzes commit messages to understand their purpose and impact
- Groups related commits together
- Provides concise summaries of changes
- Categorizes changes into features, fixes, improvements, breaking changes, and other
- Generates a markdown-formatted changelog with proper headings and bullet points

To enable AI features, simply add your OpenAI API key to the `.env.local` file.

### Fallback Changelog Generation

When AI generation is not available (no API key) or fails (quota exceeded), the application automatically falls back to a simple keyword-based categorization system:

1. **Version Format**: Uses the date of the latest commit (YYYY.MM.DD)
2. **Categorization Rules**:
   - **Features**: Commits containing "feat" or "feature"
   - **Fixes**: Commits containing "fix" or "bug"
   - **Improvements**: Commits containing "improve" or "refactor"
   - **Breaking Changes**: Commits containing "break" or "breaking"
   - **Other**: All other commits

3. **Output Format**: Each commit is listed under its category with the original commit message


## Error Handling

The application handles various error cases gracefully:

1. **Repository Access**:
   - Invalid repository URL
   - Repository not found
   - Insufficient permissions

2. **Commit Range**:
   - Invalid commit hashes
   - Non-existent branches or tags
   - Invalid commit range (end commit before start commit)

3. **API Limits**:
   - GitHub API rate limits
   - OpenAI API quota limits

In all error cases, the application provides clear error messages to help you resolve the issue.

## License

MIT
