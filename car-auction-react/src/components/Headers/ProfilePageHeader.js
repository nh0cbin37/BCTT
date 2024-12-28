import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

// reactstrap components
import { Container } from "reactstrap";

// core components
const imageUser = require("assets/images/ryan.jpg");
const backgroundImage = require("assets/images/bg5.jpg")

function ProfilePageHeader() {
  const pageHeader = React.createRef();
  const inforUser = useSelector((state) => state.dataKit.infoUser);
  const allProducts = useSelector((state) => state.dataKit.allProducts);
  const [countMyNFT, setcountMyNFT] = useState(0);
  const shortenAddress = (address) => {
    if (!address) return ""; // Xử lý trường hợp address là null hoặc undefined
    const start = address.slice(0, 6);
    const end = address.slice(-5);
    return `${start}...${end}`;
  }
  React.useEffect(() => {
    if (window.innerWidth > 991) {
      const updateScroll = () => {
        const windowScrollTop = window.pageYOffset / 3;
        pageHeader.current.style.transform =
          `translate3d(0, ${windowScrollTop} px,0)`;
      };
      window.addEventListener("scroll", updateScroll);
      return function cleanup() {
        window.removeEventListener("scroll", updateScroll);
      }
    }
    return null;
  });
  useEffect(() => {
    let count = 0;
    allProducts.products.forEach(element => {
      if(element.addressOwnerBy === inforUser.walletAddress)
      {
        count+=1;
      }
    });
    setcountMyNFT(count);
  }, [allProducts])

  return (
    <>
      <div
        className="page-header clear-filter page-header-small"
        filter-color="blue"
      >
        <div
          className="page-header-image"
          style={{
            backgroundImage: `url('https://res.cloudinary.com/djit2fyvr/image/upload/v1733760567/backgound_vlr9c2.jpg')`
          }}
          ref={pageHeader}
        />
        <Container>
          <div className="photo-container">
            <img style={{ borderRadius: 80, width: 90, height: 90 }} alt="..." src="https://res.cloudinary.com/djit2fyvr/image/upload/v1733453387/ImageNFT/fi1ogbt9oh3migyuwdwq.jpg" />
          </div>
          <h3 className="title">{shortenAddress(inforUser.walletAddress)}</h3>
          <p className="category">My Wallet</p>
          <div className="content" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 50 }}>
            <div className="social-description" style={{ marginTop: 20 }}>
              <h2>{countMyNFT}</h2>
              <p>Photo NFT</p>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}

export default ProfilePageHeader;