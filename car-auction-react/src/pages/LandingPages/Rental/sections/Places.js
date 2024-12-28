/*
=========================================================
* Material Kit 2 PRO React - v2.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-kit-pro-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { Button } from "@mobiscroll/react-lite";
import { useDispatch, useSelector } from "react-redux";
import { upCountNFTProduct, fetchProducts, setSeller } from "redux/redux";
import VehicleFixedCard from "components/VehicleCards/VehicleFixedCard";
import { formatUnits } from "ethers/lib/utils";


// Material Kit 2 PRO React components
import MKBox from "components/MKBox";
import { ethers } from "ethers";


// Images
import vehicle1 from "assets/images/motors.stylemixthemes.com/01-6-255x135.jpg";
import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from "react";
import contract from '../../../../contract/AINFTCollection.json'
import alertWrong from "../../../../components/Alert/alertwrong";
import alertCustome from "../../../../components/Alert/alert";

// Images
import MKTypography from "../../../../components/MKTypography";
import VehicleAuctionCard from "../../../../components/VehicleCards/VehicleAuctionCard";
import VehicleCard from "../../../../components/VehicleCards/VehicleCard";
import CreateProduct from "../../../../components/CreateProduct/index";



function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    const id = setInterval(() => {
      savedCallback.current();
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
}
const timeNow = Date.now();
const Places = () => {
  const InforUser = useSelector((state) => state.dataKit.infoUser);
  const countNFTProduct = useSelector((state) => state.dataKit.countNFTProduct.count);
  const allProducts = useSelector((state) => state.dataKit.allProducts);
  const allhistorys = useSelector((state) => state.dataKit.allhistorys);
  const dispatch = useDispatch();
  const handleCreate = (tokenIdCountinue) => {
    dispatch(upCountNFTProduct({ value: tokenIdCountinue }));

  };


  const [auctionPrice, setAuctionPrice] = useState(13000);
  const [auctionPeople, setAuctionPeople] = useState(15);
  const [BidderHistory, setBidderHistory] = useState([]);
  const [uniqueBiddersAuction, setuniqueBiddersAuction] = useState(new Set());
  const [auctionData, setAuctionData] = useState([]);
  const [seen, setSeen] = useState(false);
  const [activeTab, setActiveTab] = useState('dangDienRa');

  async function handleGetInfoAuction() {
    const CONTRACTADDRESS = "0x3498819a4751ceB62EdEE1cE3DCbC88e20D6c7bb";
    const contractABI = contract.abi;

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contracts = new ethers.Contract(CONTRACTADDRESS, contractABI, signer);
      const filter = contracts.filters.NewBid();
      const events = await contracts.queryFilter(filter);
      const bidderData = events.map((event) => ({
        auctionId: event.args.auctionId.toNumber(),
        address: event.args.bidder,
        amount: formatUnits(event.args.amount, 18), // Giá trị bid hiện tại
        totalBid: formatUnits(event.args.totalBid, 18),
      }));
      // // count user auctionedauctioned
      // const uniqueBidders = new Set();

      // bidderData.forEach((bid) => {
      //   uniqueBidders.add(bid.address);
      // });

      // console.log("Lịch sử bid:", bidderData);
      setBidderHistory(bidderData);
      // setuniqueBiddersAuction(uniqueBidders);
      // console.log(uniqueBidders.length());
    } catch (error) {
      console.log(error);
      throw new Error('Lỗi mint NFT');
    }
  }

  async function handleGetInfoTotalAndBidderCount() {
    const CONTRACTADDRESS = "0x3498819a4751ceB62EdEE1cE3DCbC88e20D6c7bb";
    const contractABI = contract.abi;

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contracts = new ethers.Contract(CONTRACTADDRESS, contractABI, signer);
      // console.log(1)
      const allTotalBidAmounts = await contracts.getAllTotalBidAmounts();
      const allBidderCounts = await contracts.getAllBidderCounts();
      const auctionIdsFromContract = allTotalBidAmounts[0];
      const totalBidAmountsFromContract = allTotalBidAmounts[1];
      const bidderCountsFromContract = allBidderCounts[1];

      // console.log(2)
      const auctionDataArray = auctionIdsFromContract.map((id, index) => ({
        auctionId: id.toNumber(),
        totalBidAmount: parseFloat(ethers.utils.formatEther(totalBidAmountsFromContract[index])),
        bidderCount: bidderCountsFromContract[index].toNumber()
      }));
      // console.log(3)
      // console.log(auctionDataArray);
      setAuctionData(auctionDataArray);
    } catch (error) {
      console.log(error);
      throw new Error('Lỗi mint NFT');
    }
  }

  useInterval(() => {
    if (InforUser.walletAddress !== "") {
      handleGetInfoTotalAndBidderCount();
    }
    dispatch(fetchProducts({}));
  }, 1000);
  useEffect(() => {
    if (InforUser.walletAddress !== "") {
      handleGetInfoTotalAndBidderCount();
    }
  }, [InforUser])

  const togglePop = () => {
    setSeen(!seen);
  };
  // useEffect(() => {
  //   if (BidderHistory.length === 0 && InforUser.walletAddress !== "") {
  //     handleGetInfoAuction();
  //   }

  // }, [])
  const auctionLookup = auctionData.reduce((acc, auction) => {
    acc[auction.auctionId] = auction;
    // console.log(acc)
    return acc;
  }, {});

  const tabs = [
    { label: 'Đang Diễn Ra', value: 'dangDienRa' },
    { label: 'Đã Kết Thúc', value: 'daKetThuc' },
    { label: 'Đã Tham Gia', value: 'daThamGia' },
  ];
  // console.log(allProducts)
  const [isfound, setisfound] = useState(false)
  const handleFound = async (AuctionID) => {
    const CONTRACTADDRESS = "0x3498819a4751ceB62EdEE1cE3DCbC88e20D6c7bb";
    const contractABI = contract.abi;

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contracts = new ethers.Contract(CONTRACTADDRESS, contractABI, signer);
      const getAllBidders = await contracts.getAllBidders(AuctionID);
      const found = getAllBidders.some((bidder) => bidder.toLowerCase() === InforUser.walletAddress)
      setisfound(found);
    } catch (e) {
      console.log(e);
    }
  }

  // tab chia rồi hãy ghi nội dụng vào history trong FB và lấy dữ liệu dó để chia ra

  return (
    <div style={{ backgroundColor: "#1e1e1e" }}>
      <MKBox component="section" py={1}>
        <div className="tabs-container" style={{ fontFamily: "monospace", fontSize: 20, marginBottom: "2%", backgroundColor: '#1e1e1e', padding: '8px', borderRadius: '8px', alignItems: "center", justifyContent: "center", display: "flex" }}>
          {tabs.map(tab => (
            <div
              role="button"
              key={tab.value}
              tabIndex={0}
              className={`tab ${activeTab === tab.value ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.value)}
              onKeyDown={() => setActiveTab(tab.value)}
              style={{
                display: 'inline-block',
                padding: '2px 4px',
                borderRadius: '12px',
                marginRight: '20px',
                cursor: 'pointer',
                color: activeTab === tab.value ? '#00FF9D' : '#D9D9D9',
                border: activeTab === tab.value ? '1px solid #00FF9D' : '1px solid grey',
                outline: 'none'
              }}
            >
              {tab.value === "dangDienRa" && (
                <span
                  style={{
                    marginLeft: '4px',
                    marginRight: '4px',
                    marginBottom: '2px',
                    borderRadius: '50%',
                    backgroundColor: '#00FF9D',
                    display: 'inline-block',
                    width: '8px',
                    height: '8px',
                  }}
                />
              )}
              <span style={{ fontSize: 20 }}>{tab.label}</span>


            </div>
          ))}
        </div>
        <Container>
          <Grid
            container
            item
            xs={8}
            flexDirection="column"
            alignItems="center"
            mx="auto"
            textAlign="left"
            mb={6}
          >

            <MKTypography variant="h3" mb={1}  >
              <span style={{ color: "white" }}>Auction</span>
            </MKTypography>
          </Grid>
          <Grid container spacing={3} sx={{ mt: 3 }}>

            {activeTab === "dangDienRa" ? (allProducts.products.map(item => {
              if (item.TimeAuction > 0 && Number(item.price) > 0 && timeNow >= item.sellAt) {
                const matchingAuctions = auctionData.filter(auction => auction.auctionId === item.AuctionID);
                // console.log(matchingAuctions);
                const infoProps = {
                  id: item.id,
                  name: item.name,
                  logo: item.logo,
                  price: item.price,
                  description: item.description,
                  createAt: item.createAt,
                  addressOwner: item.addressOwnerBy,
                  addressCreateBy: item.addressCreateBy,
                  sellAt: item.sellAt,
                  status: item.status,
                  nftTokenId: item.nftTokenId,
                  TimeAuction: item.TimeAuction,
                  AuctionID: item.AuctionID,
                  StepPrice: item.StepPrice,
                  Seller: "",
                  Buyer: "",
                  typeHistory: 1,
                  BuyEndAt: 0
                }
                // làm tiếp giao diên bên trong đấu giá gia hạn thêm time và hủy phiên đấu giá , các người dùng lấy lại bid và người bán được thì thu thêm số token và khi đang đấu giá người dùng bị vô hiệu hóa nút auction và sell

                const actionProps = {
                  type: "internal",
                  route: `/detail-product-Auction/${item.id}`,
                  color: "success",
                  label: "place a bid",
                };
                return (
                  <Grid key={item.id} item xs={12} md={6} lg={3}>
                    <MKBox mt={3}>
                      <VehicleAuctionCard
                        // image="https://res.cloudinary.com/djit2fyvr/image/upload/v1733246124/ImageNFT/ximo5hxhyogc9i2mjgbh.jpg"
                        // title="MERCEDES-BENZ"
                        // vehicleInfo={{ miles: 15, fuel: "12/23", transmission: "Manual" }}
                        timeData={{ timeStart: item.sellAt, timeDuration: item.TimeAuction }}
                        topBidPrice={matchingAuctions.length > 0 && InforUser.walletAddress !== "" ? matchingAuctions[0].totalBidAmount : "-"}
                        allBidCount={matchingAuctions.length > 0 && InforUser.walletAddress !== "" ? matchingAuctions[0].bidderCount : "-"}
                        action={actionProps}
                        Info={infoProps}
                      />
                    </MKBox>
                  </Grid>

                )
              } return null;
            })) :
              (allhistorys.historydata.map((item) => {
                // console.log(allhistorys);
                if (item.typeHistory === 1) {
                  const matchDataProduct = allProducts.products.filter(history => history.id === item.IDProduct);
                  // console.log(matchDataProduct[0].AuctionID);
                  const matchingAuctions = auctionData.filter(auction => auction.auctionId === item.AuctionID);
                  const infoProps = {
                    id: matchDataProduct[0].id,
                    name: matchDataProduct[0].name,
                    logo: matchDataProduct[0].logo,
                    price: item.AuctionPriceInit,
                    description: matchDataProduct[0].description,
                    createAt: matchDataProduct[0].createAt,
                    addressOwner: matchDataProduct[0].addressOwnerBy,
                    addressCreateBy: matchDataProduct[0].addressCreateBy,
                    sellAt: item.AucitonStartDate,
                    status: item.status,
                    nftTokenId: matchDataProduct[0].nftTokenId,
                    TimeAuction: item.AuctionDuration,
                    AuctionID: item.AuctionID,
                    StepPrice: item.AuctionStepPrice,
                    Seller: item.Seller,
                    Buyer: item.Buyer,
                    typeHistory: item.typeHistory,
                    BuyEndAt: 0
                  }
                  const actionProps = {
                    type: "internal",
                    route: `/detail-product-Auction/${item.id}`,
                    color: "success",
                    label: "place a bid",
                  };

                  return (
                    <Grid key={item.id} item xs={12} md={6} lg={3}>
                      <MKBox mt={3}>
                        <VehicleAuctionCard
                          // image="https://res.cloudinary.com/djit2fyvr/image/upload/v1733246124/ImageNFT/ximo5hxhyogc9i2mjgbh.jpg"
                          // title="MERCEDES-BENZ"
                          // vehicleInfo={{ miles: 15, fuel: "12/23", transmission: "Manual" }}
                          timeData={{ timeStart: item.BuyAt, timeDuration: item.AuctionDuration }}
                          topBidPrice={InforUser.walletAddress !== "" ? matchingAuctions[0].totalBidAmount : "-"}
                          allBidCount={InforUser.walletAddress !== "" ? matchingAuctions[0].bidderCount : "-"}
                          action={actionProps}
                          Info={infoProps}
                        />
                      </MKBox>
                    </Grid>

                  )
                } return null;
                // if (activeTab === "daThamGia") {
                //   handleFound(item.AuctionID)
                  
                //   if (isfound === true) {
                //     const matchDataProduct = allProducts.products.filter(history => history.id === item.IDProduct);
                //     // console.log(matchDataProduct[0].AuctionID);
                //     const matchingAuctions = auctionData.filter(auction => auction.auctionId === item.AuctionID);
                //     const infoProps = {
                //       id: matchDataProduct[0].id,
                //       name: matchDataProduct[0].name,
                //       logo: matchDataProduct[0].logo,
                //       price: item.AuctionPriceInit,
                //       description: matchDataProduct[0].description,
                //       createAt: matchDataProduct[0].createAt,
                //       addressOwner: matchDataProduct[0].addressOwnerBy,
                //       addressCreateBy: matchDataProduct[0].addressCreateBy,
                //       sellAt: item.AucitonStartDate,
                //       status: item.status,
                //       nftTokenId: matchDataProduct[0].nftTokenId,
                //       TimeAuction: item.AuctionDuration,
                //       AuctionID: item.AuctionID,
                //       StepPrice: item.AuctionStepPrice,
                //       Seller: item.Seller,
                //       Buyer: item.Buyer,
                //       typeHistory: item.typeHistory,
                //       BuyEndAt: 0
                //     }
                //     const actionProps = {
                //       type: "internal",
                //       route: `/detail-product-Auction/${item.id}`,
                //       color: "success",
                //       label: "place a bid",
                //     };

                //     return (
                //       <Grid key={item.id} item xs={12} md={6} lg={3}>
                //         <MKBox mt={3}>
                //           <VehicleAuctionCard
                //             // image="https://res.cloudinary.com/djit2fyvr/image/upload/v1733246124/ImageNFT/ximo5hxhyogc9i2mjgbh.jpg"
                //             // title="MERCEDES-BENZ"
                //             // vehicleInfo={{ miles: 15, fuel: "12/23", transmission: "Manual" }}
                //             timeData={{ timeStart: item.BuyAt, timeDuration: item.AuctionDuration }}
                //             topBidPrice={InforUser.walletAddress !== "" ? matchingAuctions[0].totalBidAmount : "-"}
                //             allBidCount={InforUser.walletAddress !== "" ? matchingAuctions[0].bidderCount : "-"}
                //             action={actionProps}
                //             Info={infoProps}
                //           />
                //         </MKBox>
                //       </Grid>

                //     )
                //   }
                // } return null;
              }))}
          </Grid>
        </Container>
      </MKBox>
      <MKBox component="section" py={1}>
        <Container>
          <Grid
            container
            item
            xs={8}
            flexDirection="column"
            alignItems="center"
            mx="auto"
            textAlign="left"
            mb={6}
          >
            <MKTypography variant="h4" mb={1}>
              <span style={{ color: "white" }}>Fixed Price</span>
            </MKTypography>
          </Grid>
          <Grid container spacing={1} sx={{ mt: 3 }}>
            {activeTab === "dangDienRa" ? (allProducts.products.map(item => {
              // console.log(111);
              // console.log(item.price);
              if (item.price !== "0" && item.TimeAuction === 0) {
                const actionProps1 = {
                  type: "internal",
                  route: `/detail-product-buy/${item.id}`,
                  color: "success",
                  label: "Buy",
                };
                const infoProps = {
                  id: item.id,
                  name: item.name,
                  logo: item.logo,
                  price: item.price,
                  description: item.description,
                  createAt: item.createAt,
                  addressOwner: item.addressOwnerBy,
                  addressCreateBy: item.addressCreateBy,
                  sellAt: item.sellAt,
                  status: item.status,
                  nftTokenId: item.nftTokenId,
                  TimeAuction: 0,
                  AuctionID: -1,
                  StepPrice: 0,
                  Seller: "",
                  Buyer: "",
                  typeHistory: 0,
                  BuyEndAt: 0
                }

                return (
                  <Grid key={item.id} item xs={12} md={6} lg={3}>
                    <MKBox mt={3}>
                      <VehicleFixedCard
                        image={vehicle1}
                        title="MERCEDES-BENZ"
                        vehicleInfo={{ miles: 15, fuel: "12/23", transmission: "Manual" }}
                        action={actionProps1}
                        Info={infoProps}
                      />
                    </MKBox>
                  </Grid>
                )
              } return null;
            })) :
              (allhistorys.historydata.map(item => {
                if (item.typeHistory === 0) {
                  console.log(item);
                  const matchDataProduct = allProducts.products.filter(history => history.id === item.IDProduct)
                  console.log(matchDataProduct)
                  // const matchingAuctions = auctionData.filter(auction => auction.auctionId === item.AuctionID);
                  // console.log(matchDataProduct[0]);

                  const actionProps1 = {
                    type: "internal",
                    route: `/detail-product-buy/${item.id}`,
                    color: "success",
                    label: "Detail",
                  };
                  const infoProps = {
                    id: matchDataProduct[0].id,
                    name: matchDataProduct[0].name,
                    logo: matchDataProduct[0].logo,
                    price: item.Price,
                    description: matchDataProduct[0].description,
                    createAt: matchDataProduct[0].createAt,
                    addressOwner: matchDataProduct[0].addressOwnerBy,
                    addressCreateBy: matchDataProduct[0].addressCreateBy,
                    sellAt: item.BuyAt,
                    status: matchDataProduct[0].status,
                    nftTokenId: matchDataProduct[0].nftTokenId,
                    TimeAuction: 0,
                    AuctionID: -1,
                    StepPrice: 0,
                    Seller: item.Seller,
                    Buyer: item.Buyer,
                    typeHistory: item.typeHistory,
                    BuyEndAt: item.BuyEndAt
                  }
                  return (
                    <Grid key={item.id} item xs={12} md={6} lg={3}>
                      <MKBox mt={3}>
                        <VehicleFixedCard
                          image={vehicle1}
                          vehicleInfo={{ miles: 15, fuel: "12/23", transmission: "Manual" }}
                          action={actionProps1}
                          Info={infoProps}
                        />
                      </MKBox>
                    </Grid>
                  )
                } return null;
              }))}
          </Grid>
        </Container>
      </MKBox>
    </div>
  );
};

export default Places;
