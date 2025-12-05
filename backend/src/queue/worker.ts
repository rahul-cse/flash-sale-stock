import 'reflect-metadata'
import { Worker } from 'bullmq'
import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()
const connection = { connection: { url: process.env.REDIS_URL || 'redis://localhost:6379' } }


const worker = new Worker('reservation-queue', async (job) => {
if (job.name !== 'expire-reservation') return
const reservationId = job.data.id
const reservation = await prisma.reservation.findUnique({ where: { id: reservationId } })
if (!reservation) return
if (reservation.status !== 'active') return


// expire and restore stock in transaction
await prisma.$transaction([
prisma.reservation.update({ where: { id: reservationId }, data: { status: 'expired' } }),
prisma.product.update({ where: { id: reservation.productId }, data: { availableStock: { increment: reservation.quantity } } })
])
console.log('Expired reservation', reservationId)
}, {
    connection: {
    host: 'localhost',
    port: 6379
  }
})


worker.on('failed', (job, err) => {
console.error('Job failed', job?.id, err)
})


console.log('Worker started')