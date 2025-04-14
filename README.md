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

## How It Works

1. Enter a GitHub repository URL and the commit range you want to analyze
2. The application fetches the commits from GitHub
3. If an OpenAI API key is provided, the commits are analyzed by AI to generate a structured changelog
4. If no OpenAI API key is available, the application falls back to a simple keyword-based categorization
5. The changelog is displayed in a beautiful UI, grouped by type (features, fixes, improvements, etc.)

## AI Changelog Generation

The AI-powered changelog generation:
- Analyzes commit messages to understand their purpose and impact
- Groups related commits together
- Provides concise summaries of changes
- Categorizes changes into features, fixes, improvements, breaking changes, and other

To enable AI features, simply add your OpenAI API key to the `.env.local` file.

### Handling OpenAI Quota Limits

If you encounter an error like "You exceeded your current quota, please check your plan and billing details", this means you've reached your OpenAI API usage limit. The application will automatically fall back to the simple keyword-based categorization method.

To resolve this:
1. Check your OpenAI account billing status at https://platform.openai.com/account/billing
2. Add payment information to your account
3. Or create a new API key with a different account

The application will continue to work with the fallback method even without a valid OpenAI API key.

## License

MIT
