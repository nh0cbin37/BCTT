import { BrowserProvider, ethers } from 'ethers';
import contract from '../../contract/AINFTCollection.json'

const fs = require('fs');

async function NFT({ urlImg, name, description, addressWallet }) {
    const CONTRACTADDRESS = "0x3498819a4751ceB62EdEE1cE3DCbC88e20D6c7bb";
    const contractABI = contract.abi;
    // const privateKey = addressWallet;

    try {
        // 1. Upload ảnh lên Imgur ở fronend

        const imageUrl = urlImg; // Lấy link ảnh từ Imgur
        // console.log(data);
        // 2. Tạo tokenURI (metadata JSON)
        const tokenURI = `data:application/json;base64,${Buffer.from(JSON.stringify({
            name,
            description,
            image: imageUrl,
        })).toString('base64')}`;
        const provider =   new ethers.providers.Web3Provider(window.ethereum);
        const signer =  provider.getSigner();
        const contracts = new ethers.Contract(CONTRACTADDRESS, contractABI, signer);
        
        // 4. Gọi hàm mintNFT
        const tx = await contracts.mint(tokenURI);
        await tx.wait();
        return { txHash: tx.hash, tokenId: tx.value.toNumber(), imageUrl };
    } catch (error) {
        console.log(error);
        throw new Error('Lỗi mint NFT');
    }
}
export default NFT;