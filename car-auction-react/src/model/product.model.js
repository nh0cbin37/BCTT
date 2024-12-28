class Product {
    constructor(
       { name,
        logo,
        addressOwnerBy,
        description,
        addressCreateBy,
        addressUpdateBy,
        addressDeletedBy,
        createAt,
        updateAt,
        isDelete,
        deleteAt,
        nftTokenId,
        nftTransactionHash,
        nftImageUrl,
        price}
    ) {
        this.name = name;
        this.logo = logo;
        this.addressOwnerBy = addressOwnerBy;
        this.description = description;
        this.addressCreateBy = addressCreateBy;
        this.addressUpdateBy = addressUpdateBy;
        this.addressDeletedBy = addressDeletedBy;
        this.createAt = createAt;
        this.updateAt = updateAt;
        this.isDelete = isDelete;
        this.deleteAt = deleteAt;
        this.nftTokenId = nftTokenId;
        this.nftTransactionHash = nftTransactionHash;
        this.nftImageUrl = nftImageUrl;
        this.price = price;
    }
}
