import PropTypes from "prop-types";
import React from "react";
import { useSelector } from "react-redux";

// reactstrap components
import { Container } from "reactstrap";

// core components
const imageUser = require("assets/images/ryan.jpg");
const backgroundImage = require("assets/images/bg5.jpg")

function DetailPageHeader({title}) {
  const pageHeader = React.createRef();
  const inforUser = useSelector((state) => state.dataKit.infoUser);
  const allProducts = useSelector((state) => state.dataKit.allProducts);
  const shortenAddress = (address) => {
    if (!address) return ""; // Xử lý trường hợp address là null hoặc undefined
    const start = address.slice(0, 6);
    const end = address.slice(-5);
    return `${start}...${end}`;
  }
  DetailPageHeader.propTypes ={
    title:PropTypes.string.isRequired
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
  return (
    <>
      <div
        className="page-header clear-filter page-header-small"
        filter-color="blue"
      >
        <div
          className="page-header-image"
          style={{
            backgroundImage: `url('https://res.cloudinary.com/djit2fyvr/image/upload/v1733505620/bg5_zvar7f.jpg')`
          }}
          ref={pageHeader}
        />
        <Container>
        <h3 className="title">{title}</h3>
        </Container>
      </div>
    </>
  );
}

export default DetailPageHeader;