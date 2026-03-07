-- AlterTable
ALTER TABLE "users"
ADD COLUMN "clerk_id" TEXT,
ALTER COLUMN "password" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_clerk_id_key" ON "users"("clerk_id");
