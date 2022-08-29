-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "customer" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "price" INTEGER NOT NULL,
    "installments" INTEGER NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);
