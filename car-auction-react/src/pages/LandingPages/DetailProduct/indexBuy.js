import React, { useEffect, useState } from "react";
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
import { fetchProducts, setInitBuy, Buy } from "redux/redux";
import { SwishSpinner } from "react-spinners-kit";
import contract from '../../../contract/AINFTCollection.json'


// tai css
const ProductViewBuy = () => {
  const location = useLocation();
  const pageHeader = React.createRef();
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setisOpen] = useState(false);
  const [checkStatus, setcheckStatus] = useState(0)
  const [historyData, setHistoryData] = useState({

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
    typeHistory: 0,
    // Hoặc new Date() nếu cần
  });

  const { infoProduct } = location.state || {};
  const product = infoProduct;
  if (!product) {
    return null;
  }
  const [price, setprice] = useState(product.price)
  const [priceUploaded, setpriceUploaded] = useState(product.price)
  const InforUser = useSelector((state) => state.dataKit.infoUser);
  const InfoProduct = useSelector((state) => state.dataKit.buyAuction);
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
  // console.log(product);
  const titleAndTo = {
    titleNav: "BACK TO AUCTION",
    toNav: "/",
    titleHeader: "My Detail Product"
  }

  const handleStatus = () => {
    // console.log(`${InfoProduct.addressOwner} ${InfoProduct.addressCreateBy} ${InfoProduct.status}`)
    // if ((InfoProduct.addressOwner === InforUser.walletAddress && InfoProduct.status === 0)) {
    //   setcheckStatus(-1);
    // }
    // else if ((InfoProduct.addressOwner === InforUser.walletAddress &&
    //   InfoProduct.addressCreateBy !== InforUser.walletAddress && InfoProduct.status === 1)) {
    //   setcheckStatus(1);
    // }
    // else if ((InfoProduct.addressOwner !== InforUser.walletAddress &&
    //   InfoProduct.addressCreateBy === InforUser.walletAddress && InfoProduct.status === 1)) {
    //   setcheckStatus(2);
    // } else if ((InfoProduct.addressOwner === InforUser.walletAddress &&
    //   InfoProduct.addressCreateBy === InforUser.walletAddress && InfoProduct.status === 1)) {
    //   setcheckStatus(3);
    // }
    // else { setcheckStatus(0); }
    // if ((InfoProduct.addressOwner === InforUser.walletAddress && InfoProduct.status === 0)) {
    //   setcheckStatus(-1);
    // }
    // else if ((product.Seller !== product.Buyer && product.Buyer === InforUser.walletAddress && InfoProduct.status === 1)) {
    //   setcheckStatus(1);
    // }
    // else if ((product.Seller !== product.Buyer && product.Seller === InforUser.walletAddress && InfoProduct.status === 1)) {
    //   setcheckStatus(2);
    // } else if (( product.Seller !== InforUser.walletAddress && product.Buyer !== InforUser.walletAddress  && InfoProduct.status === 1)) {
    //   setcheckStatus(3);
    // }
    // else { setcheckStatus(0); }
    if((product.addressOwner === InforUser.walletAddress && InfoProduct.status === 0 )){
      setcheckStatus(-1);
    }
   else if ((product.Seller !== product.Buyer && product.Buyer === InforUser.walletAddress && InfoProduct.status === 1)) {
      setcheckStatus(1);
    }
    else if ((product.Seller !== product.Buyer && product.Seller === InforUser.walletAddress && InfoProduct.status === 1)) {
      setcheckStatus(2);
    }
    else if (( product.Seller !== InforUser.walletAddress && product.Buyer !== InforUser.walletAddress && InfoProduct.status === 1)) {
      setcheckStatus(3);
    }
    else { setcheckStatus(0); }
  }
  useEffect(async () => {
    console.log("Ac")
    const InfoProductInit = {
      addressOwner: product.addressOwner,
      addressCreateBy: product.addressCreateBy,
      status: product.status,
    };
    await dispatch(setInitBuy({ value: InfoProductInit }));
  }, [product]); // Mảng phụ thuộc bao gồm dispatch và product

  useEffect(() => {
    if (InfoProduct.addressOwner) { // Kiểm tra xem dữ liệu đã có sẵn chưa
      handleStatus();
    }
  }, [InfoProduct]);
  const handleChange = (event) => {
    const input = event.target.value;

    // Chỉ cho phép nhập số
    const numericValue = input.replace(/[^0-9.]/g, '');
    const value = numericValue.replace(/^0+/, '');
    // Nếu giá trị rỗng sau khi loại bỏ ký tự không phải số, đặt lại về '0'
    setprice(value);
  }
  const handleIsOpen = () => {
    setisOpen(!isOpen);
  }

  const handlePostHistory = async (logo, BuyAt, Buyer, IDProduct, Price, Seller, BuyEndAt) => {
    // activity.preventDefault();
    // setLoading(true);
    try {
      try {
        const dataHistoryNew = {
          ...historyData,
          IDProduct,
          logo,
          BuyAt,
          Buyer,
          Price,
          Seller,
          BuyEndAt
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
          typeHistory: 0,

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
  async function handleBuyNFT() {
    const CONTRACTADDRESS = "0x3498819a4751ceB62EdEE1cE3DCbC88e20D6c7bb";
    const contractABI = contract.abi;

    try {
      setloading(true);
      if (product.nftTokenId !== "" && product.price !== "0") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contracts = new ethers.Contract(CONTRACTADDRESS, contractABI, signer);
        const priceOfNFT = await contracts.getPrice(product.nftTokenId);
        const tx = await contracts.buyNFT(product.nftTokenId, {
          value: priceOfNFT
        });
        await tx.wait();
        const currentTime = new Date();
        try {
          await handlePostHistory(product.logo, currentTime.getTime(), InforUser.walletAddress, product.id, product.price, product.addressOwner, currentTime.getTime);
          const dataUpdateProduct = {
            updateAt: currentTime.getTime(),
            price: "0",
            sellAt: 0,
            status: 1,
            addressOwnerBy: InforUser.walletAddress
          }
          const response = await axios.patch(`http://localhost:3000/product/${product.id}`, dataUpdateProduct);
          if (response) {
            alertCustome("Buy NFT Succerfully!");
            dispatch(fetchProducts({}));
            setprice("0");
            const InfoProductInit = {
              addressOwner: InforUser.walletAddress,
              status: 1,
            };
            dispatch(Buy({ value: InfoProductInit }));
          }
          else {
            alertWrong("Update Price Failed!");
          }
        } catch (error) {
          console.log(error);
          alertWrong("Server Error!");
        }
        return { txHash: tx.hash };
      }
      alertWrong("Please! Check Price or Info of NFT!");
      return null;
    } catch (error) {
      console.log(error);
      throw new Error('Lỗi mint NFT');
    } finally {
      setloading(false);
    }
  }
  async function handleUpdatePriceNFT() {
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
        const tx = await contracts.setPrice(product.nftTokenId, etherToWei(price));
        await tx.wait();
        const currentTime = new Date();
        try {
          const dataUpdateProduct =
          {
            updateAt: currentTime.getTime(),
            price,
            sellAt: currentTime.getTime(),
            status: 0
          }

          const response = await axios.patch(`http://localhost:3000/product/${product.id}`, dataUpdateProduct);

          if (response) {
            setisOpen(false);
            // alertReloadCustome({ titles: "Update Price Succerfully!",handleReload });
            alertCustome("Update Price Succerfully!");
            dispatch(fetchProducts({}));
            setpriceUploaded(price);
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
      return null;
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
  function Statuscurrent() {
    const currentTime = new Date();
    console.log(checkStatus);
    if (checkStatus === -1) {
      return (
        <>
        <Button onClick={handleRecall} style={{ marginLeft: 10 }} color="primary">Recall</Button>
        <Button onClick={handleIsOpen} style={{ marginLeft: 10 }} color="primary">Update Price</Button>
        </>
      )
    }
    if (checkStatus === 1) {
      return (<Label style={{ color: "white", fontWeight: "bold" }} >You have purchased!</Label>)
    }

    if (checkStatus === 0) {
      return (<Button onClick={handleBuyNFT} style={{ marginLeft: 10 }} color="primary">Buy</Button>)
    }
    if(checkStatus === 3 || checkStatus === 2)
    {
      return (<>
        <Label style={{ marginLeft: 10, color: "white" }} >{shortenAddress(product.addressOwner)} đã mua</Label>
        <br />
        {console.log(product.BuyEndAt)}
        <Label style={{ marginLeft: 10, color: "white" }} >Vào lúc {product.BuyEndAt !== undefined ?fotmatTime(product.BuyEndAt):fotmatTime(currentTime.getTime)}</Label>
      </>
      )
    }
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
                    <span className="label" style={{ color: "GrayText" }}>Price:</span>
                    <span className="value">{priceUploaded} <CIcon icon={icon.cibEthereum} className="text-info" style={{ width: 18 }} /></span>
                  </div>
                  <div className="info-row" >
                    <span className="label" style={{ color: "GrayText" }}>Total NFT:</span>
                    <span className="value">1 NFT</span>
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
                        <Button onClick={handleUpdatePriceNFT} style={{ backgroundColor: "green" }}>Confirm Sell</Button>
                        <Button style={{ marginLeft: 10 }} color="primary">Auction</Button>
                        <Button onClick={handleIsOpen} style={{ marginLeft: 10, backgroundColor: "red" }}>Close</Button>
                      </div>
                    ) : (
                      <Statuscurrent />
                    )}
                </div>
              </Col>
            </div>
          </Row>
          <div className="nft-description" style={{ marginLeft: "26%", marginRight: "25%" }} >
            <h3 className="label" style={{ color: "GrayText" }}>Mô tả về sản phẩm</h3>
            <p className="label" style={{ color: "white", fontSize: 14, fontFamily: "-moz-initial" }}>{product.description}</p>
          </div>
        </Card >
      </div>
      <DefaultFooter />
    </div>

  );
};

export default ProductViewBuy;
