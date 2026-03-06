import Link from "next/link";
import { ReactNode } from "react";
import { signOut, auth } from "@/auth";

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role ?? "VENDAS";

  return (
    <div>
      <div className="topbar">
        <div className="container row" style={{ justifyContent: "space-between" }}>
          <div className="row">
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                border: "1px solid var(--border)",
                background: "#fff",
                display: "grid",
                placeItems: "center",
                fontWeight: 900,
              }}
            >
              SC
            </div>
            <div>
              <div className="muted small">
                CNPJ 07.483.122/0001-25 | Rua Felix Pacheco, 1290 | Teresina/PI
              </div>
              <div className="h1">Sport Carlos Manager</div>
            </div>
          </div>
          <div className="row" style={{ gap: 10 }}>
            <span className="pill">Reuniao: seg 17:30-18:10</span>
            <span className="pill">
              {session?.user?.email ?? "-"} | {role}
            </span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button className="btn" type="submit">
                Sair
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="container layout">
        <aside className="card nav">
          <NavItem href="/app" label="Painel" hint="Resumo" />
          <NavItem href="/app/kanban" label="Kanban" hint="Execucao" />
          <NavItem href="/app/licitacoes" label="Licitacoes" hint="Pipeline" />
          <NavItem href="/app/crm" label="CRM" hint="Clientes" />
          <NavItem href="/app/metas" label="Metas" hint="Equipe" />
          <NavItem href="/app/reunioes" label="Reunioes" hint="Ritual" />
          <div className="hr" />
          <div className="small muted">
            <div style={{ fontWeight: 900, color: "var(--text)", marginBottom: 6 }}>Usuarios</div>
            <div>Diretoria</div>
            <div>Vendas</div>
          </div>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}

function NavItem({ href, label, hint }: { href: string; label: string; hint: string }) {
  return (
    <Link className="navItem" href={href}>
      <span>{label}</span>
      <span className="small muted">{hint}</span>
    </Link>
  );
}
