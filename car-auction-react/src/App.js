/**
=========================================================
* Material Kit 2 PRO React - v2.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-kit-pro-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import React, { useEffect, useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { DataProvider } from "components/UseContext/Datacontext";
import store from "redux/store";
import { fetchProducts,fetchHistorys } from "redux/redux";
import WebFont from "webfontloader";

// import { Switch } from "@mobiscroll/react-lite";

// react-router components
import { BrowserRouter, Navigate, Route, Router, Routes, useLocation } from "react-router-dom";
import routess from "routes";
import ProductDetailBuyAuction from "layouts/pages/landing-pages/detailproduct/indexBuyAuction";
import ProfilePage from "layouts/pages/landing-pages/profile";
import ProductViewAuction from "pages/LandingPages/DetailProduct/indexAuction";
import { ethers } from "ethers";


// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Material Kit 2 PRO React themes
import theme from "assets/theme";
import ProductDetail from "layouts/pages/landing-pages/detailproduct";
import Presentation from "./layouts/pages/landing-pages/rental";
import "./assets/css/index.css"

// Material Kit 2 PRO React routes

export default function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const allhistorys = useSelector((state) => state.dataKit.allhistorys);
  const { pathname } = location;
  // Setting page scroll to 0 when changing the route


  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname, location]);
  useEffect(() => {
    dispatch(fetchProducts({}))
    dispatch(fetchHistorys({}))
  }, [dispatch])
  // useEffect(() => {
  //  console.log(allProducts);
  // }, [allhistorys])
  
  useEffect(() => {
    WebFont.load({
      google: {
        families: ['Droid Sans', 'Roboto', 'Chilanka']
      }
    })
  }, []);
  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }

      return null;
    });
  const inforUser = useSelector((state) => state.dataKit.infoUser);
  const allProducts = useSelector((state) => state.dataKit.allProducts);
  // allProducts.products.forEach(element => {
  //   // console.log(element.createAt);
  // });
  return (
    // Code lại chi tiet san pham mua va lam xong chuc nang mua( chi tiết kĩ xiu ve thong tin)
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes >
        {getRoutes(routess(inforUser.walletAddress))}
        <Route path="/" element={<Navigate to="/main" />} />
        <Route path="/main" element={<Presentation />} />
        <Route path="/detail-product/:id" element={<ProductDetail />} />
        <Route path="/detail-product-buy/:id" element={<ProductDetailBuyAuction />} />
        <Route path="/pages/landing-pages/profile" element={<ProfilePage />} />
        <Route path="/detail-product-Auction/:id" element={<ProductViewAuction />} />
      </Routes>
    </ThemeProvider>

  );
}
