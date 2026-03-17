import Link from "next/link";

export default function BackButton( { href }: { href: string }) {
  return (
    <div className="max-w-7xl mx-auto px-4 text-3xl caret-amber-50">
        <Link
            href={href}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/80 px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm shadow-slate-200/60 transition hover:text-slate-900 dark:border-slate-700/70 dark:bg-slate-900/70 dark:text-slate-300"
        >
            ← Back
        </Link>
    </div>
  )};