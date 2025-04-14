import { Octokit } from '@octokit/rest';

// Types for our GitHub data
export interface CommitInfo {
  sha: string;
  message: string;
  author: {
    name: string;
    email: string;
    date: string;
  };
  url: string;
}

export interface RepositoryInfo {
  owner: string;
  repo: string;
}

export class GitHubClient {
  private octokit: Octokit;
  private static instance: GitHubClient;

  private constructor(authToken: string) {
    // Create Octokit instance with authentication
    this.octokit = new Octokit({ auth: authToken });
  }

  // Singleton pattern to reuse the same Octokit instance
  public static getInstance(authToken: string): GitHubClient {
    if (!GitHubClient.instance || authToken) {
      GitHubClient.instance = new GitHubClient(authToken);
    }
    return GitHubClient.instance;
  }

  /**
   * Parse a GitHub repository URL into owner and repo name
   */
  static parseRepositoryUrl(url: string): RepositoryInfo {
    const regex = /github\.com\/([^\/]+)\/([^\/]+)/;
    const match = url.match(regex);
    
    if (!match) {
      throw new Error('Invalid GitHub repository URL');
    }

    return {
      owner: match[1],
      repo: match[2].replace('.git', ''),
    };
  }

  /**
   * Fetch commits between two commit hashes
   * This is the main method that handles both validation and fetching
   */
  async getCommitsBetween(
    repoInfo: RepositoryInfo,
    startCommit: string,
    endCommit: string
  ): Promise<CommitInfo[]> {
    try {
      // Single API call to get commits and validate both hashes
      const response = await this.octokit.repos.compareCommits({
        owner: repoInfo.owner,
        repo: repoInfo.repo,
        base: startCommit,
        head: endCommit,
      });

      // If we get here, both commits exist
      return response.data.commits.map((commit) => ({
        sha: commit.sha,
        message: commit.commit.message,
        author: {
          name: commit.commit.author?.name || 'Unknown',
          email: commit.commit.author?.email || '',
          date: commit.commit.author?.date || '',
        },
        url: commit.html_url,
      }));
    } catch (error: any) {
      if (error.status === 404) {
        throw new Error('Repository not found or one of the commits does not exist. Please check your inputs.');
      }
      if (error.status === 403) {
        throw new Error('Rate limit exceeded. Please try again in a few minutes.');
      }
      console.error('Error fetching commits:', error);
      throw new Error('Failed to fetch commits from GitHub');
    }
  }

  /**
   * Validate if a commit exists in the repository
   */
  async validateCommit(
    repoInfo: RepositoryInfo,
    commitSha: string
  ): Promise<boolean> {
    try {
      await this.octokit.repos.getCommit({
        owner: repoInfo.owner,
        repo: repoInfo.repo,
        ref: commitSha,
      });
      return true;
    } catch (error: any) {
      if (error.status === 404) {
        return false;
      }
      throw error;
    }
  }
} 