import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/rbac";
import { saveMeetingNotes } from "../actions";
import { revalidatePath } from "next/cache";

export default async function ReunioesPage() {
  await requireAuth();
  const notes = await prisma.meetingNote.findMany({ orderBy:{date:"desc"}, take:10 });

  return (
    <div className="grid">
      <div className="card">
        <div className="row" style={{justifyContent:"space-between"}}>
          <div><div className="muted small">Ritual</div><div className="h1">Reunião semanal (Seg 17:30–18:10)</div></div>
          <span className="pill">Pauta fixa + decisões</span>
        </div>

        <div className="grid" style={{gridTemplateColumns:"repeat(12,minmax(0,1fr))",marginTop:12}}>
          <div style={{gridColumn:"span 7"}} className="card">
            <div className="h2">Pauta (40 min)</div>
            <ol className="small" style={{marginTop:10,color:"var(--text)"}}>
              <li><b>17:30–17:35</b> • Resumo semana anterior</li>
              <li><b>17:35–17:45</b> • Vendas + estoque crítico</li>
              <li><b>17:45–17:55</b> • Licitações (novas / em análise / propostas)</li>
              <li><b>17:55–18:05</b> • Marketing + prospecção</li>
              <li><b>18:05–18:10</b> • Tarefas da semana (dono + prazo)</li>
            </ol>
            <div className="hr" />
            <form action={async(fd)=>{"use server"; await saveMeetingNotes(fd); revalidatePath("/app/reunioes");}} className="grid">
              <label className="small muted">Notas e decisões (salva no histórico)</label>
              <textarea name="notes" placeholder="Decisões, pendências, responsáveis e prazos..."></textarea>
              <div style={{display:"flex",justifyContent:"flex-end"}}><button className="btn btnPrimary" type="submit">Salvar</button></div>
            </form>
          </div>

          <div style={{gridColumn:"span 5"}} className="card">
            <div className="h2">Últimas 10 notas</div>
            <div className="grid" style={{marginTop:12}}>
              {notes.map(n=>(
                <div key={n.id} className="task">
                  <div className="small muted"><b>{n.date.toISOString().slice(0,10)}</b></div>
                  <div className="small" style={{marginTop:6,whiteSpace:"pre-wrap"}}>{n.notes ?? "-"}</div>
                </div>
              ))}
              {!notes.length ? <div className="muted small">Sem histórico ainda.</div> : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
