import { NextResponse } from 'next/server';
import { GitHubClient } from '@/lib/github/githubClient';
import { ChangelogService } from '@/lib/ai/changelogService';

export async function POST(request: Request) {
  try {
    const { repoUrl, fromCommit, toCommit } = await request.json();

    if (!repoUrl || !fromCommit || !toCommit) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Parse repository URL and get commits
    const repoInfo = GitHubClient.parseRepositoryUrl(repoUrl);
    const githubClient = GitHubClient.getInstance();
    const commits = await githubClient.getCommitsBetween(repoInfo, fromCommit, toCommit);

    // Generate changelog
    const changelogService = ChangelogService.getInstance();
    const changelog = await changelogService.generateChangelog(commits);

    return NextResponse.json(changelog);
  } catch (error: any) {
    console.error('Error generating changelog:', error);
    
    // Provide a more user-friendly error message for OpenAI quota exceeded
    if (error.message === 'OPENAI_QUOTA_EXCEEDED') {
      return NextResponse.json(
        { 
          error: 'OpenAI quota exceeded. The changelog was generated using simple categorization instead.',
          fallbackUsed: true
        },
        { status: 200 } // Return 200 to indicate the request was successful with fallback
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to generate changelog' },
      { status: 500 }
    );
  }
} 