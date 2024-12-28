import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
export class CreateProductDto {
    @ApiProperty()
    @IsNotEmpty()
    name:string;

    @ApiProperty()
    @IsNotEmpty()
    logo:string;

    @ApiProperty()
    @IsNotEmpty()
    description:string;

    @ApiProperty()
    @IsNotEmpty()
    addressOwnerBy:string;

    @ApiProperty()
    @IsNotEmpty()
    addressCreateBy:string;

    @ApiProperty()
    @IsNotEmpty()
    addressDeleteBy:string;

    @ApiProperty()
    @IsNotEmpty()
    createAt: number;

    @ApiProperty()
    @IsNotEmpty()
    updateAt:number;

    @ApiProperty()
    @IsNotEmpty()
    isDelectedAt:Boolean;

    @ApiProperty()
    @IsNotEmpty()
    deleteAt: number;

    @ApiProperty()
    @IsNotEmpty()
    nftTokenId:String;

    @ApiProperty()
    @IsNotEmpty()
    nftTransactionHash:String;

    @ApiProperty()
    @IsNotEmpty()
    nftImageUrl:String;

    @ApiProperty()
    @IsNotEmpty()
    price:number;

    @ApiProperty()
    @IsNotEmpty()
    sellAt:number;

    @ApiProperty()
    @IsNotEmpty()
    status:number;

    @ApiProperty()
    @IsNotEmpty()
    TimeAuction:number;

    @ApiProperty()
    @IsNotEmpty()
    AuctionID:number;

    @ApiProperty()
    @IsNotEmpty()
    StepPrice:String;
}
