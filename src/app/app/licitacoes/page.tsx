import { prisma } from "@/lib/prisma";
import { requireAuth, can } from "@/lib/rbac";
import { createLicitacao, deleteLicitacao } from "../actions";
import { revalidatePath } from "next/cache";

export default async function LicitacoesPage() {
  const { role } = await requireAuth();
  const users = await prisma.user.findMany({ select:{id:true,name:true}, orderBy:{name:"asc"} });
  const rows = await prisma.licitacao.findMany({ orderBy:[{prazo:"asc"},{createdAt:"desc"}], include:{responsavel:true} });
  const canEdit = can(role, "edit_licitacoes");

  return (
    <div className="grid">
      <div className="card">
        <div className="row" style={{justifyContent:"space-between"}}>
          <div><div className="muted small">Pipeline</div><div className="h1">Licitações</div></div>
          <span className="pill">Valor • Tipo • Plataforma</span>
        </div>

        {canEdit ? (
          <form action={async(fd)=>{"use server"; await createLicitacao(fd); revalidatePath("/app/licitacoes");}}
            className="grid" style={{gridTemplateColumns:"repeat(12,minmax(0,1fr))",marginTop:12}}>
            <div style={{gridColumn:"span 4"}}><label className="small muted">Órgão</label><input name="orgao" required /></div>
            <div style={{gridColumn:"span 3"}}><label className="small muted">Cidade/UF</label><input name="cidade" required /></div>
            <div style={{gridColumn:"span 5"}}><label className="small muted">Objeto</label><input name="objeto" required /></div>
            <div style={{gridColumn:"span 3"}}><label className="small muted">Tipo</label>
              <select name="tipo" defaultValue="Pregão">{["Pregão","Dispensa","Convite","Concorrência","Tomada de Preços","Credenciamento","RDC","Outro"].map(x=><option key={x} value={x}>{x}</option>)}</select>
            </div>
            <div style={{gridColumn:"span 3"}}><label className="small muted">Plataforma</label>
              <select name="plataforma" defaultValue="Licitanet">{["Licitanet","BRL","BBnet","Compras.gov","Portal de Compras Públicas","BNC","Outro"].map(x=><option key={x} value={x}>{x}</option>)}</select>
            </div>
            <div style={{gridColumn:"span 2"}}><label className="small muted">Valor (R$)</label><input name="valor" type="number" step="0.01" /></div>
            <div style={{gridColumn:"span 2"}}><label className="small muted">Prazo</label><input name="prazo" type="date" /></div>
            <div style={{gridColumn:"span 2"}}><label className="small muted">Responsável</label>
              <select name="responsavelId"><option value="">—</option>{users.map(u=><option key={u.id} value={u.id}>{u.name}</option>)}</select>
            </div>
            <div style={{gridColumn:"span 2"}}><label className="small muted">Status</label>
              <select name="status" defaultValue="EM_ANALISE">
                <option value="EM_ANALISE">Em análise</option>
                <option value="PREPARAR_PROPOSTA">Preparar proposta</option>
                <option value="ENVIADA">Enviada</option>
                <option value="GANHA">Ganha</option>
                <option value="PERDIDA">Perdida</option>
              </select>
            </div>
            <div style={{gridColumn:"span 12",display:"flex",justifyContent:"flex-end"}}><button className="btn btnDanger" type="submit">+ Adicionar</button></div>
          </form>
        ) : <div className="muted small" style={{marginTop:10}}>Somente visualização.</div>}
      </div>

      <div className="card" style={{padding:0,overflow:"hidden"}}>
        <div style={{overflowX:"auto"}}>
          <table>
            <thead>
              <tr><th>Órgão / Cidade</th><th>Objeto</th><th>Tipo</th><th>Plataforma</th><th>Valor</th><th>Prazo</th><th>Responsável</th><th>Status</th><th style={{textAlign:"right"}}>Ações</th></tr>
            </thead>
            <tbody>
              {rows.map(r=> (
                <tr key={r.id}>
                  <td><div style={{fontWeight:900}}>{r.orgao}</div><div className="small muted">{r.cidade}</div></td>
                  <td>{r.objeto}</td><td>{r.tipo}</td><td>{r.plataforma}</td>
                  <td>{r.valor ? `R$ ${Number(r.valor).toFixed(2)}` : "-"}</td>
                  <td>{r.prazo ? r.prazo.toISOString().slice(0,10) : "-"}</td>
                  <td>{r.responsavel?.name ?? "-"}</td>
                  <td><span className="tag">{r.status}</span></td>
                  <td style={{textAlign:"right"}}>
                    {canEdit ? (
                      <form action={async()=>{"use server"; await deleteLicitacao(r.id); revalidatePath("/app/licitacoes");}}>
                        <button className="btn" type="submit">Excluir</button>
                      </form>
                    ) : <span className="muted small">—</span>}
                  </td>
                </tr>
              ))}
              {!rows.length ? <tr><td colSpan={9} className="muted">Sem registros.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
