import { useEffect, useRef, useState } from 'react'
import '../../assets/css/loginForm.css'
import Popup from 'reactjs-popup';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import NFT from 'components/NFT/nft';
import { upCountNFTProduct, fetchProducts } from 'redux/redux';
// import { ProductService } from '../../../backend/src/product/product.service';
import PropTypes from 'prop-types'
import { Button, Card, CardImg, Col, Row, Input, FormGroup, Label, Form, Text } from 'reactstrap'
import alertCustome from 'components/Alert/alert';
import alertWrong from 'components/Alert/alertwrong';
import "../../assets/css/style.css"
import "../../assets/css/loading.css"
import { SwishSpinner } from 'react-spinners-kit';

function CreateProduct({ handleSetCountNFT }) {
  CreateProduct.propTypes = {
    handleSetCountNFT: PropTypes.func.isRequired, // handleSetCountNFT phải là một hàm và bắt buộc
  };
  // làm bán và mua và sau đó làm cái đấu giá
  const [isOpen, setIsOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [url, setUrl] = useState('');
  const InforUser = useSelector((state) => state.dataKit.infoUser);
  const [loading, setLoading] = useState(false)
  const countNFTProduct = useSelector((state) => state.dataKit.countNFTProduct.count);
  const [similarityResult, setSimilarityResult] = useState(null);
  const [allImgCloud, setallImgCloud] = useState([]);
  const dispatch = useDispatch();
  let tokenIdCountinue = 0;

  const handleCallApiCloudiary = async () => {
    try {
      const imgUploaded = await axios.get('http://localhost:3000/cloudinary/ImageNFT');
      const allImgCloudUploaded = imgUploaded.data;
      setallImgCloud(allImgCloudUploaded);
      console.log(imgUploaded.data);
    } catch (error) {
      console.log(error);
      alertWrong("Error Server!")
    }
  }
  const apiUrl = 'http://localhost:3000/product/maxcount';
  useEffect(async () => {
    const handlGetMax = async () => {
      tokenIdCountinue = await axios.get(apiUrl);
      handleSetCountNFT(tokenIdCountinue.data);
      // console.log(tokenIdCountinue.data)
    }
    console.log("activeCount")
    handlGetMax();
    handleCallApiCloudiary();
  }, [])


  const currentTime = new Date();
  const options = {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric',
    hour12: false, // Sử dụng định dạng 24 giờ
  };

  const [preview, setPreview] = useState(null);
  const [productData, setProductData] = useState({
    name: '',
    logo: '',
    description: '',
    addressOwnerBy: InforUser.walletAddress,
    addressCreateBy: InforUser.walletAddress,
    addressDeleteBy: '',
    createAt: currentTime.getTime(),
    updateAt: currentTime.getTime(),
    isDelectedAt: false,
    deleteAt: null,
    nftTokenId: '',
    nftTransactionHash: '',
    nftImageUrl: '',
    price: "0",
    sellAt: 0,
    status: -1,
    TimeAuction: 0,
    AuctionID: -1,
    StepPrice: 0
    // Hoặc new Date() nếu cần
  });

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleChangeImage = (file) => {
    const MAX_WIDTH = 4000;
    const MAX_HEIGHT = MAX_WIDTH * 0.75;
    const MIN_WIDTH = 500;
    const MIN_HEIGHT = MIN_WIDTH * 0.75;
    // Lấy file đầu tiên từ input
    if (file) {
      const reader = new FileReader();
      reader.onload = (element) => {
        const img = new Image();
        img.src = element.target.result;
        img.onload = () => {
          const { width, height } = img;

          if (width < MIN_WIDTH || height < MIN_HEIGHT) {
            alertWrong(`Image size is too small. Please choose a photo with a lager size ${MIN_WIDTH}px x ${MIN_HEIGHT}px. (Current size: ${width}px x ${height}px)`);
            setImageSrc(null);
            return;
          }
          setPreview(reader.result);
          setImageSrc(img.src);
          setImage(file);
        };

        img.onerror = () => {
          alertWrong('This image could not be uploaded. Please try again with another file.');
          setImageSrc(null);
          setPreview(null)
          return null;
        };
      };

      reader.readAsDataURL(file);
    }
  }
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleChangeImage(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value,
    });
  };

  // const [isDuplicate, setisDuplicate] = useState(false);

  const handleAICompareImg = async (imgClound) => {

    const MSE_THRESHOLD = 100;
    const SSIM_THRESHOLD = 0.95;
    const formData = new FormData();
    formData.append('image1', image);
    formData.append('imageUrl', imgClound);
    try {

      const response = await axios.post('https://8b7c-34-19-54-230.ngrok-free.app/compare-images', formData);
      const compareIMG = response.data;
      if (compareIMG.MSE < MSE_THRESHOLD && compareIMG.SSIM > SSIM_THRESHOLD) {

        return true;
      }
      console.log(response.data);
    } catch (error) {
      console.error('Lỗi:', error);
      alert('Lỗi khi so sánh ảnh');
    }
    return false;
  }

  const isDuplicateRef = useRef(false);
  const handleSubmit = async (activity) => {
    activity.preventDefault();
    setLoading(true);
    if (!image) {
      alertWrong('Please upload an image.');
      return;
    }

    const results = await Promise.all(
      allImgCloud.map(async (item) => {
        try {
          return await handleAICompareImg(item.url);
        } catch (error) {
          console.log(error);
          return false; // Trả về false nếu có lỗi
        }
      })
    );

    // Kiểm tra kết quả và cập nhật isDuplicateRef
    isDuplicateRef.current = results.some((result) => result === true);

    console.log(isDuplicateRef.current);
    try {
      try {
        // await new Promise(resolve => setTimeout(resolve, 1000));
        if (!isDuplicateRef.current) {
          if (productData.name !== '' && productData.description !== '' && productData.addressCreateBy !== '') {
            // NFT Image
            const formData = new FormData();
            formData.append('file', image);
            const imgUploaded = await axios.post('http://localhost:3000/cloudinary/upload', formData);
            const dataChain = await NFT({ urlImg: imgUploaded.data.url, name: productData.name, description: productData.description, addressWallet: productData.addressCreateBy })
            // await new Promise(resolve => setTimeout(resolve, 500));
            // console.log(dataChain.tokenId);
            const dataProductNew = {
              ...productData,
              logo: dataChain.imageUrl,
              nftTokenId: countNFTProduct,
              nftTransactionHash: dataChain.txHash,
              nftImageUrl: dataChain.imageUrl,
            };
            try {
              // Handle the error appropriately, e.g., display an error message to the user.
              const response = await axios.post('http://localhost:3000/product', dataProductNew);
              // window.location.reload();
              alertCustome('Product and NFT created successfully!');
              handleCallApiCloudiary();
              dispatch(fetchProducts({}));
              setProductData({
                name: '',
                logo: '',
                description: '',
                addressOwnerBy: InforUser.walletAddress,
                addressCreateBy: InforUser.walletAddress,
                addressDeleteBy: '',
                createAt: currentTime.getTime(),
                updateAt: currentTime.getTime(),
                isDelectedAt: false,
                deleteAt: null,
                nftTokenId: '',
                nftTransactionHash: '',
                nftImageUrl: '',
                price: "0",

              })
              setImageSrc(null);
              setPreview(null);
              setImage(null);
            }
            catch (e) { console.log(e); alertWrong('Product and NFT created Failed'); }
          }
          // check tiếp server AI
        } else { alertWrong('Someone already owns this photo'); }
      } catch (error) {
        alertWrong("Upload NFT Wrong!")
      }
    } catch (error) {
      console.error('Lỗi khi gửi request:', error);
      alertWrong('Product and NFT created Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImg = () => {
    setImageSrc(null);
    setPreview(null);
  }
  return (
    <>
      <Button onClick={() => setIsOpen(!isOpen)} id="toggleForm"
        style={{ zIndex: 2, position: "relative", display: "flex", alignSelf: "center", marginLeft: "46.5%", marginTop: -96 }}
        className="btn-round" color="info" size="lg">
        +
      </Button>
      <Card className={`form-container ${isOpen ? 'open' : ''}`} style={{ backgroundColor: "#1e1e1e", boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.5)' }} >
        {loading && isOpen && (
          <div style={{ display: "flex", marginLeft: "48%", position: "absolute", top: "50%", transform: "translate(-50%, -50%)" }}>
            <SwishSpinner size={60} frontColor="#00FFFF" backColor="black" loading={loading} />
          </div>
        )}
        <Row style={loading ? { opacity: "50%", backgroundColor: "#1e1e1e" } : { backgroundColor: "#1e1e1e" }} >
          <Col sm="12" md="4">
            <div
              style={{
                marginLeft: '5%',
                border: '2px dashed #ccc',
                padding: '7px',
                textAlign: 'center',
                height: '85%', // Adjust height as needed
                width: '100%', // Adjust width as needed
              }}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {preview ? (
                <button type='button' style={{ height: '100%', width: '100%' }} onClick={handleDeleteImg} >
                  <img src={preview} alt="Preview" style={{ height: '100%', width: '100%', objectFit: "cover" }} />
                </button>
              ) : (
                <div style={{ marginTop: "30%" }}>
                  <p>Drag and drop media here</p>
                  <p>or</p>
                  <input type="file" onChange={(e) => { handleChangeImage(e.target.files[0]) }} style={{ display: 'block', marginLeft: "10%" }} accept="image/*" />
                </div>
              )}
            </div>
          </Col>
          <Col sm="12" md="8" >
            <div className="section" style={{ backgroundColor: "#1e1e1e" }}  >
              <h2 style={{ textAlign: "center", fontFamily: "sans-serif", fontWeight: "bold" }}>Create New NFT</h2>
              <Form onSubmit={handleSubmit} style={{ marginLeft: "20%" }}>
                <FormGroup>
                  <Label htmlFor="name" style={{ fontFamily: "sans-serif", fontWeight: "bold" }} placeholder='Please! Enter Your Name NFT...'>
                    Name Photo:</Label>
                  {loading ? (<Input type="text" id='name' name="name" style={{ border: '2px solid GrayText', borderRadius: 32, width: "70%" }} value={productData.name} onChange={handleChange} required disabled />)
                    : (<Input type="text" id='name' name="name" style={{ border: '2px solid GrayText', borderRadius: 8, width: "70%" }} value={productData.name} onChange={handleChange} required />)}
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="description" style={{ fontFamily: "sans-serif", fontWeight: "bold" }}>
                    Description:</Label>
                  <br />
                  {loading ? (<Input type="textarea" id='resizable-textarea' name="description" style={{ border: '2px solid GraưyText', borderRadius: 8 }} value={productData.description} onChange={handleChange} multiple required disabled />)
                    : (<Input type="textarea" id='resizable-textarea' name="description" style={{ height: 'auto', resize: 'none', border: '2px solid GrayText', borderRadius: 8 }} value={productData.description} onChange={handleChange} required multiple />)}
                </FormGroup>
                {loading ? (<Button type="submit" style={{ fontFamily: "sans-serif", backgroundColor: "GrayText" }} disabled>Create Product</Button>)
                  : (<Button type="submit" style={{ fontFamily: "sans-serif", backgroundColor: "green" }}>Create Product</Button>)}

              </Form>
              {loading ? (<Button type='button' style={{ fontFamily: "sans-serif", backgroundColor: "GrayText", marginLeft: "20%" }} onClick={() => setIsOpen(false)} disabled >Close</Button>) :
                (<Button type='button' style={{ fontFamily: "sans-serif", backgroundColor: "red", marginLeft: "20%" }} onClick={() => setIsOpen(false)} >Close</Button>)}
            </div>
          </Col>
        </Row>
      </Card >
    </>
  )

};


export default CreateProduct;