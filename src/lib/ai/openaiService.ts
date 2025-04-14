import OpenAI from 'openai';
import { CommitInfo } from '../github/githubClient';
import { ChangelogEntry, ChangelogSummary } from './changelogService';

export class OpenAIService {
  private openai: OpenAI;
  private static instance: OpenAIService;

  private constructor() {
    // Initialize OpenAI client with API key from environment variable
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.warn('OpenAI API key not found. AI features will be disabled.');
    }
    this.openai = new OpenAI({
      apiKey: apiKey || 'dummy-key',
    });
  }

  public static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }

  /**
   * Check if OpenAI API is available
   */
  public isAvailable(): boolean {
    return !!process.env.OPENAI_API_KEY;
  }

  /**
   * Generate a changelog summary using OpenAI
   */
  async generateChangelog(commits: CommitInfo[]): Promise<ChangelogSummary> {
    if (!this.isAvailable()) {
      throw new Error('OpenAI API key not configured');
    }

    // Group commits by date to determine version
    const latestCommit = commits[0];
    const date = new Date(latestCommit.author.date);
    
    // Format the version as YYYY.MM.DD
    const version = `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`;

    // Prepare commit messages for AI processing
    const commitMessages = commits.map(commit => ({
      sha: commit.sha,
      message: commit.message,
      author: commit.author.name,
      date: commit.author.date
    }));

    try {
      // Use OpenAI to analyze and categorize commits
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini", // Using the more cost-effective model
        messages: [
          {
            role: "system",
            content: `You are a changelog generator. Analyze the following commit messages and create a traditional changelog.
            
            Format your response as a markdown document with the following structure:
            
            # Version ${version}
            
            * [Concise summary of changes, grouped by type if possible]
            * [Another change]
            * [And so on...]
            
            IMPORTANT FORMATTING RULES:
            1. Use a single # for the main title (Changelog - Version ${version})
            2. Use ## for the "Changes" section heading
            3. EVERY change MUST start with an asterisk (*) to create a bullet point
            4. Group related changes under subheadings if needed, using ### for subheadings
            5. Make the summaries clear, concise, and user-friendly
            6. Focus on what changed from the user's perspective, not technical details
            
            Example format:
            # Version ${version}
                        
            ### User Interface
            
            * Added new navigation menu
            * Improved button styling
            
            ### Bug Fixes
            
            * Fixed login issue
            * Resolved data loading error
            `
          },
          {
            role: "user",
            content: JSON.stringify(commitMessages)
          }
        ],
        temperature: 0.3, // Lower temperature for more consistent results
        max_tokens: 1000, // Limit token usage to control costs
      });

      // Parse the AI response
      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      // Extract the markdown content
      const markdownContent = content.trim();
      
      // Convert the markdown content to our ChangelogSummary format
      // For now, we'll create a simple entry with the entire markdown content
      const entries: ChangelogEntry[] = [{
        type: 'other',
        description: markdownContent,
        relatedCommits: commits.map(commit => commit.sha)
      }];

      return {
        version,
        date: date.toISOString(),
        entries,
        aiGenerated: true
      };
    } catch (error: any) {
      console.error('Error generating changelog with OpenAI:', error);
      
      // Check for specific error types
      if (error.status === 429) {
        console.warn('OpenAI quota exceeded. Falling back to simple categorization.');
        throw new Error('OPENAI_QUOTA_EXCEEDED');
      }
      
      throw new Error('Failed to generate changelog with AI');
    }
  }
} 