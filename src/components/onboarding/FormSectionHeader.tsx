import type { ReactNode } from "react";

type Props = {
  number: string;
  title: string;
};

export function FormSectionHeader({ number, title }: Props) {
  return (
    <div className="flex items-stretch overflow-hidden rounded-t-lg border border-slate-400/60 border-b-0 bg-slate-600">
      <span className="flex min-w-[2.5rem] items-center justify-center bg-slate-700 px-2 text-xs font-bold text-white">
        {number}
      </span>
      <h3 className="flex flex-1 items-center px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-white sm:text-sm">
        {title}
      </h3>
    </div>
  );
}

export function FormSectionBody({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-b-lg border border-t-0 border-slate-300 bg-white p-4 sm:p-5 ${className}`}>{children}</div>
  );
}

export function FieldLabel({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="block text-[10px] font-bold uppercase tracking-wide text-slate-600">
      {children}
    </label>
  );
}

export const fieldInputClass =
  "mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-[#142a55] focus:outline-none focus:ring-1 focus:ring-[#142a55]/30";

export const fieldSelectClass = fieldInputClass;
