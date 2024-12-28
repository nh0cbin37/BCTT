/**
=========================================================
* Material Kit 2 PRO React React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-pro-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import {forwardRef} from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// Custom styles for MKButton
import MKButtonRoot from "components/MKButton/MKButtonRoot";
import { useLocation, useNavigate } from "react-router-dom";

const MKButton = forwardRef(
  ({ color, variant, size, circular, iconOnly, children ,...rest }, ref) => {
    
    const navigate = useNavigate();
    const location = useLocation();

    // const handleClick = () => {
    //   if (to) {
    //     console.log(to)
    //     navigate(to, { state: { ...state, from: location } }); // Thêm location hiện tại vào state
    //   }
    
    return(
    <MKButtonRoot
      {...rest}
      ref={ref}
      color="primary"
      variant={variant === "gradient" ? "contained" : variant}
      size={size}
      ownerState={{ color, variant, size, circular, iconOnly }}
    >
      {children}
    </MKButtonRoot>)
  }
);

// Setting default values for the props of MKButton
MKButton.defaultProps = {
  size: "medium",
  variant: "contained",
  color: "white",
  circular: false,
  iconOnly: false,
};

// Typechecking props for the MKButton
MKButton.propTypes = {
  size: PropTypes.oneOf(["small", "medium", "large"]),
  variant: PropTypes.oneOf(["text", "contained", "outlined", "gradient"]),
  color: PropTypes.oneOf([
    "default",
    "white",
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
  ]),
  circular: PropTypes.bool,
  iconOnly: PropTypes.bool,
  children: PropTypes.node.isRequired,
  // to:PropTypes.string.isRequired,
};

export default MKButton;
