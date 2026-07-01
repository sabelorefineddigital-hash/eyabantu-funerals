/** Page title block for CRM inner pages (shell provides sidebar + workspace header). */
export function CrmTopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="mb-6 flex flex-col gap-1 md:mb-8">
      <h1 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">{title}</h1>
      {subtitle ? <p className="max-w-3xl text-sm leading-relaxed text-slate-600">{subtitle}</p> : null}
    </header>
  );
}
