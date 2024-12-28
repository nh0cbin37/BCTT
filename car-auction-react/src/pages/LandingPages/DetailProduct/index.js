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
import { Navigate, useLocation } from "react-router-dom";
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
import { useDispatch, useSelector } from "react-redux";
import alertReloadCustome from "components/Alert/alertReload";
// import DatePicker from "react-datepicker";
// import 'react-datepicker/dist/react-datepicker.css';
// import addMinutes from "date-fns/addMinutes";
import { fetchProducts } from "redux/redux";
import { ethers } from "ethers";
import { SwishSpinner } from "react-spinners-kit";
import moment, { duration } from "moment/moment";
import contract from '../../../contract/AINFTCollection.json'
// import contractAuction from '../../../contract/Auction.json'
// tai css
const ProductView = () => {
  const location = useLocation();
  const pageHeader = React.createRef();
  const initialDate = new Date();
  const format = "YYYY-MM-DD HH:mm";
  const timeOption = ['Hours', 'Minutes', 'Seconds'];
  const [selectedOptionTime, setselectedOptionTime] = useState('');
  const [loading, setloading] = useState(false);
  const [isOpen, setisOpen] = useState(false);
  const [isSetTypeSell, setisSetTypeSell] = useState(false)
  const [isOpenAuction, setisOpenAuction] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment());
  const [timestamp, setTimestamp] = useState(initialDate.getTime());
  const [durationAuction, setdurationAuction] = useState(0)
  const { infoProduct } = location.state || {};
  const [auctionId, setauctionId] = useState(-1);
  const [stepPrice, setstepPrice] = useState("0")
  const allProducts = useSelector((state) => state.dataKit.allProducts);
  const [dateUploaded, setdateUploaded] = useState(0);
  const [dateTimeDuration, setdateTimeDuration] = useState(0);
  const [stepPriceUpdate, setstepPriceUpdate] = useState("0")
  const product = infoProduct;
  if (!product) {
    return null;
  }
  const [priceProduct, setpriceProduct] = useState(product.price)
  const [price, setprice] = useState(product.price);
  const [priceUploaded, setpriceUploaded] = useState(product.price)
  const dispatch = useDispatch();
  const shortenAddress = (address) => {
    if (!address) return ""; // Xử lý trường hợp address là null hoặc undefined
    const start = address.slice(0, 6);
    const end = address.slice(-5);
    return `${start}...${end}`;
  }
  function formatDuration(milliseconds) {
    // if (typeof milliseconds !== 'number' || isNaN(milliseconds)) {
    //   return 'Invalid input'; // Handle non-numeric or NaN input
    // }

    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    let formattedDuration = '';

    if (minutes > 0) {
      formattedDuration += `${minutes} minutes`; // Use lowercase 'm' here
    }

    if (remainingSeconds > 0) {
      formattedDuration += `${remainingSeconds} seconds`;
    }

    return formattedDuration || '0s';
  }
  const titleAndTo = {
    titleNav: "BACK TO PROFILE",
    toNav: "/pages/landing-pages/profile",
    titleHeader: "My Detail Product"
  }
  // đang làm nút bấm set rice

  const handleIsOpen = () => {
    setisOpen(!isOpen);
    if (isOpenAuction) setisOpenAuction(false);
  }
  const handleIsOpenAuction = () => {
    setisOpenAuction(!isOpenAuction);
    if (isOpen) setisOpen(false);
  }
  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date) {
      setTimestamp(date.valueOf());
    } else {
      setTimestamp(null);
    }
  };
  const handleChangeAuction = (event) => {
    setdurationAuction(event.target.value);
  }
  const convertToMilliseconds = (time, unit) => {
    switch (unit) {
      case 'Hours':
        return time * 3600000;
      case 'Minutes':
        return time * 60000;
      case 'Seconds':
        return time * 1000;
      default:
        return "Đơn vị không hợp lệ. Vui lòng sử dụng 'hours', 'minutes' hoặc 'seconds'.";
    }
  }
  const handleChangeOptionTime = (event) => {
    setselectedOptionTime(event.target.value);
  };
  const handleChange = (event) => {
    const input = event.target.value;

    // Chỉ cho phép nhập số
    const numericValue = input.replace(/[^0-9.]/g, '');
    const value = numericValue.replace(/^0+/, '');
    // Nếu giá trị rỗng sau khi loại bỏ ký tự không phải số, đặt lại về '0'
    setprice(value);
  }

  const handleChangeStepPrice = (event) => {
    const input = event.target.value;

    // Chỉ cho phép nhập số
    const numericValue = input.replace(/[^0-9.]/g, '');
    const value = numericValue.replace(/^0+/, '');
    // Nếu giá trị rỗng sau khi loại bỏ ký tự không phải số, đặt lại về '0'
    setstepPrice(value);
  }


  const etherToWei = (etherValue) => {
    const result = BigInt(Math.floor(etherValue * 10 ** 18));
    return result;
  }
  const handleReload = () => {
    window.location.reload(true);
  }
  useEffect(() => {
  const filterDate = allProducts.products.filter(item => item.id === product.id);
    if(filterDate[0].price > 0)
    {
      setisSetTypeSell(true);
    setisOpen(false);
    setisOpenAuction(false);
    setdateUploaded(filterDate[0].sellAt);
    setdateTimeDuration(filterDate[0].TimeAuction)
    setstepPriceUpdate(filterDate[0].StepPrice)
    setisSetTypeSell(true);
    }
  }, [product,allProducts.products])

  async function handleUpdatePriceNFT() {
    const CONTRACTADDRESS = "0x3498819a4751ceB62EdEE1cE3DCbC88e20D6c7bb";
    const contractABI = contract.abi;
    // const privateKey = addressWallet;

    try {
      setloading(true);
      if (product.nftTokenId !== "" && price !== "0") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contracts = new ethers.Contract(CONTRACTADDRESS, contractABI, signer);
        const tx = await contracts.setPrice(product.nftTokenId, etherToWei(price));
        await tx.wait();
        const currentTime = new Date();
        try {
          const dataUpdateProduct = {
            updateAt: currentTime.getTime(),
            price,
            sellAt: currentTime.getTime(),
            status: 0
          }
          const response = await axios.patch(`http://localhost:3000/product/${product.id}`, dataUpdateProduct);

          if (response) {

            // alertReloadCustome({ titles: "Update Price Succerfully!",handleReload });
            alertCustome("Update Price Succerfully!");
            setpriceUploaded(price);

            dispatch(fetchProducts({}));
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
  async function handleAuctionNFT() {
    const CONTRACTADDRESS = "0x3498819a4751ceB62EdEE1cE3DCbC88e20D6c7bb";
    // const CONTRACTADDRESSAuction = "0x56F70F122ff8b1149Be3F0E8260522AAfdf574BB";
    const contractABI = contract.abi;
    // const contractAuctionABI = contractAuction.abi;
    // const privateKey = addressWallet;

    try {
      setloading(true);
      if (product.nftTokenId !== "" && price !== "0" && stepPrice !== "0") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contracts = new ethers.Contract(CONTRACTADDRESS, contractABI, signer);
        const tx = await contracts.setPrice(product.nftTokenId, etherToWei(price));
        await tx.wait();
        // const smContractAuction = new ethers.Contract(CONTRACTADDRESS, contractABI, signer);
        const txAuction = await contracts.createAuction();
        await txAuction.wait();
        const counter = await contracts.auctionCounter();

        // smContractAuction.on('AuctionCreated', async (resultAuctionId) => {
        //   console.log(resultAuctionId);
        //   setauctionId(resultAuctionId);
        // });
        // const filter = smContractAuction.filters.AuctionCreated();
        // const txAuction = await smContractAuction.createAuction(product.nftTokenId, etherToWei(price));

        // // lấy log lọc dữ liệu
        // const logs = await smContractAuction.queryFilter(filter, tx.blockNumber, tx.blockNumber);
        // if (logs.length > 0) {
        //   const resultAuctionId = logs[0].args.auctionId.toNumber();
        //   setauctionId(resultAuctionId);
        // } else {
        //   console.error("AuctionCreated event not found.");
        // }
        const currentTime = new Date();
        try {
          const dataUpdateProduct = {
            updateAt: currentTime.getTime(),
            price,
            sellAt: timestamp,
            status: 0,
            AuctionID: counter.toNumber(),
            TimeAuction: convertToMilliseconds(durationAuction, selectedOptionTime),
            StepPrice: stepPrice
          }
          const response = await axios.patch(`http://localhost:3000/product/${product.id}`, dataUpdateProduct);

          if (response) {
            // setisOpen(false);
            // setdateUploaded(currentTime.getTime());
            alertCustome("Set Auction Succerfully!");
            dispatch(fetchProducts({}));
            // setpriceUploaded(price);
            // setisOpenAuction(false);
            // setisSetTypeSell(true);
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
      console.log(error);
      alertWrong("Update Price Failed!");
      throw new Error('Lỗi mint NFT');
    } finally {
      setloading(false);
    }
  }
  // const handleUpdatePrice = async () => {
  //   const currentTime = new Date();
  //   if (price !== "" || price !== "0") {
  //     const dataUpdateProduct = {
  //       updateAt: currentTime.getTime(),
  //       price,
  //       sellAt: currentTime.getTime()
  //     }
  //     try {
  //       const response = await axios.patch(`http://localhost:3000/product/${product.id}`, dataUpdateProduct);
  //       if (response) {
  //         const infoProps = {
  //           id: product.id,
  //           name: product.name,
  //           logo: product.logo,
  //           price: product.price,
  //           description: product.description,
  //           createAt: product.createAt,
  //           addressOwner: product.addressOwnerBy,
  //           addressCreatBy: product.addressCreateBy,
  //           sellAt: product.sellAt,
  //           nftTokenId: product.nftTokenId
  //         }
  //         // alertReloadCustome({ titles: "Update Price Succerfully!", Info: infoProps });
  //         alertCustome("Update Price Succerfully!");
  //         setpriceProduct(price);
  //         setprice("0");
  //       }
  //       else {
  //         alertWrong("Update Price Failed!");
  //       }
  //     } catch (error) {
  //       console.log(error)
  //       alertWrong("Update Price Failed!");
  //     }

  //   } else {
  //     alertWrong("Please! Enter Price For Your NFT.")
  //   }

  // }

  return (
    <div style={{ backgroundColor: "black", height: window.innerHeight, opacity: loading ? 0.5 : 1, pointerEvents: loading ? 'none' : 'auto' }}>
      <DetailProductNav title={titleAndTo.titleNav} to={titleAndTo.toNav} />
      <div className="wrapper" >
        <Card style={{ marginTop: 100, backgroundColor: "#1e1e1e" }}>
          {loading && (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", transform: "translate(0%, 150%)", zIndex: 2, position: "relative" }}>
              <Label style={{ fontSize: 30, fontWeight: "bold", color: "#00FFFF" }}>Please! Not refresh in the process!</Label>
              <SwishSpinner size={80} frontColor="#00FFFF" backColor="black" loading={loading} />
            </div>
          )}
          {/* <Row>
          <Col sm="12" md="4" style={{ justifyContent: "center", alignproducts: "center", display: "flex" }}>
            <div style={{ height: '100%', width: '100%', objectFit: "cover", padding: 10 }}>
              <img
                src={product.logo}
                alt="Preview"
                style={{ height: '100%', width: '100%', objectFit: "cover" }}
              />
            </div>
          </Col>
          <Col sm="12" md="4">
            <CardBody>
              <CardTitle><span style={{ fontWeight: "bold" }}>Name: </span>{product.name}</CardTitle>
              <CardText><span style={{ fontWeight: "bold" }}>Description: </span>{product.description}</CardText>
              <CardText><span style={{ fontWeight: "bold" }}>Create At: </span>{product.createAt}</CardText>
              <CardText><span style={{ fontWeight: "bold" }}>Create By: </span>{shortenAddress(product.addressCreateBy)}</CardText>
              <CardSubtitle>
                <strong>Price: £{product.price}</strong>
              </CardSubtitle>
              <Button color="primary">Update Price</Button>
              <Button color="primary" style={{ marginLeft: 15 }}>Set Price</Button>
              <Button color="primary" style={{ marginLeft: 15 }}>Auction</Button>
            </CardBody>
          </Col>

          <Col sm="12" md="4" style={{ marginTop: 0, zIndex: 1, borderLeft: "1px solid gray" }} >
            <div style={{ marginRight: "20%" }}>
              <h5 style={{ textAlign: "center", fontFamily: "sans-serif", fontWeight: "bold" }}>Set Price NFT</h5>
              <Form onSubmit={handleSubmit} style={{ marginLeft: "20%" }}>
                <FormGroup style={{ borderBottom: "1px solid GrayText" }}>
                  <Label htmlFor="name" style={{ fontFamily: "sans-serif", fontWeight: "bold",fontSize:20 }} placeholder='Please! Enter Your Name NFT...'>
                    Thời gian xuất hiện:</Label>
                  <Label htmlFor="name" style={{ fontFamily: "sans-serif", fontStyle:"italic",fontSize:15 }} placeholder='Please! Enter Your Name NFT...'>
                    Ngay bây giờ</Label>
                </FormGroup>
                <FormGroup >
                  <Label htmlFor="description" style={{ fontFamily: "sans-serif", fontWeight: "bold" }}>
                    Description:</Label>
                  {loading ? (<Input type="text" id='name' name="name" style={{ border: '2px solid GrayText', borderRadius: 32, width: "70%" }} value={price} onChange={(e) => setprice(e)} required disabled typeof="number" />)
                    : (<Input type="text" id='name' name="name" style={{ border: '2px solid GrayText', borderRadius: 8, width: "70%" }} value={price} onChange={(e) => setprice(e)} required typeof="number" />)}

                </FormGroup>
                {loading ? (<Button type="submit" style={{ fontFamily: "sans-serif", backgroundColor: "GrayText" }} disabled>Create Product</Button>)
                  : (<Button type="submit" style={{ fontFamily: "sans-serif", backgroundColor: "green" }}>Confirm</Button>)}

              </Form>
            </div>
          </Col>
        </Row> */}
          <Row style={{ marginLeft: "25%", marginTop: "3%", zIndex: 1 }}>
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
                      {shortenAddress(product.addressOwnerBy)}
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
                  {(isSetTypeSell && dateTimeDuration > 0) || (Number(product.price) > 0 && dateTimeDuration > 0) ?
                    (<>
                      <div className="info-row" >
                        <span className="label" style={{ color: "GrayText" }}>Type Sell:</span>
                        <span className="value">{dateTimeDuration > 0 ? "Auction" : "Sell"}</span>
                      </div>
                      <div className="info-row" >
                        <span className="label" style={{ color: "GrayText" }}>Sell At:</span>
                        <span className="value">{fotmatTime(dateUploaded)}</span>
                      </div>
                      <div className="info-row" >
                        <span className="label" style={{ color: "GrayText" }}>Duration:</span>
                        <span className="value">{formatDuration(dateTimeDuration)}</span>
                      </div>
                      <div className="info-row" >
                        <span className="label" style={{ color: "GrayText" }}>Step Price:</span>
                        <span className="value">{stepPriceUpdate}</span>
                      </div>
                      
                    </>) : null}
                  {(isSetTypeSell && dateTimeDuration === 0) || (Number(product.price) > 0 && dateTimeDuration === 0) ?
                    (<>
                      <div className="info-row" >
                        <span className="label" style={{ color: "GrayText" }}>Type Sell:</span>
                        <span className="value">{dateTimeDuration > 0 ? "Auction" : "Sell"}</span>
                      </div>
                      <div className="info-row" >
                        <span className="label" style={{ color: "GrayText" }}>Sell At:</span>
                        <span className="value">{fotmatTime(dateUploaded)}</span>
                      </div>
                    </>) : null}

                  {isOpen && !isSetTypeSell ? (
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
                  {isOpenAuction && !isSetTypeSell ? (
                    <>
                      <div className="info-row" >
                        <span className="label" style={{ color: "GrayText", fontSize: 16 }}>DateTime:</span>
                        <Input
                          style={{ height: "50%", width: "60%", border: '2px solid GrayText', borderRadius: 8 }}
                          type="datetime-local"
                          value={selectedDate.format(format)} // Hiển thị ngày giờ đã chọn
                          onChange={(e) => {
                            const newDate = moment(e.target.value);
                            if (newDate.isValid()) { // Kiểm tra xem ngày giờ hợp lệ không
                              handleDateChange(newDate);
                            }
                          }}
                        />
                      </div>
                      <div className="info-row" >
                        <span className="label" style={{ color: "GrayText", fontSize: 16 }}>Duration:</span>
                        <Input className="value" type="text" id='name' name="name" style={{ marginLeft: "50.5%", border: '2px solid GrayText', borderRadius: 8, width: "60%", fontWeight: "bold" }} color="black" value={durationAuction} onChange={(e) => { handleChangeAuction(e) }} required />
                        <select style={{ marginLeft: 5, fontSize: 12, border: '2px solid GrayText', borderRadius: 8, fontWeight: "bold" }} id="city" value={selectedOptionTime} onChange={handleChangeOptionTime}>
                          {timeOption.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>

                      </div>
                      <div className="info-row" >
                        <span className="label" style={{ color: "GrayText", fontSize: 16 }}>Price Init:</span>
                        <Input className="value" type="text" id='name' name="name" style={{ marginLeft: "49%", border: '2px solid GrayText', borderRadius: 8, width: "30%", fontWeight: "bold" }} color="black" value={price} onChange={(e) => { handleChange(e) }} required />
                        <CIcon icon={icon.cibEthereum} className="text-info" style={{ width: 18 }} />
                      </div>
                      <div className="info-row" >
                        <span className="label" style={{ color: "GrayText", fontSize: 16 }}>Step:</span>
                        <Input className="value" type="text" id='name' name="name" style={{ marginLeft: "56%", border: '2px solid GrayText', borderRadius: 8, width: "30%", fontWeight: "bold" }} color="black" value={stepPrice} onChange={(e) => { handleChangeStepPrice(e) }} required />
                        <CIcon icon={icon.cibEthereum} className="text-info" style={{ width: 18 }} />
                      </div>
                    </>
                  ) : null}
                  {isOpen && !isSetTypeSell ?
                    (
                      <Button onClick={handleUpdatePriceNFT} style={{ backgroundColor: "green" }}>Confirm Sell</Button>
                    ) :null}
                    {!isOpen && !isSetTypeSell ?(
                      <Button onClick={handleIsOpen} color="primary">Sell</Button>
                    ):null}
                  {isOpenAuction && !isSetTypeSell ?
                    (
                      <Button onClick={handleAuctionNFT} style={{ backgroundColor: "green", marginLeft: 10 }}>Confirm Auction</Button>
                    ) :null}
                    {!isOpenAuction && !isSetTypeSell ?
                    (
                      <Button onClick={handleIsOpenAuction} style={{ marginLeft: 10 }} color="primary">Auction</Button>
                    ):null}
                  {isOpen || isOpenAuction ? <Button onClick={isOpenAuction ? handleIsOpenAuction : handleIsOpen} style={{ marginLeft: 10, backgroundColor: "red" }}>Close</Button> : null}
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
      <DefaultFooter content={footerRoutes} />
    </div>
  );
};

export default ProductView;
