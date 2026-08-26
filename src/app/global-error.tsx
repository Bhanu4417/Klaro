"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-zinc-900 flex items-center justify-center min-h-screen">
        <div className="text-center p-6 space-y-4">
          <h2 className="text-xl font-semibold">Something went wrong</h2>
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-[#94EC40] text-zinc-900 rounded-xl font-medium"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
