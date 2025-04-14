import { CommitInfo } from '../github/githubClient';
import { OpenAIService } from './openaiService';

export interface ChangelogEntry {
  type: 'feature' | 'fix' | 'improvement' | 'breaking' | 'other';
  description: string;
  relatedCommits: string[];
}

export interface ChangelogSummary {
  version: string;
  date: string;
  entries: ChangelogEntry[];
  aiGenerated: boolean;
}

export class ChangelogService {
  private static instance: ChangelogService;
  private openAIService: OpenAIService;

  private constructor() {
    this.openAIService = OpenAIService.getInstance();
  }

  public static getInstance(): ChangelogService {
    if (!ChangelogService.instance) {
      ChangelogService.instance = new ChangelogService();
    }
    return ChangelogService.instance;
  }

  /**
   * Generate a changelog summary from commit messages
   */
  async generateChangelog(commits: CommitInfo[]): Promise<ChangelogSummary> {
    // Try to use OpenAI if available
    if (this.openAIService.isAvailable()) {
      try {
        const aiChangelog = await this.openAIService.generateChangelog(commits);
        return {
          ...aiChangelog,
          aiGenerated: true
        };
      } catch (error: any) {
        // Check if it's a quota exceeded error
        if (error.message === 'OPENAI_QUOTA_EXCEEDED') {
          console.warn('OpenAI quota exceeded. Falling back to simple categorization.');
        } else {
          console.warn('Failed to generate changelog with AI, falling back to simple categorization:', error);
        }
        // Fall back to simple categorization
      }
    }

    // Fall back to simple categorization
    return this.generateSimpleChangelog(commits);
  }

  /**
   * Generate a simple changelog using keyword-based categorization
   */
  private generateSimpleChangelog(commits: CommitInfo[]): ChangelogSummary {
    // Group commits by date to determine version
    const latestCommit = commits[0];
    const date = new Date(latestCommit.author.date);
    
    // Format the version as YYYY.MM.DD
    const version = `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`;

    // Simple categorization based on commit message keywords
    const entries: ChangelogEntry[] = commits.map(commit => {
      const message = commit.message.toLowerCase();
      let type: ChangelogEntry['type'] = 'other';
      
      if (message.includes('feat') || message.includes('feature')) {
        type = 'feature';
      } else if (message.includes('fix') || message.includes('bug')) {
        type = 'fix';
      } else if (message.includes('improve') || message.includes('refactor')) {
        type = 'improvement';
      } else if (message.includes('break') || message.includes('breaking')) {
        type = 'breaking';
      }

      return {
        type,
        description: commit.message,
        relatedCommits: [commit.sha]
      };
    });

    return {
      version,
      date: date.toISOString(),
      entries,
      aiGenerated: false
    };
  }
} 