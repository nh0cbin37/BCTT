export class Product {
    id: string;
    name: string;
    logo: string;
    addressOwnerBy: string;
    description: string;
    addressCreateBy:string;
    addressUpdateBy:string;
    addressDeletedBy:string;
    createAt: number;
    updateAt: number;
    isDelete: boolean;
    deleteAt: number;
    nftTokenId:String;
    nftTransactionHash:String;
    nftImageUrl:String;
    price:number;
    sellAt:number;
    status:number; // -1 chưa bán 0 đang bán 1 đã bán
    TimeAuction:number;
    AuctionID:number;
    StepPrice:String;
}
