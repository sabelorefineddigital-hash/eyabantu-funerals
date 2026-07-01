"use client";

import Link from "next/link";
import { FileSignature, Wallet } from "lucide-react";

export function MemberRowQuickActions({ memberId }: { memberId: string }) {
  const profile = `/owner/members/${memberId}#member-profile`;
  const payments = `/owner/members/${memberId}#member-payments`;
  const policies = `/owner/members/${memberId}#member-policies`;

  return (
    <div className="relative z-10 flex justify-end gap-1 opacity-100 transition md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
      <Link
        href={profile}
        prefetch={false}
        className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--brand-ink)] shadow-sm hover:border-brand/40"
        title="Open member profile"
      >
        Profile
      </Link>
      <Link
        href={payments}
        prefetch={false}
        className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--brand-ink)] shadow-sm hover:border-brand/40"
        title="Payment history for this member"
      >
        <Wallet className="h-3 w-3" aria-hidden />
        Pay
      </Link>
      <Link
        href={policies}
        prefetch={false}
        className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--brand-ink)] shadow-sm hover:border-brand/40"
        title="Cover and linked policies"
      >
        <FileSignature className="h-3 w-3" aria-hidden />
        Policy
      </Link>
    </div>
  );
}
