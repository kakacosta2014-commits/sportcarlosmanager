import { auth } from "@/auth";
export type AppRole = "DIRETORIA" | "VENDAS";
  export async function requireAuth() {
  // MODO SEM LOGIN (DEV): libera tudo como DIRETORIA
  return {
    userId: "anon",
    role: "DIRETORIA" as const,
    name: "Acesso Direto",
    email: "anon@sportcarlos.local",
  };
}
export function can(role: AppRole, permission: string) {
  if (role === "DIRETORIA") return true;
  const vendas = new Set([
    "view_dashboard","view_kanban","edit_kanban","view_licitacoes","edit_licitacoes",
    "view_crm","edit_crm","view_metas","edit_metas","view_reunioes"
  ]);
  return vendas.has(permission);
}
