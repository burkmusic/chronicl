import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950">
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
          <Button className="h-12 px-6 bg-gradient-to-r from-purple-400 to-blue-400 hover:from-purple-500 hover:to-blue-500 text-white">
            Generate
          </Button>
        </div>
      </div>
    </div>
  );
}
