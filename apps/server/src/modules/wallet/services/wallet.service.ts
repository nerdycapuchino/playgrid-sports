import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { RedisService } from '../../../config/redis.service';

export enum TransactionType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
  REFUND = 'REFUND',
  BOOKING_HOLD = 'BOOKING_HOLD',
  BOOKING_RELEASE = 'BOOKING_RELEASE',
}

@Injectable()
export class WalletService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async getBalance(userId: string): Promise<{ balance: number; locked: number }> {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      throw new BadRequestException('Wallet not found');
    }

    const lockedKey = `wallet:locked:${userId}`;
    const locked = await this.redis.get(lockedKey);

    return {
      balance: wallet.balance,
      locked: locked ? parseInt(locked) : 0,
    };
  }

  async creditTokens(
    userId: string,
    amount: number,
    description: string,
    referenceId?: string,
  ): Promise<void> {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be positive');
    }

    try {
      await this.prisma.$transaction(async (tx: any) => {
        await tx.wallet.update({
          where: { userId },
          data: { balance: { increment: amount } },
        });

        await tx.walletLedger.create({
          data: {
            userId,
            amount,
            type: TransactionType.CREDIT,
            description,
            referenceId,
          },
        });
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to credit tokens');
    }
  }

  async debitTokens(
    userId: string,
    amount: number,
    description: string,
    referenceId?: string,
  ): Promise<void> {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be positive');
    }

    try {
      await this.prisma.$transaction(async (tx: any) => {
        const wallet = await tx.wallet.findUnique({
          where: { userId },
        });

        if (wallet.balance < amount) {
          throw new BadRequestException('Insufficient balance');
        }

        await tx.wallet.update({
          where: { userId },
          data: { balance: { decrement: amount } },
        });

        await tx.walletLedger.create({
          data: {
            userId,
            amount,
            type: TransactionType.DEBIT,
            description,
            referenceId,
          },
        });
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to debit tokens');
    }
  }

  async holdTokens(userId: string, bookingId: string, amount: number): Promise<void> {
    const lockedKey = `wallet:locked:${userId}`;
    const bookingKey = `booking:hold:${bookingId}`;
    const TTL = 15 * 60;

    try {
      await this.redis.incrby(lockedKey, amount);
      await this.redis.setex(bookingKey, TTL, userId);
    } catch (error) {
      throw new InternalServerErrorException('Failed to hold tokens');
    }
  }

  async getTransactionHistory(userId: string, limit: number = 50): Promise<any[]> {
    return this.prisma.walletLedger.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
