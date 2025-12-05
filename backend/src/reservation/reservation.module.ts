import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { ReservationQueue } from 'src/queue/reservtion.queue';
import { PrismaService } from 'src/prisma.service';

@Module({
    controllers: [ReservationController],
    providers: [ReservationService, ReservationQueue, PrismaService]
})
export class ReservationModule {}
