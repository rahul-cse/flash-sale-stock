import { Module } from '@nestjs/common';
import { ReservationQueue } from './reservtion.queue';

@Module({
    providers: [ReservationQueue],
    exports: [ReservationQueue]
})
export class QueueModule {}
