import React, { useEffect, useRef, useState } from "react";
import PropTypes from 'prop-types'
import {
    Row,
    Col,
    Card,
    Label,
    Input,
    Button,
    CardImg,
    CardText,
    CardBody,
    CardTitle,
    FormGroup,
    CardSubtitle,
    Form,
} from "reactstrap";
import { useLocation, useNavigate } from "react-router-dom";
import ExamplesNavbar from "components/Navbars/ExamplesNavbar";
import ProfilePageHeader from "components/Headers/ProfilePageHeader";
import DetailPageHeader from "components/Headers/DetailPageHeader";
import footerRoutes from "footer.routes";
import DefaultFooter from "components/Footers/DefaultFooter";
import "../../../assets/css/detailProduct.css";
import MKBox from "components/MKBox";
import DetailProductNav from "components/Navbars/DetailProductNav";
import * as icon from '@coreui/icons';
import CIcon from "@coreui/icons-react";
import fotmatTime from "components/format/formatTime";
import axios from "axios";
import alertCustome from "components/Alert/alert";
import alertWrong from "components/Alert/alertwrong";
import { ethers } from "ethers";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, setInitBuy, Buy, setStatusAuction, setFlagCurrent } from "redux/redux";
import { SwishSpinner } from "react-spinners-kit";
import AuctionCountdown from "components/VehicleCards/VehicleAuctionCard/AuctionCountdown";
import contract from '../../../contract/AINFTCollection.json'


