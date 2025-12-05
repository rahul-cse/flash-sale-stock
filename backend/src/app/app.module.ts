import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ProductModule } from 'src/product/product.module';
import { QueueModule } from 'src/queue/queue.module';
import { ReservationModule } from 'src/reservation/reservation.module';

@Module({
    imports: [ProductModule, ReservationModule, QueueModule],
    providers: [PrismaService]
})
export class AppModule {}
