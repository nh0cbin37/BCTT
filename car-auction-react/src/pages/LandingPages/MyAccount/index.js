import React, { useEffect } from "react";
import "assets/css/bootstrap.min.css";
import "assets/css/now-ui-kit.css";
import "assets/demo/demo.css";
import "assets/demo/nucleo-icons-page-styles.css";
// reactstrap components
import {
  Button,
  NavItem,
  NavLink,
  Nav,
  TabContent,
  TabPane,
  Container,
  Row,
  Col,
  UncontrolledTooltip
} from "reactstrap";

// core components
import ExamplesNavbar from "components/Navbars/ExamplesNavbar";
import ProfilePageHeader from "components/Headers/ProfilePageHeader";
import DefaultFooter from "components/Footers/DefaultFooter";
import { useDispatch, useSelector } from "react-redux";
import CreateProduct from "components/CreateProduct";
import { upCountNFTProduct, fetchProducts } from "redux/redux";
import { Link } from "react-router-dom";

function UserProfile() {
  const [pills, setPills] = React.useState("2");
  const inforUser = useSelector((state) => state.dataKit.infoUser);
  const allProducts = useSelector((state) => state.dataKit.allProducts);
  const countNFTProduct = useSelector((state) => state.dataKit.countNFTProduct.count);
  const dispatch = useDispatch();
  const handleCreate = (tokenIdCountinue) => {
    dispatch(upCountNFTProduct({ value: tokenIdCountinue }));

  };
  // chưa cập nhật mới được
  useEffect(() => {
    dispatch(fetchProducts({}));
  }, [])


  return (
    <>
      <ExamplesNavbar />
      <div className="wrapper" >
        <ProfilePageHeader />
        <div className="section" style={{ background: "#1e1e1e", color: "white" }}>
          {/* <div className="button-container"> */}

          <CreateProduct handleSetCountNFT={handleCreate} />
          {/* </div> */}
          <Container>
            <Row>
              <Col className="ml-auto mr-auto" md="6">
                <h4 className="title text-center">My Photo NFT</h4>
                <div style={{ marginBottom: 20 }} className="nav-align-center">
                  <Nav
                    className="nav-pills-info nav-pills-just-icons"
                    pills
                    role="tablist"
                  >
                    <NavItem>
                      <NavLink
                        className={pills === "2" ? "active" : ""}
                        href="#pablo"
                        onClick={(e) => {
                          e.preventDefault();
                          setPills("2");
                        }}
                      >
                        <i className="now-ui-icons design_image" />
                      </NavLink>
                    </NavItem>
                  </Nav>
                </div>
              </Col>
              <TabContent className="gallery" activeTab={`pills${pills}`}>
                <TabPane tabId="pills2">
                  <Col className="ml-auto mr-auto" md="10">
                    <Row className="collections"> {/* Sử dụng flexbox */}
                      {allProducts.products.map(element => {
                        console.log(allProducts);
                        if (element.addressOwnerBy === inforUser.walletAddress) {
                          return (
                            <Col key={element.id} md="4" style={{ marginBottom: 20 }}>
                              <Link to={`/detail-product/${element.id}`} state={{ infoProduct: element }}>
                                <img
                                  alt="..."
                                  src={element.logo}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                              </Link>
                            </Col>
                          )
                        } return null;
                      })}
                    </Row >
                  </Col>
                </TabPane>
              </TabContent>
            </Row>
          </Container>
        </div>
        <DefaultFooter />
      </div>
    </>
  );
}

export default UserProfile;