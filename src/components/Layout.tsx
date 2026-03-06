import Link from "next/link";
import { ReactNode } from "react";
import {
  CalendarDays,
  KanbanSquare,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  Target,
  Trophy,
  Users,
  FileText,
  Handshake,
  type LucideIcon,
} from "lucide-react";
import { signOut, auth } from "@/auth";

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role ?? "VENDAS";

  return (
    <div>
      <div className="topbar">
        <div className="container row" style={{ justifyContent: "space-between" }}>
          <div className="row">
            <div className="iconBadge">
              <Trophy size={20} strokeWidth={2.1} />
            </div>
            <div>
              <div className="muted small">
                CNPJ 07.483.122/0001-25 | Rua Felix Pacheco, 1290 | Teresina/PI
              </div>
              <div className="h1">Sport Carlos Manager</div>
            </div>
          </div>
          <div className="row" style={{ gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <span className="pill">
              <CalendarDays size={14} />
              Reuniao: seg 17:30-18:10
            </span>
            <span className="pill">
              <ShieldCheck size={14} />
              {session?.user?.email ?? "-"} | {role}
            </span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button className="btn row" type="submit">
                <LogOut size={16} />
                Sair
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="container layout">
        <aside className="card nav">
          <NavItem href="/app" label="Painel" hint="Resumo" icon={LayoutDashboard} />
          <NavItem href="/app/kanban" label="Kanban" hint="Execucao" icon={KanbanSquare} />
          <NavItem href="/app/licitacoes" label="Licitacoes" hint="Pipeline" icon={FileText} />
          <NavItem href="/app/crm" label="CRM" hint="Clientes" icon={Users} />
          <NavItem href="/app/metas" label="Metas" hint="Equipe" icon={Target} />
          <NavItem href="/app/reunioes" label="Reunioes" hint="Ritual" icon={Handshake} />
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

function NavItem({
  href,
  label,
  hint,
  icon: Icon,
}: {
  href: string;
  label: string;
  hint: string;
  icon: LucideIcon;
}) {
  return (
    <Link className="navItem" href={href}>
      <span className="navItemMain">
        <Icon size={18} />
        <span>{label}</span>
      </span>
      <span className="small muted">{hint}</span>
    </Link>
  );
}
