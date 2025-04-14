"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoButton } from "@/components/ui/info-button";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { useState } from "react";
import { GitHubClient, RepositoryInfo } from "@/lib/github/githubClient";
import { StarryBackground } from "@/components/ui/starry-background";
import { ChangelogSummary } from "@/lib/ai/changelogService";

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [repoUrl, setRepoUrl] = useState("");
  const [fromCommit, setFromCommit] = useState("");
  const [toCommit, setToCommit] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [changelog, setChangelog] = useState<ChangelogSummary | null>(null);
  const [fallbackUsed, setFallbackUsed] = useState(false);

  // Add validation function
  const isFormValid = () => {
    return repoUrl.trim() !== "" && 
           fromCommit.trim() !== "" && 
           toCommit.trim() !== "";
  };

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      setError(null);
      setFallbackUsed(false);

      // Validate required fields
      if (!isFormValid()) {
        throw new Error("All fields are required");
      }

      // Call the changelog API
      const response = await fetch('/api/changelog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          repoUrl,
          fromCommit,
          toCommit,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate changelog');
      }
      
      // Check if fallback was used
      if (data.fallbackUsed) {
        setFallbackUsed(true);
      }
      
      setChangelog(data);
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setIsGenerating(false);
    setError(null);
    setChangelog(null);
    setFallbackUsed(false);
  };

  return (
    <TooltipPrimitive.Provider>
      <div className="min-h-screen flex items-center justify-center overflow-hidden relative">
        <StarryBackground />
        <div className="w-full flex transition-all duration-700 ease-in-out relative h-screen z-10">
          {/* Left side - Original UI */}
          <div className={`transition-all duration-700 ease-in-out transform ${isGenerating ? 'w-1/2 translate-x-0' : 'w-full translate-x-0'} flex flex-col justify-center bg-slate-950/30`}>
            <main className="max-w-3xl mx-auto px-4 py-8 text-center">
              <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
                Chronicl
              </h1>
              <p className="text-xl text-slate-200 mb-8 drop-shadow-md">
                AI generated Github changelogs
              </p>
            </main>
            <div className="max-w-4xl w-full mx-auto px-4 flex flex-col gap-4 -mt-8">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    placeholder="Enter your repository url..."
                    className={`w-full h-12 text-lg bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-400 ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isGenerating}
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <InfoButton content="Enter the full GitHub repository URL (e.g., https://github.com/owner/repo)" />
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    placeholder="From commit..."
                    className={`w-full h-12 text-lg bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-400 ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isGenerating}
                    value={fromCommit}
                    onChange={(e) => setFromCommit(e.target.value)}
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <InfoButton content="Enter the starting commit SHA or branch name (e.g., main, develop, or a commit hash)" />
                  </div>
                </div>
                <div className="relative flex-1">
                  <Input
                    type="text"
                    placeholder="To commit..."
                    className={`w-full h-12 text-lg bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-400 ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isGenerating}
                    value={toCommit}
                    onChange={(e) => setToCommit(e.target.value)}
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <InfoButton content="Enter the ending commit SHA or branch name (e.g., main, develop, or a commit hash)" />
                  </div>
                </div>
                <Button 
                  className={`h-12 px-6 text-white ${
                    isGenerating 
                      ? 'bg-gradient-to-r from-red-400 to-orange-400 hover:from-red-500 hover:to-orange-500'
                      : 'bg-gradient-to-r from-purple-400 to-blue-400 hover:from-purple-500 hover:to-blue-500'
                  }`}
                  onClick={isGenerating ? handleReset : handleGenerate}
                >
                  {isGenerating ? 'Reset' : 'Generate'}
                </Button>
              </div>
              {error && (
                <div className="text-red-400 text-sm mt-2">
                  {error}
                </div>
              )}
              {fallbackUsed && (
                <div className="text-amber-400 text-sm mt-2">
                  OpenAI quota exceeded. Using simple categorization instead.
                </div>
              )}
            </div>
          </div>

          {/* Vertical Divider */}
          <div className={`absolute left-1/2 top-[10vh] bottom-[10vh] w-[2px] bg-gradient-to-b from-purple-400 to-blue-400 transition-all duration-700 pointer-events-none transform ${isGenerating ? 'translate-x-0 opacity-100' : 'translate-x-[100vw] opacity-0'}`} />

          {/* Right side - Changelog Display */}
          <div className={`transition-all duration-700 ease-in-out ${isGenerating ? 'w-1/2 opacity-100' : 'w-0 opacity-0'} px-4 py-8 flex flex-col justify-center`}>
            <Card className="h-full bg-slate-900 border-slate-700 text-slate-100">
              <CardHeader>
                <CardTitle className="text-2xl">Generated Changelog</CardTitle>
                {changelog && (
                  <div className="text-sm text-slate-400">
                    Version {changelog.version} - {new Date(changelog.date).toLocaleDateString()}
                    {changelog.aiGenerated && (
                      <span className="ml-2 text-purple-400">AI-Generated</span>
                    )}
                  </div>
                )}
              </CardHeader>
              <CardContent>
                {changelog ? (
                  <div className="space-y-6">
                    {['feature', 'fix', 'improvement', 'breaking', 'other'].map((type) => {
                      const entries = changelog.entries.filter(entry => entry.type === type);
                      if (entries.length === 0) return null;

                      return (
                        <div key={type} className="space-y-2">
                          <h3 className="text-lg font-semibold capitalize text-purple-400">{type}s</h3>
                          <ul className="space-y-2">
                            {entries.map((entry, index) => (
                              <li key={index} className="text-slate-200">
                                {entry.description}
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="animate-pulse">
                    <div className="h-4 bg-slate-700 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-slate-700 rounded w-1/2 mb-4"></div>
                    <div className="h-4 bg-slate-700 rounded w-5/6"></div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TooltipPrimitive.Provider>
  );
}
