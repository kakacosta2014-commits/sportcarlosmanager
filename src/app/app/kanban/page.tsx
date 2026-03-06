import { prisma } from "@/lib/prisma";
import { requireAuth, can } from "@/lib/rbac";
import { createTask, moveTask, deleteTask } from "../actions";
import { revalidatePath } from "next/cache";

export default async function KanbanPage() {
  const { role } = await requireAuth();
  const users = await prisma.user.findMany({ select:{id:true,name:true}, orderBy:{name:"asc"} });
  const tasks = await prisma.task.findMany({ orderBy:{updatedAt:"desc"}, include:{owner:true} });

  const cols = {
    IDEIAS: tasks.filter(t=>t.stage==="IDEIAS"),
    AFAZER: tasks.filter(t=>t.stage==="AFAZER"),
    FAZENDO: tasks.filter(t=>t.stage==="FAZENDO"),
    CONCLUIDO: tasks.filter(t=>t.stage==="CONCLUIDO"),
  } as const;

  const canEdit = can(role, "edit_kanban");

  return (
    <div className="grid">
      <div className="card">
        <div className="row" style={{justifyContent:"space-between"}}>
          <div><div className="muted small">Execução</div><div className="h1">Kanban</div></div>
          <span className="pill">Dono + prazo</span>
        </div>

        {canEdit ? (
          <form action={async(fd)=>{"use server"; await createTask(fd); revalidatePath("/app/kanban");}}
            className="grid" style={{gridTemplateColumns:"repeat(6,minmax(0,1fr))",marginTop:12}}>
            <div style={{gridColumn:"span 2"}}><label className="small muted">Título</label><input name="title" required /></div>
            <div style={{gridColumn:"span 2"}}><label className="small muted">Descrição</label><input name="description" /></div>
            <div><label className="small muted">Dono</label>
              <select name="ownerId"><option value="">—</option>{users.map(u=><option key={u.id} value={u.id}>{u.name}</option>)}</select>
            </div>
            <div><label className="small muted">Prazo</label><input name="dueDate" type="date" /></div>
            <div><label className="small muted">Coluna</label>
              <select name="stage" defaultValue="AFAZER">
                <option value="IDEIAS">Ideias</option><option value="AFAZER">A fazer</option><option value="FAZENDO">Em execução</option><option value="CONCLUIDO">Concluído</option>
              </select>
            </div>
            <div style={{gridColumn:"span 2"}}><label className="small muted">Tags</label><input name="tags" placeholder="licitações, instagram" /></div>
            <div style={{display:"flex",alignItems:"end"}}><button className="btn btnPrimary" type="submit">+ Criar</button></div>
          </form>
        ) : <div className="muted small" style={{marginTop:10}}>Somente visualização.</div>}
      </div>

      <div className="cols">
        {Object.entries(cols).map(([key, items]) => (
          <div key={key} className="card">
            <div className="row" style={{justifyContent:"space-between"}}>
              <div className="h2">{key}</div><span className="pill">{items.length}</span>
            </div>
            <div className="grid" style={{marginTop:12}}>
              {items.map(t => (
                <div key={t.id} className="task">
                  <div style={{fontWeight:900}}>{t.title}</div>
                  <div className="small muted">Dono: <b>{t.owner?.name ?? "-"}</b> • Prazo: <b>{t.dueDate ? t.dueDate.toISOString().slice(0,10) : "-"}</b></div>
                  {canEdit ? (
                    <div className="taskActions">
                      <form action={async()=>{"use server"; await moveTask(t.id, prev(key as any)); revalidatePath("/app/kanban");}}>
                        <button className="btn" type="submit">←</button>
                      </form>
                      <form action={async()=>{"use server"; await moveTask(t.id, next(key as any)); revalidatePath("/app/kanban");}}>
                        <button className="btn" type="submit">→</button>
                      </form>
                      <form action={async()=>{"use server"; await deleteTask(t.id); revalidatePath("/app/kanban");}}>
                        <button className="btn" type="submit">Excluir</button>
                      </form>
                    </div>
                  ) : null}
                </div>
              ))}
              {!items.length ? <div className="muted small">—</div> : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function prev(s: "IDEIAS"|"AFAZER"|"FAZENDO"|"CONCLUIDO") {
  const order = ["IDEIAS","AFAZER","FAZENDO","CONCLUIDO"] as const;
  const i = order.indexOf(s);
  return (i>0 ? order[i-1] : order[i]) as any;
}
function next(s: "IDEIAS"|"AFAZER"|"FAZENDO"|"CONCLUIDO") {
  const order = ["IDEIAS","AFAZER","FAZENDO","CONCLUIDO"] as const;
  const i = order.indexOf(s);
  return (i<order.length-1 ? order[i+1] : order[i]) as any;
}
