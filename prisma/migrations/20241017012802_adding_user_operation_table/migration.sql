-- CreateTable
CREATE TABLE "userOperation" (
    "id" TEXT NOT NULL,
    "sender" VARCHAR(255) NOT NULL,
    "nonce" VARCHAR(255) NOT NULL,
    "initCode" TEXT NOT NULL,
    "callData" TEXT NOT NULL,
    "callGasLimit" VARCHAR(255) NOT NULL,
    "verificationGasLimit" VARCHAR(255) NOT NULL,
    "preVerificationGas" VARCHAR(255) NOT NULL,
    "maxFeePerGas" VARCHAR(255) NOT NULL,
    "maxPriorityFeePerGas" VARCHAR(255) NOT NULL,
    "paymasterAndData" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "isExecuted" BOOLEAN NOT NULL DEFAULT false,
    "transactionHash" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "executedAt" TIMESTAMP(3),

    CONSTRAINT "userOperation_pkey" PRIMARY KEY ("id")
);
