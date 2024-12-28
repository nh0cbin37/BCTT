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
import { useSelector } from "react-redux";
import DataContext from "components/UseContext/Datacontext";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import React, { useContext, useState } from "react";
// Material Kit 2 PRO React components
import MKBox from "components/MKBox";

// Material Kit 2 PRO React examples
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DefaultFooter from "examples/Footers/DefaultFooter";

// Rental page sections
import Places from "pages/LandingPages/Rental/sections/Places";
import Testimonials from "pages/LandingPages/Rental/sections/Testimonials";
import Faq from "pages/LandingPages/Rental/sections/Faq";

// Routes
import footerRoutes from "footer.routes";

// Images
import bgImage from "assets/images/motors.stylemixthemes.com/backgound.jpg";
import axios from "axios";
import { ethers } from "ethers";
import routess from "routes";







const Rental = () => {
  const InforUser = useSelector((state) => state.dataKit.infoUser);
  const allProducts = useSelector((state) => state.dataKit.allProducts.products);
  const shortenAddress = (address) => {
    if (!address) return ""; // Xử lý trường hợp address là null hoặc undefined
    const start = address.slice(0, 6);
    const end = address.slice(-5);
    return `${start}...${end}`;
  }
  const brand = <span style={{ fontSize: "2.5rem", color: "white", fontWeight: "bold" }}>iNFT</span>;
  return (
    <div style={{backgroundColor:"black"}}>
      <DefaultNavbar
        routes={routess(InforUser.walletAddress)}
        action={{
          type: "internal",
          route: "/",
          label: InforUser.walletAddress === "" ? 'Sign in' : shortenAddress(InforUser.walletAddress),
          color: "info",
        }}
        transparent
        light
        brand={brand}
      />
      <MKBox
        minHeight="50vh"
        width="100%"
        sx={{
          backgroundColor: "black",
          backgroundImage: ({ functions: { linearGradient, rgba }, palette: { gradients } }) =>
            `${linearGradient(
              rgba(gradients.dark.main, 0.5),
              rgba(gradients.dark.state, 0.5)
            )}, url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "grid",
          placeItems: "center",
        }}
      >
        <Container style={{ backgroundColor: "black" }}>
          <Grid
            container
            item
            xs={12}
            lg={8}
            justifyContent="center"
            sx={{ mx: "auto", textAlign: "center", backgroundColor: "#1e1e1e" }}
          />
        </Container>
      </MKBox>
      <Card
        sx={{
          p: 2,
          mx: { xs: 2, lg: 3 },
          mt: -8,
          mb: 4,
         backgroundColor: "#1e1e1e",
          backdropFilter: "saturate(200%) blur(300px)",
          boxShadow: ({ boxShadows: { xxl } }) => xxl,
          overflow: "hidden",
        }}
      >
        <Places />
      </Card>
      <MKBox pt={6} px={1} mt={6}  sx={{backgroundColor:"black"}}>
        <DefaultFooter content={footerRoutes} />
      </MKBox>
    </div>
  );
}

export default Rental;
