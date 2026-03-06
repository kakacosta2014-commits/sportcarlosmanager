import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/rbac";

export default async function Dashboard() {
  await requireAuth();

  const doing = await prisma.task.count({ where: { stage: "FAZENDO" } });
  const licAnalise = await prisma.licitacao.count({ where: { status: "EM_ANALISE" } });
  const clientes = await prisma.cliente.count();
  const metas = await prisma.meta.count();

  const topTasks = await prisma.task.findMany({
    where: { stage: { not: "CONCLUIDO" } },
    orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
    take: 6,
    include: { owner: true },
  });

  return (
    <div className="grid">
      <div className="card">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <div>
            <div className="muted small">Foco da semana</div>
            <div className="h1">Licitações + Prospecção ativa + Instagram</div>
          </div>
          <span className="pill">Resumo operacional</span>
        </div>

        <div className="grid" style={{ gridTemplateColumns: "repeat(4, minmax(0,1fr))", marginTop: 12 }}>
          <KPI label="Tarefas em execução" value={doing} />
          <KPI label="Licitações em análise" value={licAnalise} />
          <KPI label="Clientes cadastrados" value={clientes} />
          <KPI label="Metas ativas" value={metas} />
        </div>
      </div>

      <div className="card">
        <div className="muted small">Ações prioritárias</div>
        <div className="h1">Top 6 (esta semana)</div>

        <div className="grid" style={{ marginTop: 12 }}>
          {topTasks.map((t) => (
            <div key={t.id} className="task">
              <div style={{ fontWeight: 900 }}>{t.title}</div>
              <div className="small muted">
                Dono: <b>{t.owner?.name ?? "-"}</b> • Prazo: <b>{t.dueDate ? t.dueDate.toISOString().slice(0, 10) : "-"}</b> • Status: <b>{t.stage}</b>
              </div>
              {t.description ? <div className="small" style={{ marginTop: 6 }}>{t.description}</div> : null}
            </div>
          ))}
          {!topTasks.length ? <div className="muted">Sem tarefas ainda.</div> : null}
        </div>
      </div>
    </div>
  );
}

function KPI({ label, value }: { label: string; value: number }) {
  return (
    <div className="card" style={{ padding: 12, background: "#f1f5f9" }}>
      <div className="small muted">{label}</div>
      <div className="kpi">{value}</div>
    </div>
  );
}
