import { Injectable, BadRequestException, HttpException, HttpStatus } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service';
import { ReservationQueue } from 'src/queue/reservtion.queue';
import { DateTime } from 'luxon';


@Injectable()
export class ReservationService{
    
    constructor(private prisma: PrismaService, private queue: ReservationQueue){}

    async findById(id: number){
         const reservation = await this.prisma.reservation.findUnique({where:{ id }})
        if (!reservation) {
            throw new HttpException(
                { statusCode: 404, message: `Reservation with id ${id} not found` },
                HttpStatus.NOT_FOUND
            );
        }
        reservation.createdAt = DateTime.fromJSDate(reservation.createdAt).toLocal().toISO();
        reservation.expiresAt = DateTime.fromJSDate(reservation.expiresAt).toLocal().toISO();

        return reservation;
    }

    async create(productId: number, quantity: number){

    return await this.prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({ where: { id: productId } })
    if (!product) throw new BadRequestException('Product not found')
    if (product.availableStock < quantity) throw new BadRequestException('Not enough stock')


    await tx.product.update({ where: { id: productId }, data: { availableStock: product.availableStock - quantity } })


    const expiresAt = DateTime.now().plus({ minutes: 2 }).toJSDate()


    const reservation = await tx.reservation.create(
        { data: { productId, quantity, expiresAt, status: 'active' } }
    )

    reservation.createdAt = DateTime.fromJSDate(reservation.createdAt).toLocal().toISO();
    reservation.expiresAt = DateTime.fromJSDate(reservation.expiresAt).toLocal().toISO();
    return { reservation, expiresAt }
    }).then(async (result) => {
        // add delayed job after transaction succeeded
        const reservationId = result.reservation.id
        
        await this.queue.addExpireJob(reservationId, 2 * 60 * 1000)
        return result.reservation
    })
}

   async complete(reservationId: number) {
        const reservation = await this.prisma.reservation.findUnique({ where: { id: reservationId } })
        if (!reservation) throw new BadRequestException('Reservation not found')
        if (reservation.status !== 'active') throw new BadRequestException('Reservation not active')


        const updated = await this.prisma.reservation.update({ where: { id: reservationId }, data: { status: 'completed' } })
        return updated
    }
}

