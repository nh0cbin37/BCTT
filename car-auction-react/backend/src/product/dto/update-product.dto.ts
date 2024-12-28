import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateProductDto {
    @ApiProperty()
    @IsNotEmpty()
    name:string;

    @ApiProperty()
    @IsNotEmpty()
    description:string;

    @ApiProperty()
    @IsNotEmpty()
    addressOwnerBy:string;

    @ApiProperty()
    @IsNotEmpty()
    updateAt:number;

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
