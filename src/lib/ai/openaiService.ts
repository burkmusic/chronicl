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
            content: `You are a changelog generator. Analyze the following commit messages and categorize them into a structured changelog.
            For each commit, determine if it's a feature, fix, improvement, breaking change, or other.
            Group related commits together and provide a concise summary for each group.
            Format your response as a JSON object with the following structure:
            {
              "entries": [
                {
                  "type": "feature|fix|improvement|breaking|other",
                  "description": "A concise summary of the changes",
                  "relatedCommits": ["sha1", "sha2"]
                }
              ]
            }`
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

      // Extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format from OpenAI');
      }

      const aiResult = JSON.parse(jsonMatch[0]);

      return {
        version,
        date: date.toISOString(),
        entries: aiResult.entries || [],
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