import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main(){
  const pwd = await bcrypt.hash("Sport@123", 10);

  const users = [
    { name: "Diretoria", email: "diretoria@sportcarlos.local", role: "DIRETORIA" },
    { name: "Vendas",    email: "vendas@sportcarlos.local",    role: "VENDAS" },
  ];
  for (const u of users){
    await prisma.user.upsert({ where:{email:u.email}, update:{}, create:{...u, password:pwd} });
  }

  const diretoria = await prisma.user.findUnique({ where: { email: "diretoria@sportcarlos.local" } });
  const vendas = await prisma.user.findUnique({ where: { email: "vendas@sportcarlos.local" } });

  await prisma.task.createMany({
    data: [
      { title:"Rotina diária de portais", description:"Verificar portais e separar licitações e dispensas viáveis.", tags:["licitações"], stage:"FAZENDO", ownerId:vendas?.id },
      { title:"Revisar política de precificação", description:"Definir critérios por categoria e evitar preço acima do mercado.", tags:"precificação","margem", stage:"AFAZER", ownerId:diretoria?.id },
    ,
    skipDuplicates:true
  });

  await prisma.cliente.createMany({
    data: [
      { nome:"Escola Municipal (exemplo)", tipo:"Institucional", cidade:"Teresina/PI", contato:"direcao@escola.com", responsavelEmpresa:"Direção", status:"PROSPECT", observacoes:"Enviar portfólio e tabela de preços. Agendar visita." },
      { nome:"Cliente antigo (exemplo)", tipo:"Institucional", cidade:"São Miguel do Tapuio/PI", contato:"(86) 9xxxx-xxxx", responsavelEmpresa:"Secretário de Esportes", status:"EM_RECUPERACAO", observacoes:"Cliente parou por preço. Reavaliar proposta." },
    ],
    skipDuplicates:true
  });

  await prisma.licitacao.createMany({
    data: [
      { orgao:"Prefeitura Municipal", cidade:"Luzilândia/PI", objeto:"Material esportivo", tipo:"Pregão", plataforma:"Licitanet", valor: 25000, prazo:new Date(Date.now()+9*86400000), status:"EM_ANALISE", responsavelId:vendas?.id },
      { orgao:"Secretaria de Educação", cidade:"Teresina/PI", objeto:"Troféus e medalhas", tipo:"Dispensa", plataforma:"Portal de Compras Públicas", valor: 8500, prazo:new Date(Date.now()+4*86400000), status:"PREPARAR_PROPOSTA", responsavelId:vendas?.id },
    ],
    skipDuplicates:true
  });

  await prisma.meta.createMany({
    data: [
      { title:"Fechar 2 contratos institucionais", target:"2 contratos", progress:"0/2", dueDate:new Date(Date.now()+14*86400000), ownerId:vendas?.id },
    ],
    skipDuplicates:true
  });

  await prisma.meetingNote.createMany({
    data: [{ notes:"Modelo de pauta: Vendas/Estoque • Licitações • Marketing/Prospecção • Tarefas (dono+prazos)" }],
    skipDuplicates:true
  });

  console.log("Seed concluído.");
  console.log("Logins:");
  console.log("- diretoria@sportcarlos.local / Sport@123");
  console.log("- vendas@sportcarlos.local / Sport@123");
}

main()
  .catch(e=>{ console.error(e); process.exit(1); })
  .finally(async ()=>{ await prisma.$disconnect(); });