// tai css
const ProductViewAuction = () => {
    const location = useLocation();
    const pageHeader = React.createRef();
    const [loading, setloading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // const statusAuction = useSelector((state) => state.dataKit.AuctionStatus.auctionStatus);
    const allhistorys = useSelector((state) => state.dataKit.allhistorys);
    const InfoSellBuyer = useSelector((state) => state.dataKit.AuctionStatus);
    const [isOpen, setisOpen] = useState(false);
    const [checkStatus, setcheckStatus] = useState(0);
    const [isStatus, setisStatus] = useState(false)

    const { infoProduct } = location.state || {};
    const product = infoProduct;
    if (!product) {
        return null;
    }
    const [price, setprice] = useState(product.price);
    const [amountAuction, setamountAuction] = useState("0");
    const [BidderHistory, setBidderHistory] = useState([]);
    const [uniqueBiddersAuction, setuniqueBiddersAuction] = useState(new Set());
    const [priceUploaded, setpriceUploaded] = useState(product.price);
    const InforUser = useSelector((state) => state.dataKit.infoUser);
    const InfoProduct = useSelector((state) => state.dataKit.buyAuction);
    const [highestBidAuction, sethighestBidAuction] = useState(0);
    const [highestBidderAuction, sethighestBidderAuction] = useState("");
    const [isTakenEthers, setisTakenEthers] = useState(0);
    const [bidders, setBidders] = useState([]);
    const [isEnd, setisEnd] = useState(false);
    const [historyData, setHistoryData] = useState({
        AucitonStartDate: 0,
        AuctionDuration: 0,
        AuctionID: '',
        AuctionPriceInit: '',
        StepPrice: '',
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
    const timeEnd = product.sellAt + product.TimeAuction;
    // const [addressCreateBy, setaddressCreateBy] = useState(product.addressCreatBy)

    const shortenAddress = (address) => {
        if (!address) return ""; // Xử lý trường hợp address là null hoặc undefined
        const start = address.slice(0, 6);
        const end = address.slice(-5);
        return `${start}...${end}`;
    }
    const etherToWei = (etherValue) => {
        const result = BigInt(Math.floor(etherValue * 10 ** 18));
        return result;
    }

    const weiToEther = (weiValue) => {
        const result = Number(weiValue) / 10 ** 18; // Chia giá trị wei cho 10^18
        return result;
    }
    // console.log(product);
    const titleAndTo = {
        titleNav: "BACK TO AUCTION",
        toNav: "/",
        titleHeader: "My Detail Product"
    }
    const handleGetInfoAuction = async () => {
        // setBidderHistory([]);
        const CONTRACTADDRESS = "0x3498819a4751ceB62EdEE1cE3DCbC88e20D6c7bb";
        const contractABI = contract.abi;
        const { formatUnits } = ethers.utils;
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contracts = new ethers.Contract(CONTRACTADDRESS, contractABI, signer);
            const filter = contracts.filters.NewBid();
            const events = await contracts.queryFilter(filter);
            const highestBid = await contracts.getHighestBid(product.AuctionID);
            const highestBidder = await contracts.getHighestBidder(product.AuctionID);
            const getIsTakenEther = await contracts.getIsTakenEther(product.AuctionID);
            const getAllBidders = await contracts.getAllBidders(product.AuctionID);
            const bidderData = events.map((event) => ({
                auctionId: event.args.auctionId.toNumber(),
                address: event.args.bidder,
                amount: formatUnits(event.args.amount, 18), // Giá trị bid hiện tại
                totalBid: formatUnits(event.args.totalBid, 18),// Tổng số tiền bid tích lũy
            }));
            //  check lại cái ng tham gia tổng tiền và tổng số tiền và cập nhật trạng thái thường xuyên khi có đấu giá và chia các trạng thái
            // count user auctionedauctioned
            const uniqueBidders = new Set();

            bidderData.forEach((bid) => {
                uniqueBidders.add(bid.address);
            });
            // console.log(bidderData);
            const highestBidData = ethers.BigNumber.from(highestBid);
            sethighestBidAuction(weiToEther(Number(highestBidData.toString())));
            sethighestBidderAuction(highestBidder);
            setisTakenEthers(getIsTakenEther.toNumber());
            setBidders(getAllBidders);
            // console.log(highestBidder);
            setBidderHistory(bidderData);
            setuniqueBiddersAuction(uniqueBidders)
            // console.log("Lịch sử bid:", bidderData);
        } catch (error) {
            console.log(error);
            throw new Error('Lỗi mint NFT');
        }
    }
    const handleStatus = async () => {
        // console.log(`${InfoProduct.addressOwner} ${InfoProduct.addressCreateBy} ${InfoProduct.status}`)
        // const currentTime = new Date();
        // const CONTRACTADDRESS = "0x3498819a4751ceB62EdEE1cE3DCbC88e20D6c7bb";
        // const contractABI = contract.abi;
        // const { formatUnits } = ethers.utils;
        // try {
        //     const provider = new ethers.providers.Web3Provider(window.ethereum);
        //     const signer = provider.getSigner();
        //     const contracts = new ethers.Contract(CONTRACTADDRESS, contractABI, signer);
        //     const filter = contracts.filters.NewBid();
        //     const events = await contracts.queryFilter(filter);
        //     const highestBid = await contracts.getHighestBid(product.AuctionID);
        //     const highestBidder = await contracts.getHighestBidder(product.AuctionID);
        //     const bidhasCustomer = await contracts.getBidderBid(product.AuctionID, InforUser.walletAddress)
        //     const highestBidBN = ethers.BigNumber.from(highestBid);
        //     const highestBidAuction = ethers.utils.formatEther(highestBidBN);
        //     console.log(highestBidAuction);

        // if ((InfoProduct.addressOwner === InforUser.walletAddress && InfoProduct.status === 0 && highestBid === 0)) {
        //     setcheckStatus(-1);
        // }
        // else if ((InfoProduct.addressOwner === InforUser.walletAddress &&
        //     InfoProduct.addressCreateBy !== InforUser.walletAddress && InfoProduct.status === 1 && highestBid !== 0)) {
        //     setcheckStatus(1);
        // }
        // else if ((InfoProduct.addressOwner !== InforUser.walletAddress &&
        //     InfoProduct.addressCreateBy === InforUser.walletAddress && InfoProduct.status === 1 && highestBid !== 0)) {
        //     setcheckStatus(2);
        // }
        //  else if ((InfoProduct.addressOwner === InforUser.walletAddress &&
        //     InfoProduct.addressCreateBy === InforUser.walletAddress && InfoProduct.status === 1 && highestBid !== 0)) {
        //     setcheckStatus(3);
        // }
        // else if ((InfoProduct.addressOwner === InforUser.walletAddress &&
        //     InfoProduct.addressCreateBy === InforUser.walletAddress && InfoProduct.status === 1 && highestBid === 0)) {
        //     setcheckStatus(4);
        // }
        // else if ((product.addressOwner !== InforUser.walletAddress &&
        //     InfoProduct.addressCreateBy !== InforUser.walletAddress && seller === InforUser.walletAddress && InfoProduct.status === 1 && highestBid !== 0 )) {
        //     setcheckStatus(4);
        // }

        // /// ngày mai làm nhất quyết thêm Buyer sau đó thay đổi smartcontract chia ra là chuyển ảnh 
        // /// và take ethereum riêng cùng với đó làm thêm cái đã tham giá ngày mai phải làm dc
        // else { setcheckStatus(0); }
        try {
            // const currentTime = new Date();
            const CONTRACTADDRESS = "0x3498819a4751ceB62EdEE1cE3DCbC88e20D6c7bb";
            const contractABI = contract.abi;
            const { formatUnits } = ethers.utils;
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contracts = new ethers.Contract(CONTRACTADDRESS, contractABI, signer);
            const filter = contracts.filters.NewBid();
            const events = await contracts.queryFilter(filter);
            const bidhasCustomer = await contracts.getBidderBid(product.AuctionID, InforUser.walletAddress)
            const highestBid = await contracts.getHighestBid(product.AuctionID);
            const highestBidData = ethers.BigNumber.from(highestBid);
            const bidhasCustomerData = ethers.BigNumber.from(bidhasCustomer);
            const filterDataAddress = bidders.some(item => item.toLowerCase() === InforUser.walletAddress)
            console.log(filterDataAddress,product.Seller,product.Buyer,InforUser.walletAddress,InfoProduct.status,Number(ethers.utils.formatEther(highestBidData)))
            if ((InfoProduct.addressOwner === InforUser.walletAddress && InfoProduct.status === 0 && Number(ethers.utils.formatEther(highestBidData)) === 0)) {
                setcheckStatus(-1);
            }
            else if ((InfoProduct.addressOwner === InforUser.walletAddress && InfoProduct.status === 0 && Number(ethers.utils.formatEther(highestBidData)) !== 0)) {
                setcheckStatus(5);
            }
            else if ((product.Seller !== product.Buyer && product.Buyer === InforUser.walletAddress && InfoProduct.status === 1 && Number(ethers.utils.formatEther(highestBidData)) !== 0)) {
                setcheckStatus(1);
            }
            else if ((product.Seller !== product.Buyer && product.Seller === InforUser.walletAddress && InfoProduct.status === 1 && Number(ethers.utils.formatEther(highestBidData)) !== 0)) {
                setcheckStatus(2);
            }

                else if ((product.Seller === product.Buyer && InfoProduct.status === 1 && Number(ethers.utils.formatEther(highestBidData)) === 0)) {
                setcheckStatus(3);
            }
            else if ((Number(ethers.utils.formatEther(bidhasCustomerData))) > 0 && filterDataAddress === true && product.Seller !== InforUser.walletAddress && product.Buyer !== InforUser.walletAddress
                && InfoProduct.status === 1 && Number(ethers.utils.formatEther(highestBidData)) !== 0) {
                setcheckStatus(4);
            } 
            else if ((Number(ethers.utils.formatEther(bidhasCustomerData))) === 0 && filterDataAddress === true && product.Seller !== InforUser.walletAddress && product.Buyer !== InforUser.walletAddress
                && InfoProduct.status === 1 && Number(ethers.utils.formatEther(highestBidData)) !== 0) {
                setcheckStatus(7);
            } 
            else if(isTakenEthers === 1)
            {
                setcheckStatus(6);
            }

            /// ngày mai làm nhất quyết thêm Buyer sau đó thay đổi smartcontract chia ra là chuyển ảnh 
            /// và take ethereum riêng cùng với đó làm thêm cái đã tham giá ngày mai phải làm dc
            else { setcheckStatus(0); }
        } catch (e) {
            alertWrong("Server error");
            console.log(e);
        }
    }
    const handlePostHistory = async (AuctionStepPrice, logo, AuctionPriceInit, AucitonStartDate, AuctionDuration, IDProduct, AuctionID, Price, Buyer, EndDate, Seller) => {
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
    // Check xem role
    useEffect(async () => {

        const InfoProductInit = {
            addressOwner: product.addressOwner,
            addressCreateBy: product.addressCreateBy,
            status: product.status,
        };
        await handleGetInfoAuction();
        await dispatch(setInitBuy({ value: InfoProductInit }));
        //     }
    }, [product]); // Mảng phụ thuộc bao gồm dispatch và product

    useEffect(() => {
        if (InfoProduct.addressOwner) { // Kiểm tra xem dữ liệu đã có sẵn chưa
            handleStatus();
        }
    }, [InfoProduct]);
    const handleUpdateEnd = async () => {
        const currentTime = new Date();
        try {
            await handlePostHistory(product.StepPrice, product.logo, product.price, product.sellAt, product.TimeAuction, product.id,
                product.AuctionID, (Number(product.price) + Number(highestBidAuction)), highestBidderAuction,
                (Number(product.sellAt) + Number(product.TimeAuction)), product.addressOwner);
            const dataUpdateProduct = {
                updateAt: currentTime.getTime(),
                price: "0",
                sellAt: 0,
                status: 1,
                StepPrice: "0",
                TimeAuction: 0,
                addressOwnerBy: highestBidderAuction.toLowerCase(),
                // check tiếp đấu giá sau đó fix smart contract làm cái tách cho người dùng nhận confirm lấy token
                // hiện tại bị đấu giá k lên nhưng nó lại phân ra thêm 
            }
            const response = await axios.patch(`http://localhost:3000/product/${product.id}`, dataUpdateProduct);
        } catch (error) {
            console.log(error);
        }
    }
    const handleEndNotBidder = async () => {
        const currentTime = new Date();
        try {
            await handlePostHistory(product.StepPrice, product.logo, product.price, product.sellAt, product.TimeAuction, product.id,
                product.AuctionID, product.price, product.addressOwner,
                (Number(product.sellAt) + Number(product.TimeAuction)), product.addressOwner);
            const dataUpdateProduct = {
                updateAt: currentTime.getTime(),
                price: "0",
                sellAt: 0,
                status: 1,
                StepPrice: "0",
                TimeAuction: 0,

            }
            const response = await axios.patch(`http://localhost:3000/product/${product.id}`, dataUpdateProduct);
        } catch (error) {
            console.log(error)
        }

    }
    // fix looix ghi len du lieu 2 lan vaf chia ra cac trang thai khac nhauuu
    // useEffect(async () => {
    //     const currentTime = new Date();
    //     const filterData = allhistorys.historydata?.filter(item => item.AuctionID === product.AuctionID)
    //     console.log(highestBidAuction,filterData)
    //     if ((Number(product.sellAt) + Number(product.TimeAuction)) <= currentTime.getTime() && highestBidAuction > 0 && filterData.length === 0) {
    //        console.log("yes");
    //         await handleUpdateEnd();
    //         // await handlePostHistory(product.logo, product.sellAt, product.TimeAuction, product.id, product.AuctionID, (Number(product.price) + Number(weiToEther(highestBidAuction))), highestBidderAuction,
    //         //     (Number(product.sellAt) + Number(product.TimeAuction)), product.addressOwner)
    //     } else if ((Number(product.sellAt) + Number(product.TimeAuction)) <= currentTime.getTime() && filterData.length === 0) {
    //         console.log("yes");
    //         await handleEndNotBidder();
    //     }
    // }, [highestBidAuction]);
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

    // useInterval(() => {
    //     const currentTime = new Date();
    //     console.log(statusAuction);
    //     if ( product.status === 0 && !statusAuction && flagCurrent === 0 && currentTime.getTime() >= (Number(product.sellAt) + Number(product.TimeAuction))) {
    //         dispatch(setStatusAuction({}));

    //     }
    // }, 1000);
    useInterval(async () => {
        handleGetInfoAuction();
    }, 1000);


    const handleChange = (event) => {
        const input = event.target.value;

        // Chỉ cho phép nhập số
        const numericValue = input.replace(/[^0-9.]/g, '');
        const value = numericValue.replace(/^0+/, '');
        // Nếu giá trị rỗng sau khi loại bỏ ký tự không phải số, đặt lại về '0'
        setprice(value);
    }

    const handleChangeAuction = (event) => {
        const input = event.target.value;

        // Chỉ cho phép nhập số
        const numericValue = input.replace(/[^0-9.]/g, '');
        const value = numericValue.replace(/^0+/, '');
        // Nếu giá trị rỗng sau khi loại bỏ ký tự không phải số, đặt lại về '0'
        setamountAuction(value);
    }

    const handleIsOpen = () => {
        setisOpen(!isOpen);
    }

    // async function handleUpdatePriceNFT() {
    //     const CONTRACTADDRESS = "0x56F70F122ff8b1149Be3F0E8260522AAfdf574BB";
    //     const contractABI = contract.abi;
    //     // const privateKey = addressWallet;
    //     // làm tiếp recall chưa gọi về được sau đó tiếp tục làm đấu giá
    //     try {
    //         setloading(true);
    //         if (product.nftTokenId !== "") {
    //             const provider = new ethers.providers.Web3Provider(window.ethereum);
    //             const signer = provider.getSigner();
    //             const contracts = new ethers.Contract(CONTRACTADDRESS, contractABI, signer);
    //             const tx = await contracts.setPrice(product.nftTokenId, etherToWei(price));
    //             await tx.wait();
    //             const currentTime = new Date();
    //             try {
    //                 const dataUpdateProduct =
    //                 {
    //                     updateAt: currentTime.getTime(),
    //                     price,
    //                     sellAt: currentTime.getTime(),
    //                     status: 0
    //                 }

    //                 const response = await axios.patch(`http://localhost:3000/product/${product.id}`, dataUpdateProduct);

    //                 if (response) {
    //                     setisOpen(false);
    //                     // alertReloadCustome({ titles: "Update Price Succerfully!",handleReload });
    //                     alertCustome("Update Price Succerfully!");
    //                     dispatch(fetchProducts({}));
    //                     setpriceUploaded(price);
    //                 }
    //                 else {
    //                     alertWrong("Update Price Failed!");
    //                 }
    //             } catch (error) {
    //                 alertWrong("Server Error!");
    //             }
    //             return { txHash: tx.hash };
    //         }
    //         alertWrong("Please! Check Price or Info of NFT!");
    //         return null;
    //     } catch (error) {
    //         alertWrong("Update Price Failed!");
    //         return null;
    //     } finally {
    //         setloading(false);
    //     }
    // }



    // reload lại giá
    // function useInterval(callback, delay) {
    //     const savedCallback = useRef();

    //     // Remember the latest callback.
    //     useEffect(() => {
    //         savedCallback.current = callback;
    //     }, [callback]);

    //     // Set up the interval.
    //     useEffect(() => {
    //         const id = setInterval(() => {
    //             savedCallback.current();
    //         }, delay);
    //         return () => clearInterval(id);
    //     }, [delay]);
    // }
    // useEffect(async () => {
    //     setloading(true);
    //     await new Promise(resolve => setTimeout(resolve, 2000));
    //     setloading(false)

    // }, [])

    // useInterval(() => {
    //     console.log(Date.now())
    //     // if (Date.now() <= product.sellAt + product.TimeAuction) {
    //     if (BidderHistory.length === 0) {
    //         handleGetInfoAuction();
    //     }
    //     console.log(BidderHistory);
    //     //  
    // }, 2000);


    async function handleBuyNFT() {
        const CONTRACTADDRESS = "0x3498819a4751ceB62EdEE1cE3DCbC88e20D6c7bb";
        const contractABI = contract.abi;

        try {
            setloading(true);
            if (Number(amountAuction) > Number(price) + weiToEther(Number(highestBidAuction)) && Number(amountAuction) - Number(price) + weiToEther(Number(highestBidAuction)) >= Number(product.StepPrice)) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const contracts = new ethers.Contract(CONTRACTADDRESS, contractABI, signer);
                // const priceOfNFT = await contracts.getPrice(product.nftTokenId);
                const tx = await contracts.putBid(product.AuctionID, {
                    value: etherToWei(Number(amountAuction))
                    /// check tiếp tục cái chỗ này
                });
                await tx.wait();
                await handleGetInfoAuction();
                alertCustome("Put Bid NFT Succerfully!");
                return { txHash: tx.hash };
            }
            alertWrong("Please! Amount has already!");
            return null;
        } catch (error) {
            console.log(error);
            throw new Error('Lỗi mint NFT');
        } finally {
            setloading(false);

        }
    }
    async function handleRecallNFT() {
        const CONTRACTADDRESS = "0x3498819a4751ceB62EdEE1cE3DCbC88e20D6c7bb";
        const contractABI = contract.abi;
        // const privateKey = addressWallet;
        // làm tiếp recall chưa gọi về được sau đó tiếp tục làm đấu giá
        try {
            setloading(true);
            if (product.nftTokenId !== "") {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const contracts = new ethers.Contract(CONTRACTADDRESS, contractABI, signer);
                const tx = await contracts.setPrice(product.nftTokenId, etherToWei("0"));
                await tx.wait();
                const currentTime = new Date();
                try {
                    const dataUpdateProduct =
                    {
                        updateAt: currentTime.getTime(),
                        price: "0",
                        sellAt: "",
                        status: -1
                    }

                    const response = await axios.patch(`http://localhost:3000/product/${product.id}`, dataUpdateProduct);

                    if (response) {
                        setisOpen(false);
                        // alertReloadCustome({ titles: "Update Price Succerfully!",handleReload });
                        alertCustome("Recalled Succerfully!");
                        dispatch(fetchProducts({}));
                        // setpriceUploaded(price);
                    }
                    else {
                        alertWrong("Update Price Failed!");
                    }
                } catch (error) {
                    alertWrong("Server Error!");
                }
                return { txHash: tx.hash };
            }
            alertWrong("Please! Check Price or Info of NFT!");
            return null;
        } catch (error) {
            alertWrong("Update Price Failed!");
            throw new Error('Lỗi mint NFT');
        } finally {
            setloading(false);
        }
    }

    const handleRecall = async () => {
        try {
            await handleRecallNFT();
            navigate("/");
        } catch (error) {
            alertWrong("Error When ReCall");
        }

    }
    const handelTakeEthereum = async () => {
        const CONTRACTADDRESS = "0x3498819a4751ceB62EdEE1cE3DCbC88e20D6c7bb";
        const contractABI = contract.abi;
        // const privateKey = addressWallet;
        // làm tiếp recall chưa gọi về được sau đó tiếp tục làm đấu giá
        try {
            console.log(highestBidAuction)
            setloading(true);
            if (product.nftTokenId !== "") {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const contracts = new ethers.Contract(CONTRACTADDRESS, contractABI, signer);
                const tx = await contracts.takeEthereum(product.AuctionID);
                await tx.wait();
                alertCustome("Take Ethereum Successfull!")
                return { txHash: tx.hash };
            }
            alertWrong("Please! We have an Error!");
            return null;
        } catch (error) {
            alertWrong("Update Price Failed!");
            throw new Error('Lỗi mint NFT');
        }
        finally {
            handleStatus();
            setloading(false);
        }
    }

    const handleTakeAgainEthereum = async () => {
        const CONTRACTADDRESS = "0x3498819a4751ceB62EdEE1cE3DCbC88e20D6c7bb";
        const contractABI = contract.abi;
        // const privateKey = addressWallet;
        // làm tiếp recall chưa gọi về được sau đó tiếp tục làm đấu giá
        try {
            setloading(true);
            console.log(111111);
            if (product.nftTokenId !== "") {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const contracts = new ethers.Contract(CONTRACTADDRESS, contractABI, signer);
                const tx = await contracts.withdrawBid(product.AuctionID);
                await tx.wait();
                alertCustome("Take again Ethereum Successfull!")
                return { txHash: tx.hash };
            }
            alertWrong("Please! We have an Error!");
            return null;
        } catch (error) {
            alertWrong("Update Price Failed!");
            throw new Error('Lỗi mint NFT');
        }
        finally {
            handleStatus();
            setloading(false);
        }
    }
    function Statuscurrent() {
        // console.log(checkStatus);
        if (checkStatus === -1) {
            // console.log(1111)
            return (
                <div>
                    <Button onClick={() => { setprice("0"); handleRecall(); }} style={{ marginLeft: 10 }} color="primary">ReCall</Button>
                    <Button onClick={handleIsOpen} style={{ marginLeft: 10 }} color="primary">Update Price</Button>
                </div>)
        }
        if (checkStatus === 1) {
            return (<Label style={{ color: "white", fontWeight: "bold" }} >You are Winner!</Label>)
        }
        if (checkStatus === 2) {
            return (
                <div>
                    <Label style={{ marginLeft: 10, color: "white" }} >{shortenAddress(product.addressOwner)} are Winner</Label>
                    <Button onClick={handelTakeEthereum} style={{ marginLeft: 10 }} color="primary">Take Ethereum</Button>
                </div>
            )
        }
        if (checkStatus === 3) {
            return (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Label style={{ marginLeft: 10, color: "white" }} >Nobody Buy!</Label>
                    <br />
                    <Button onClick={() => { setprice("0"); handleRecall(); }} style={{ marginLeft: 10 }} color="primary">ReCall</Button>
                </div>
            )
        }
        if (checkStatus === 4) {
            return (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Label style={{ marginLeft: 10, color: "white" }} >{shortenAddress(product.addressOwner)} have purchased</Label>
                    <br />
                    <Button onClick={ handleTakeAgainEthereum} style={{ marginLeft: 10 }} color="primary">Take again Ethereum</Button>
                </div>
            )
        }

        if (checkStatus === 5) {
            return (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Label style={{ marginLeft: 10, color: "white" }} >The Auction has started! </Label>
                </div>
            )
        }
        if (checkStatus === 6) {
            return (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Label style={{ marginLeft: 10, color: "white" }} >You have taken Ethereum! </Label>
                </div>
            )
        }

        return (
            <>
                <div className="nft-info"  >
                    <span className="label" style={{ color: "GrayText" }}>Amount:</span>
                    <Input className="value" type="text" id='name' name="name" style={{ marginTop: -30, marginLeft: "70%", border: '2px solid GrayText', borderRadius: 8, width: "30%", fontWeight: "bold" }} color="black" value={amountAuction} onChange={(e) => { handleChangeAuction(e) }} required />
                    {/* <CIcon icon={icon. cibEthereum} className="text-info" style={{ width: 18,marginRight:-50 }} /> */}
                </div>
                {isStatus ? <Button style={{ color: "grey" }}>Time Out</Button> : <Button onClick={handleBuyNFT} color="primary">Put Bid</Button>}
            </>
        )
    }

    return (
        <div style={{ backgroundColor: "black", height: window.innerHeight, opacity: loading ? 0.5 : 1, pointerEvents: loading ? 'none' : 'auto' }}>
            <DetailProductNav title={titleAndTo.titleNav} to={titleAndTo.toNav} />
            <div className="wrapper"   >
                <Card style={{ marginTop: 100, backgroundColor: "#1e1e1e" }}>
                    {loading && (
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", transform: "translate(0%, 150%)", zIndex: 2, position: "relative" }}>
                            <Label style={{ fontSize: 30, fontWeight: "bold", color: "#00FFFF" }}>Please! Not refresh in the process!</Label>
                            <SwishSpinner size={80} frontColor="#00FFFF" backColor="black" loading={loading} />
                        </div>
                    )}
                    <Row style={{ marginLeft: "25%", marginTop: "3%" }}>
                        <div className="nft-details-container">
                            <Col sm="12" md="4">
                                <div className="nft-image" style={{ height: "360px", width: "1024px", marginTop: 10 }}>
                                    <img src={product.logo} alt={product.name} style={{ borderRadius: 32, width: "100%", height: "100%", objectFit: "cover" }} />
                                </div>
                            </Col>
                            <Col sm="12" md="4">
                                <div className="nft-info" >
                                    <span className="label" style={{ color: "GrayText", fontSize: 12, marginLeft: 5 }}>Author:</span>
                                    <span className="value">
                                        <img src={product.logo} alt="Author" className="author-image" />
                                        <span style={{ fontSize: 12 }}>{shortenAddress(product.addressCreateBy)}</span>
                                    </span>
                                    <h4 style={{ marginTop: -5 }} >Sản phẩm #1e1e1e</h4>
                                    <div className="info-row" style={{ borderBottom: "1px solid gray" }}>
                                        <span className="label" style={{ color: "GrayText" }}>Owner:</span>
                                        <span className="value">
                                            <img src={product.logo} alt="Author" className="author-image" />
                                            {shortenAddress(InfoProduct.addressOwner)}
                                        </span>
                                    </div>
                                    <div className="info-row" style={{ borderBottom: "1px solid gray" }}>
                                        <span className="label" style={{ color: "GrayText" }}>Date Create:</span>
                                        <span className="value">{fotmatTime(product.createAt)}</span>
                                    </div>
                                    <div className="info-row" style={{ borderBottom: "1px solid gray" }}>
                                        <span className="label" style={{ color: "GrayText" }}>Copyright fee:</span>
                                        <span className="value">10 %</span>
                                    </div>
                                    <div className="info-row" style={{ borderBottom: "1px solid gray" }}>
                                        <span className="label" style={{ color: "GrayText" }}>Price init:</span>
                                        <span className="value">{priceUploaded} <CIcon icon={icon.cibEthereum} className="text-info" style={{ width: 18 }} /></span>
                                    </div>
                                    <div className="info-row" style={{ borderBottom: "1px solid gray" }}>
                                        <span className="label" style={{ color: "GrayText" }}>Step price:</span>
                                        <span className="value">{product.StepPrice} <CIcon icon={icon.cibEthereum} className="text-info" style={{ width: 18 }} /></span>
                                    </div>
                                    <div className="info-row" >
                                        <span className="label" style={{ color: "GrayText" }}>Total Price:</span>
                                        <span className="value">{Number(priceUploaded) + Number(highestBidAuction)}</span>
                                    </div>
                                    <div className="info-row" >
                                        <span className="label" style={{ color: "GrayText" }}>Time in Auction:</span>
                                        <AuctionCountdown timeEnd={timeEnd} Info={product} />
                                    </div>
                                    {isOpen ? (
                                        <>
                                            <div className="info-row" >
                                                <span className="label" style={{ color: "GrayText" }}>Time In Sell:</span>
                                                <span className="value">Now</span>
                                            </div>
                                            <div className="info-row" >
                                                <span className="label" style={{ color: "GrayText" }}>Price:</span>
                                                <Input className="value" type="text" id='name' name="name" style={{ marginLeft: "50%", border: '2px solid GrayText', borderRadius: 8, width: "30%", fontWeight: "bold" }} color="black" value={price} onChange={(e) => { handleChange(e) }} required />
                                                <CIcon icon={icon.cibEthereum} className="text-info" style={{ width: 18 }} />
                                            </div>
                                        </>
                                    ) : null}
                                    {isOpen ?
                                        (
                                            <div>
                                                {/* <Button onClick={handleUpdatePriceNFT} style={{ backgroundColor: "green" }}>Confirm Sell</Button> */}
                                                <Button onClick={handleIsOpen} style={{ marginLeft: 10, backgroundColor: "red" }}>Close</Button>
                                            </div>
                                        ) : (
                                            <Statuscurrent />
                                        )}
                                </div>
                            </Col>
                        </div>
                    </Row>
                    <div className="nft-description" style={{ marginLeft: "5%", marginRight: "15%" }} >
                        <Row style={{ marginLeft: "25%" }}>
                            <div className="nft-details-container">
                                <Col sm="18" md="10">
                                    <h3 className="label" style={{ color: "GrayText" }}>Mô tả về sản phẩm</h3>
                                    <p className="label" style={{ color: "white", fontSize: 14, fontFamily: "-moz-initial" }}>{product.description}</p>
                                </Col>
                                <Col sm="18" md="8" style={{ marginLeft: "-12%" }}>
                                    <h3 className="label" style={{ color: "GrayText", fontSize: 20 }}>History Put Bid</h3>
                                    <span className="value">
                                        Address
                                    </span>
                                    <span className="label" style={{ color: "white", marginLeft: "35%" }}>Amount Put Bid</span>
                                    {BidderHistory.filter(item => item.auctionId === product.AuctionID).map((item) => (
                                        <div key={item.auctionId} className="nft-info" style={{ borderBottom: "1px solid gray" }}>
                                            <img src={product.logo} alt="Author" className="author-image" />
                                            <span className="value">{shortenAddress(item.address)}</span>
                                            <span className="label" style={{ color: "GrayText", marginLeft: "25%" }}>
                                                {item.amount} {/* Hiển thị giá trị đấu giá */}
                                                <CIcon icon={icon.cibEthereum} className="text-info" style={{ width: 18, marginLeft: '5px' }} />
                                            </span>
                                        </div>
                                    ))}
                                </Col>

                            </div>
                        </Row>
                    </div>
                </Card >
            </div>
            <DefaultFooter />
        </div>

    );
};

export default ProductViewAuction;
