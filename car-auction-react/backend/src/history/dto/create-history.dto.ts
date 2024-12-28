import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class CreateHistoryDto {
    @ApiProperty()
    @IsNotEmpty()
    id: string;

    @ApiProperty()
    @IsNotEmpty()
    AucitonStartDate: number;

    @ApiProperty()
    @IsNotEmpty()
    AuctionDuration: number;

    @ApiProperty()
    @IsNotEmpty()
    AuctionID: string;

    @ApiProperty()
    @IsNotEmpty()
    AuctionPriceInit: string;

    @ApiProperty()
    @IsNotEmpty()
    BuyAt: number;

    @ApiProperty()
    @IsNotEmpty()
    Buyer: string;

    @ApiProperty()
    @IsNotEmpty()
    EndDate: number;

    @ApiProperty()
    @IsNotEmpty()
    IDProduct: string;

    @ApiProperty()
    @IsNotEmpty()
    Price: string;

    @ApiProperty()
    @IsNotEmpty()
    Seller: string;

    @ApiProperty()
    @IsNotEmpty()
    status: number;

    @ApiProperty()
    @IsNotEmpty()
    typeHistory: number;

    @ApiProperty()
    @IsNotEmpty()
    AuctionStepPrice: number;

    @ApiProperty()
    @IsNotEmpty()
    BuyEndAt: number;
}
