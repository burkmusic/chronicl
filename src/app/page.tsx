"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden">
      <div className="w-full flex transition-all duration-500 ease-in-out">
        {/* Left side - Original UI */}
        <div className={`transition-all duration-500 ease-in-out ${isGenerating ? 'w-1/2' : 'w-full'}`}>
          <main className="max-w-3xl mx-auto px-4 py-8 text-center">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Chronicl
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              AI generated Github changelogs
            </p>
          </main>
          <div className="max-w-4xl w-full mx-auto px-4 flex flex-col gap-4 -mt-8">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter your repository url..."
                className="w-full h-12 text-lg bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-400"
              />
            </div>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="From commit..."
                className="w-full h-12 text-lg bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-400"
              />
              <Input
                type="text"
                placeholder="To commit..."
                className="w-full h-12 text-lg bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-400"
              />
              <Button 
                className="h-12 px-6 bg-gradient-to-r from-purple-400 to-blue-400 hover:from-purple-500 hover:to-blue-500 text-white"
                onClick={() => setIsGenerating(true)}
              >
                Generate
              </Button>
            </div>
          </div>
        </div>

        {/* Right side - Results Card */}
        <div className={`transition-all duration-500 ease-in-out ${isGenerating ? 'w-1/2 opacity-100' : 'w-0 opacity-0'} px-4 py-8`}>
          <Card className="h-full bg-slate-900 border-slate-700 text-slate-100">
            <CardHeader>
              <CardTitle className="text-2xl">Generated Changelog</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="animate-pulse">
                <div className="h-4 bg-slate-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-slate-700 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-slate-700 rounded w-5/6"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
