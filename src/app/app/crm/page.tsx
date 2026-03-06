import { prisma } from "@/lib/prisma";
import { requireAuth, can } from "@/lib/rbac";
import { createCliente, deleteCliente } from "../actions";
import { revalidatePath } from "next/cache";

export default async function CRMPage() {
  const { role } = await requireAuth();
  const rows = await prisma.cliente.findMany({ orderBy:[{updatedAt:"desc"}] });
  const canEdit = can(role, "edit_crm");

  return (
    <div className="grid">
      <div className="card">
        <div className="row" style={{justifyContent:"space-between"}}>
          <div><div className="muted small">Clientes</div><div className="h1">CRM</div></div>
          <span className="pill">Responsável (cliente) • Observações</span>
        </div>

        {canEdit ? (
          <form action={async(fd)=>{"use server"; await createCliente(fd); revalidatePath("/app/crm");}}
            className="grid" style={{gridTemplateColumns:"repeat(12,minmax(0,1fr))",marginTop:12}}>
            <div style={{gridColumn:"span 4"}}><label className="small muted">Nome</label><input name="nome" required /></div>
            <div style={{gridColumn:"span 2"}}><label className="small muted">Tipo</label>
              <select name="tipo" defaultValue="Institucional"><option value="Loja (varejo)">Loja (varejo)</option><option value="Institucional">Institucional</option></select>
            </div>
            <div style={{gridColumn:"span 2"}}><label className="small muted">Cidade/UF</label><input name="cidade" required /></div>
            <div style={{gridColumn:"span 2"}}><label className="small muted">Contato</label><input name="contato" required /></div>
            <div style={{gridColumn:"span 2"}}><label className="small muted">Responsável</label><input name="responsavelEmpresa" /></div>
            <div style={{gridColumn:"span 2"}}><label className="small muted">Status</label>
              <select name="status" defaultValue="PROSPECT">
                <option value="ATIVO">Ativo</option>
                <option value="EM_RECUPERACAO">Em recuperação</option>
                <option value="PROSPECT">Prospect</option>
                <option value="INATIVO">Inativo</option>
              </select>
            </div>
            <div style={{gridColumn:"span 10"}}><label className="small muted">Observações</label><input name="observacoes" placeholder="Detalhes importantes..." /></div>
            <div style={{gridColumn:"span 12",display:"flex",justifyContent:"flex-end"}}><button className="btn btnPrimary" type="submit">+ Adicionar</button></div>
          </form>
        ) : <div className="muted small" style={{marginTop:10}}>Somente visualização.</div>}
      </div>

      <div className="card" style={{padding:0,overflow:"hidden"}}>
        <div style={{overflowX:"auto"}}>
          <table>
            <thead>
              <tr><th>Nome</th><th>Tipo</th><th>Cidade/UF</th><th>Contato</th><th>Responsável</th><th>Status</th><th>Observações</th><th style={{textAlign:"right"}}>Ações</th></tr>
            </thead>
            <tbody>
              {rows.map(r=>(
                <tr key={r.id}>
                  <td style={{fontWeight:900}}>{r.nome}</td>
                  <td>{r.tipo}</td>
                  <td>{r.cidade}</td>
                  <td>{r.contato}</td>
                  <td>{r.responsavelEmpresa ?? "-"}</td>
                  <td><span className="tag">{r.status}</span></td>
                  <td>{r.observacoes ?? ""}</td>
                  <td style={{textAlign:"right"}}>
                    {canEdit ? (
                      <form action={async()=>{"use server"; await deleteCliente(r.id); revalidatePath("/app/crm");}}>
                        <button className="btn" type="submit">Excluir</button>
                      </form>
                    ) : <span className="muted small">—</span>}
                  </td>
                </tr>
              ))}
              {!rows.length ? <tr><td colSpan={8} className="muted">Sem registros.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
