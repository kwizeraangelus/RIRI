// components/RiriStatus.tsx
'use client';

export function RiriLoading({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="min-h-screen bg-[#E0F2FE] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-blue-200" />
          <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold tracking-tight text-slate-800">
            RIRI
          </p>
          <p className="text-sm text-slate-500 mt-1 animate-pulse">{label}…</p>
        </div>
      </div>
    </div>
  );
}

export function RiriError({
  message = "We couldn't load this page.",
  onRetry,
}: {
  message?: string;
  onRetry: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#E0F2FE] flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center">
        <p className="text-xl font-bold tracking-tight text-slate-800 mb-1">RIRI</p>
        <div className="w-12 h-1 bg-red-400 rounded-full mx-auto my-4" />
        <p className="text-slate-700 font-medium mb-2">Something went wrong</p>
        <p className="text-sm text-slate-500 mb-6">{message}</p>
        <button
          onClick={onRetry}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}