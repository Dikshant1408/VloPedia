"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
      <div className="max-w-md text-center">
        <h1 className="font-display font-black text-4xl uppercase tracking-tight mb-4">Something Went Wrong</h1>
        <p className="text-secondary mb-6">
          {error.message}
        </p>
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-primary text-black font-bold uppercase tracking-wider rounded hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
