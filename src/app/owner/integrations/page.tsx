import { prisma } from "@/lib/prisma";
import { requireOwnerSession } from "@/lib/crm-auth";
import { CrmTopBar } from "@/components/crm/CrmSidebar";

export default async function OwnerIntegrationsPage() {
  const session = await requireOwnerSession();

  const [underwriter, payfast] = await Promise.all([
    prisma.underwriterLink.findMany({ where: { tenantId: session.tenantId } }),
    prisma.paymentGatewaySetting.findMany({ where: { tenantId: session.tenantId } }),
  ]);

  return (
    <div className="space-y-6">
      <CrmTopBar
        title="Integrations"
        subtitle="Underwriter connectivity and South African payment rails. Eyabantu is modelled to plug into Redit Gateway for policy confirmation and PayFast for collections."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-[var(--brand-ink)]">Redit Gateway (underwriting)</h2>
          <p className="mt-2 text-xs text-muted">
            Exchange policy payloads, receive underwriting decisions, and persist external references on each member
            record.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {underwriter.map((u) => (
              <li key={u.id} className="rounded-xl bg-[var(--background)] px-3 py-2">
                <p className="font-semibold text-[var(--brand-ink)]">{u.provider}</p>
                <p className="text-xs text-muted">
                  External ID: {u.externalId ?? "—"} · {u.isActive ? "Active" : "Disabled"}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-[var(--brand-ink)]">PayFast</h2>
          <p className="mt-2 text-xs text-muted">
            Merchant ID, secure passphrase, and ITN listener belong in environment-backed secrets — never in client
            bundles.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {payfast.map((p) => (
              <li key={p.id} className="rounded-xl bg-[var(--background)] px-3 py-2">
                <p className="font-semibold text-[var(--brand-ink)]">{p.provider}</p>
                <p className="text-xs text-muted">
                  Merchant {p.merchantId ?? "—"} · {p.isSandbox ? "Sandbox" : "Live"}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
