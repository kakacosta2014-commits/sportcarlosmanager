/*
  Warnings:

  - You are about to drop the `LiciTacao` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "LiciTacao" DROP CONSTRAINT "LiciTacao_responsavelId_fkey";

-- DropTable
DROP TABLE "LiciTacao";

-- CreateTable
CREATE TABLE "Licitacao" (
    "id" TEXT NOT NULL,
    "orgao" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "objeto" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "plataforma" TEXT NOT NULL,
    "valor" DECIMAL(12,2),
    "prazo" TIMESTAMP(3),
    "status" "LicStatus" NOT NULL DEFAULT 'EM_ANALISE',
    "responsavelId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Licitacao_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Licitacao" ADD CONSTRAINT "Licitacao_responsavelId_fkey" FOREIGN KEY ("responsavelId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
