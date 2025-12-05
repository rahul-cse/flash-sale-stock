import { BadRequestException, Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ReservationService } from "./reservation.service";

@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService){}
    
    @Get(':id')
    async get(@Param('id') id: string) {
        return this.reservationService.findById(Number(id));
    }

    @Post(':id/complete')
    async complete(@Param('id') id: string) {
        return this.reservationService.complete(Number(id));
    }

    
  @Post()
  async create(@Body() body: { productId: number; quantity?: number }) {
    if (!body.productId) {
      throw new BadRequestException('productId is required');
    }

    const quantity = body.quantity ?? 1;
    const reservation = await this.reservationService.create(body.productId, quantity);

    return reservation;
  }
}