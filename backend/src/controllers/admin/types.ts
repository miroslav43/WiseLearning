import { PrismaClient } from '@prisma/client';

// Define Transaction type for consistent usage across controllers
export type Transaction = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

// Define common payment types
export interface PaymentSummary {
  totalPayments: number;
  totalAmount: number;
  countByStatus: Record<string, number>;
  countByType: Record<string, number>;
} 