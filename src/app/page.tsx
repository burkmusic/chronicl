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
      <div className="max-w-4xl w-full mx-auto px-4 flex gap-2 -mt-8">
        <Input
          type="text"
          placeholder="enter your repository name"
          className="w-full h-12 text-lg bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-400"
        />
        <Button className="h-12 px-6 bg-gradient-to-r from-purple-400 to-blue-400 hover:from-purple-500 hover:to-blue-500 text-white">
          Generate
        </Button>
      </div>
    </div>
  );
}
