import { Queue } from 'bullmq'


export const reservationQueue = new Queue('reservation-queue', {
  connection: {
    host: 'localhost',
    port: 6379
  }
});


export class ReservationQueue{
  async addExpireJob(reservationId: number, delayMs: number){
      
  await reservationQueue.add('expire-reservation', { id: reservationId }, { delay: delayMs, attempts: 3 })
  }
}