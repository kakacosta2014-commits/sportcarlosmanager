"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth, can } from "@/lib/rbac";
import { z } from "zod";

const taskSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional().nullable(),
  tags: z.string().optional().nullable(),
  dueDate: z.string().optional().nullable(),
  stage: z.enum(["IDEIAS","AFAZER","FAZENDO","CONCLUIDO"]),
  ownerId: z.string().optional().nullable(),
});

export async function createTask(formData: FormData) {
  const { role } = await requireAuth();
  if (!can(role, "edit_kanban")) throw new Error("FORBIDDEN");

  const parsed = taskSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    tags: formData.get("tags"),
    dueDate: formData.get("dueDate"),
    stage: formData.get("stage"),
    ownerId: formData.get("ownerId"),
  });
  if (!parsed.success) throw new Error("VALIDATION_ERROR");

  const tags = (parsed.data.tags ?? "").split(",").map(x=>x.trim()).filter(Boolean);

  await prisma.task.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description || undefined,
      tags,
      stage: parsed.data.stage,
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : undefined,
      ownerId: parsed.data.ownerId || undefined,
    },
  });
}

export async function moveTask(id: string, stage: "IDEIAS"|"AFAZER"|"FAZENDO"|"CONCLUIDO") {
  const { role } = await requireAuth();
  if (!can(role, "edit_kanban")) throw new Error("FORBIDDEN");
  await prisma.task.update({ where: { id }, data: { stage }});
}

export async function deleteTask(id: string) {
  const { role } = await requireAuth();
  if (!can(role, "edit_kanban")) throw new Error("FORBIDDEN");
  await prisma.task.delete({ where: { id }});
}

const licSchema = z.object({
  orgao: z.string().min(2),
  cidade: z.string().min(2),
  objeto: z.string().min(2),
  tipo: z.string().min(2),
  plataforma: z.string().min(2),
  valor: z.string().optional().nullable(),
  prazo: z.string().optional().nullable(),
  status: z.enum(["EM_ANALISE","PREPARAR_PROPOSTA","ENVIADA","GANHA","PERDIDA"]),
  responsavelId: z.string().optional().nullable(),
});

export async function createLicitacao(formData: FormData) {
  const { role } = await requireAuth();
  if (!can(role, "edit_licitacoes")) throw new Error("FORBIDDEN");

  const parsed = licSchema.safeParse({
    orgao: formData.get("orgao"),
    cidade: formData.get("cidade"),
    objeto: formData.get("objeto"),
    tipo: formData.get("tipo"),
    plataforma: formData.get("plataforma"),
    valor: formData.get("valor"),
    prazo: formData.get("prazo"),
    status: formData.get("status"),
    responsavelId: formData.get("responsavelId"),
  });
  if (!parsed.success) throw new Error("VALIDATION_ERROR");

  await prisma.licitacao.create({
    data: {
      orgao: parsed.data.orgao,
      cidade: parsed.data.cidade,
      objeto: parsed.data.objeto,
      tipo: parsed.data.tipo,
      plataforma: parsed.data.plataforma,
      valor: parsed.data.valor ? Number(parsed.data.valor) : undefined,
      prazo: parsed.data.prazo ? new Date(parsed.data.prazo) : undefined,
      status: parsed.data.status,
      responsavelId: parsed.data.responsavelId || undefined,
    },
  });
}

export async function deleteLicitacao(id: string) {
  const { role } = await requireAuth();
  if (!can(role, "edit_licitacoes")) throw new Error("FORBIDDEN");
  await prisma.licitacao.delete({ where: { id }});
}

const clientSchema = z.object({
  nome: z.string().min(2),
  tipo: z.string().min(2),
  cidade: z.string().min(2),
  contato: z.string().min(2),
  responsavelEmpresa: z.string().optional().nullable(),
  status: z.enum(["ATIVO","EM_RECUPERACAO","PROSPECT","INATIVO"]),
  observacoes: z.string().optional().nullable(),
});

export async function createCliente(formData: FormData) {
  const { role } = await requireAuth();
  if (!can(role, "edit_crm")) throw new Error("FORBIDDEN");

  const parsed = clientSchema.safeParse({
    nome: formData.get("nome"),
    tipo: formData.get("tipo"),
    cidade: formData.get("cidade"),
    contato: formData.get("contato"),
    responsavelEmpresa: formData.get("responsavelEmpresa"),
    status: formData.get("status"),
    observacoes: formData.get("observacoes"),
  });
  if (!parsed.success) throw new Error("VALIDATION_ERROR");

  await prisma.cliente.create({
    data: {
      nome: parsed.data.nome,
      tipo: parsed.data.tipo,
      cidade: parsed.data.cidade,
      contato: parsed.data.contato,
      responsavelEmpresa: parsed.data.responsavelEmpresa || undefined,
      status: parsed.data.status,
      observacoes: parsed.data.observacoes || undefined,
    },
  });
}

export async function deleteCliente(id: string) {
  const { role } = await requireAuth();
  if (!can(role, "edit_crm")) throw new Error("FORBIDDEN");
  await prisma.cliente.delete({ where: { id }});
}

const metaSchema = z.object({
  title: z.string().min(2),
  target: z.string().min(1),
  progress: z.string().min(1),
  dueDate: z.string().min(8),
  ownerId: z.string().min(5),
});

export async function createMeta(formData: FormData) {
  const { role } = await requireAuth();
  if (!can(role, "edit_metas")) throw new Error("FORBIDDEN");

  const parsed = metaSchema.safeParse({
    title: formData.get("title"),
    target: formData.get("target"),
    progress: formData.get("progress"),
    dueDate: formData.get("dueDate"),
    ownerId: formData.get("ownerId"),
  });
  if (!parsed.success) throw new Error("VALIDATION_ERROR");

  await prisma.meta.create({
    data: {
      title: parsed.data.title,
      target: parsed.data.target,
      progress: parsed.data.progress,
      dueDate: new Date(parsed.data.dueDate),
      ownerId: parsed.data.ownerId,
    },
  });
}

export async function deleteMeta(id: string) {
  const { role } = await requireAuth();
  if (!can(role, "edit_metas")) throw new Error("FORBIDDEN");
  await prisma.meta.delete({ where: { id }});
}

export async function saveMeetingNotes(formData: FormData) {
  await requireAuth();
  const notes = String(formData.get("notes") || "");
  await prisma.meetingNote.create({ data: { date: new Date(), notes } });
}
