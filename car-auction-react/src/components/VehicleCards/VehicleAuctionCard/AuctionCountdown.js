import React, { useEffect, useState } from "react";
import Countdown from "react-countdown";
import PropTypes from "prop-types";
import MKBadge from "components/MKBadge";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import axios from "axios";
import alertWrong from "components/Alert/alertwrong";
import { ethers } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts,fetchHistorys } from "redux/redux";
import contract from '../../../contract/AINFTCollection.json'

// Random component
const Completionist = () => (
  <MKBadge
    badgeContent={
      <>
        <WatchLaterIcon />
        &nbsp;CLOSED
      </>
    }
    color="success"
    container
  />
);


// Renderer callback with condition
const renderer = ({ hours, minutes, seconds, completed }) => {
  if (completed) {
    // Render a complete state

    return <Completionist />;
  }
  const time = (
    <>
      <WatchLaterIcon />
      &nbsp;{String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:
      {String(seconds).padStart(2, "0")}
    </>
  );
  let color;
  if (minutes * 1 === 0 && hours * 1 === 0) color = "error";
  else color = `warning`;

  // Render a countdown
  return <MKBadge badgeContent={time} color={color} container />;
};
function AuctionCountdown({ timeEnd, Info }) {
  const dispatch = useDispatch();
  const allhistorys = useSelector((state) => state.dataKit.allhistorys);
  const [highestBidderAuction, sethighestBidderAuction] = useState("")
  const [historyData, setHistoryData] = useState({
    AucitonStartDate: 0,
    AuctionDuration: 0,
    AuctionID: '',
    AuctionPriceInit: '',
    AuctionStepPrice:'',
    BuyAt: 0,
    Buyer: '',
    EndDate: 0,
    IDProduct: '',
    Price: '',
    Seller: '',
    status: 1,
    typeHistory: 1,
    // Hoặc new Date() nếu cần
  });

  const handlePostHistory = async (AuctionStepPrice,logo, AuctionPriceInit, AucitonStartDate, AuctionDuration, IDProduct, AuctionID, Price, Buyer, EndDate, Seller) => {
    // activity.preventDefault();
    // setLoading(true);
    try {
      try {
        const dataHistoryNew = {
          ...historyData,
          AuctionStepPrice,
          IDProduct,
          AuctionPriceInit,
          logo,
          AucitonStartDate,
          AuctionDuration,
          AuctionID,
          Price,
          Buyer,
          EndDate,
          Seller,
        };
        // Handle the error appropriately, e.g., display an error message to the user.
        const response = await axios.post('http://localhost:3000/history', dataHistoryNew);
        // window.location.reload();
        // dispatch(fetchProducts({}));
        setHistoryData({
          id: '',
          AucitonStartDate: 0,
          AuctionDuration: 0,
          AuctionID: '',
          AuctionPriceInit: '',
          BuyAt: 0,
          Buyer: '',
          EndDate: 0,
          IDProduct: '',
          Price: '',
          Seller: '',
          status: 1,
          typeHistory: 1,

        })
      }
      catch (e) { console.log(e); alertWrong('Product and NFT created Failed'); }
      // check tiếp server AI
    } catch (error) {
      console.error('Lỗi khi gửi request:', error);
      alertWrong('Product and NFT created Failed');
    }
    // finally {
    //   setLoading(false);
    // }
  };
  const weiToEther = (weiValue) => {
    const result = Number(weiValue) / 10 ** 18; // Chia giá trị wei cho 10^18
    return result;
  }
  const handleUpdateEnd = async () => {
    const currentTime = new Date();
    try {
      const CONTRACTADDRESS = "0x3498819a4751ceB62EdEE1cE3DCbC88e20D6c7bb";
      const contractABI = contract.abi;


      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contracts = new ethers.Contract(CONTRACTADDRESS, contractABI, signer);
      const highestBidder = await contracts.getHighestBidder(Info.AuctionID);
      const highestBid = await contracts.getHighestBid(Info.AuctionID);
      const filter = contracts.filters.NewBid();
      const events = await contracts.queryFilter(filter);
      const tx = await contracts.AuctionNFT(Info.nftTokenId, Info.AuctionID)
      await handlePostHistory(Info.StepPrice,Info.logo, Info.price, Info.sellAt, Info.TimeAuction, Info.id, Info.AuctionID, (Number(Info.price) + Number(weiToEther(highestBid))), highestBidder.toLowerCase(),
        (Number(Info.sellAt) + Number(Info.TimeAuction)), Info.addressOwner);
      const dataUpdateProduct = {
        updateAt: currentTime.getTime(),
        price: "0",
        sellAt: 0,
        status: 1,
        StepPrice: "0",
        TimeAuction: 0,
        addressOwnerBy: highestBidder.toLowerCase(),

      }
      const response = await axios.patch(`http://localhost:3000/product/${Info.id}`, dataUpdateProduct);
    } catch (error) {
      console.log(error);
    }
  }
  // async function handleGetInfoAuction() {
  //   const CONTRACTADDRESS = "0x56F70F122ff8b1149Be3F0E8260522AAfdf574BB";
  //   const contractABI = contract.abi;

  //   try {
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     const signer = provider.getSigner();
  //     const contracts = new ethers.Contract(CONTRACTADDRESS, contractABI, signer);
  //     const highestBidder = await contracts.getHighestBidder(Info.AuctionID);
  //     const filter = contracts.filters.NewBid();
  //     const events = await contracts.queryFilter(filter);
  //     sethighestBidderAuction(highestBidder);

  //   } catch (error) {
  //     console.log(error);
  //     throw new Error('Lỗi mint NFT');
  //   }
  // }
  const handleEndNotBidder = async () => {
    const currentTime = new Date();
    try {
      await handlePostHistory(Info.StepPrice,Info.logo, Info.price, Info.sellAt, Info.TimeAuction, Info.id, Info.AuctionID, Info.price, Info.addressOwner,
        (Number(Info.sellAt) + Number(Info.TimeAuction)), Info.addressOwner);
      const dataUpdateProduct = {
        updateAt: currentTime.getTime(),
        price: "0",
        sellAt: 0,
        status: 1,
        StepPrice: "0",
        TimeAuction: 0,

      }
      const response = await axios.patch(`http://localhost:3000/product/${Info.id}`, dataUpdateProduct);
    } catch (error) {
      console.log(error)
    }

  }
  const fullHandle = async () => {
    // console.log(Info.AuctionID);
      const filterData = allhistorys.historydata.filter(item => item.AuctionID === Info.AuctionID)
      try {
        const CONTRACTADDRESS = "0x3498819a4751ceB62EdEE1cE3DCbC88e20D6c7bb";
        const contractABI = contract.abi;
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contracts = new ethers.Contract(CONTRACTADDRESS, contractABI, signer);
        const highestBid = await contracts.getHighestBid(Info.AuctionID);
        const currentTime = new Date();
        const highestBidData = ethers.BigNumber.from(highestBid);
        // làm tiếp đấu giá và hiển thị đã kết thúc nó vẫn chưa vô handleUpdateEnd();
        console.log(highestBid);
        if (filterData.length === 0 && Number(ethers.utils.formatEther(highestBidData)) > 0 && (Number(Info.sellAt) + Number(Info.TimeAuction) <= currentTime.getTime())) {
            // console.log("yes");
            await handleUpdateEnd();
            dispatch(fetchHistorys({}));
        }
        else if(filterData.length === 0 && (Number(Info.sellAt) + Number(Info.TimeAuction) <= currentTime.getTime())) {
          // console.log("not");
          handleEndNotBidder();
          dispatch(fetchHistorys({}));
        }

      } catch (e) {
        console.log(e);
      }
  }

  return <Countdown date={timeEnd} renderer={renderer} onComplete={fullHandle} />;
}

AuctionCountdown.propTypes = {
  timeEnd: PropTypes.number.isRequired,
  Info: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    logo: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    createAt: PropTypes.string.isRequired,
    addressOwner: PropTypes.string.isRequired,
    addressCreateBy: PropTypes.string.isRequired,
    sellAt: PropTypes.string.isRequired,
    status: PropTypes.number.isRequired,
    nftTokenId: PropTypes.number.isRequired,
    TimeAuction: PropTypes.number.isRequired,
    AuctionID: PropTypes.number.isRequired,
    StepPrice: PropTypes.string.isRequired,
    BuyEndAt:PropTypes.number.isRequired
  }),
};

export default AuctionCountdown;
