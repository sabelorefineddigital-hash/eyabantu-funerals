/** Page title block for CRM inner pages (shell provides sidebar + workspace header). */
export function CrmTopBar({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="mb-6 flex flex-col gap-3 md:mb-8 md:flex-row md:items-start md:justify-between">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span className="h-8 w-1 rounded-full bg-eyabantu-gold" aria-hidden />
          <h1 className="text-xl font-bold tracking-tight text-eyabantu-navy md:text-2xl">{title}</h1>
        </div>
        {subtitle ? (
          <p className="max-w-3xl pl-4 text-sm leading-relaxed text-muted">{subtitle}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
