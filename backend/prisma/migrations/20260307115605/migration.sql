-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "age" INTEGER,
ADD COLUMN     "date_of_birth" TIMESTAMP(3),
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "height" INTEGER,
ADD COLUMN     "weight" INTEGER;
