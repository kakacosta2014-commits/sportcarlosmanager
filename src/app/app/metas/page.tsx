import { prisma } from "@/lib/prisma";
import { requireAuth, can } from "@/lib/rbac";
import { createMeta, deleteMeta } from "../actions";
import { revalidatePath } from "next/cache";

export default async function MetasPage() {
  const { role } = await requireAuth();
  const canEdit = can(role, "edit_metas");
  const users = await prisma.user.findMany({ select:{id:true,name:true}, orderBy:{name:"asc"} });
  const rows = await prisma.meta.findMany({ orderBy:[{dueDate:"asc"}], include:{owner:true} });

  return (
    <div className="grid">
      <div className="card">
        <div className="row" style={{justifyContent:"space-between"}}>
          <div><div className="muted small">Performance</div><div className="h1">Metas</div></div>
          <span className="pill">Semanal / Mensal</span>
        </div>

        {canEdit ? (
          <form action={async(fd)=>{"use server"; await createMeta(fd); revalidatePath("/app/metas");}}
            className="grid" style={{gridTemplateColumns:"repeat(12,minmax(0,1fr))",marginTop:12}}>
            <div style={{gridColumn:"span 6"}}><label className="small muted">Meta</label><input name="title" required /></div>
            <div style={{gridColumn:"span 2"}}><label className="small muted">Alvo</label><input name="target" required /></div>
            <div style={{gridColumn:"span 2"}}><label className="small muted">Progresso</label><input name="progress" required /></div>
            <div style={{gridColumn:"span 2"}}><label className="small muted">Prazo</label><input name="dueDate" type="date" required /></div>
            <div style={{gridColumn:"span 4"}}><label className="small muted">Responsável</label>
              <select name="ownerId" required>{users.map(u=><option key={u.id} value={u.id}>{u.name}</option>)}</select>
            </div>
            <div style={{gridColumn:"span 8",display:"flex",justifyContent:"flex-end",alignItems:"end"}}><button className="btn btnPrimary" type="submit">+ Adicionar</button></div>
          </form>
        ) : <div className="muted small" style={{marginTop:10}}>Somente visualização.</div>}
      </div>

      <div className="grid">
        {rows.map(m=>(
          <div key={m.id} className="card">
            <div style={{fontWeight:900}}>{m.title}</div>
            <div className="small muted" style={{marginTop:6}}>Responsável: <b>{m.owner.name}</b> • Prazo: <b>{m.dueDate.toISOString().slice(0,10)}</b></div>
            <div style={{marginTop:8}}><span className="tag">Alvo: {m.target}</span> <span className="tag">Progresso: {m.progress}</span></div>
            {canEdit ? (
              <div className="taskActions">
                <form action={async()=>{"use server"; await deleteMeta(m.id); revalidatePath("/app/metas");}}>
                  <button className="btn" type="submit">Excluir</button>
                </form>
              </div>
            ) : null}
          </div>
        ))}
        {!rows.length ? <div className="muted">Sem metas cadastradas.</div> : null}
      </div>
    </div>
  );
}
