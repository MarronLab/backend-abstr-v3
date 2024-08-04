import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient<
    Prisma.PrismaClientOptions,
    'query' | 'info' | 'warn' | 'error'
  >
  implements OnModuleInit
{
  constructor() {
    super({
      log: [{ emit: 'event', level: 'query' }],
      // Add the transactionOptions with a higher timeout
      transactionOptions: {
        timeout: 30000,
      },
    });
  }
  async onModuleInit() {
    this.$on('query', (event: Prisma.QueryEvent) => {
      console.log('Query: ' + event.query);
      console.log('Duration: ' + event.duration + 'ms');
    });

    Object.assign(
      this,
      this.$extends({
        query: {
          $allModels: {
            $allOperations: async ({ operation, model, args, query }) => {
              const result = await query(args);

              // if (model !== 'AuditLog' && result) {
              //   await this.auditLog.create({
              //     data: {
              //       action: operation,
              //       recordId: (result as any).id,
              //       changes: JSON.stringify(args),
              //       tableName: model,
              //     },
              //   });
              // }

              return result;
            },
          },
        },
      }),
    );

    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit' as never, async () => {
      await app.close();
    });
  }
}
