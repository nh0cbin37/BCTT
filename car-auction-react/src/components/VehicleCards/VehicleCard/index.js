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

import { Fragment } from "react";
import CIcon from "@coreui/icons-react";
import * as icon from '@coreui/icons';
// react-router components
import { Link } from "react-router-dom";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import MuiLink from "@mui/material/Link";

// Material Kit 2 PRO React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";

import AddRoadIcon from "@mui/icons-material/AddRoad";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { id } from "ethers/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { setStatusAuction } from "redux/redux";
import fotmatTime from "components/format/formatTime";
import alertWrong from "components/Alert/alertwrong";
import { Button } from "reactstrap";

// eslint-disable-next-line react/prop-types
function VehicleCard({ image, title, description, vehicleInfo, action, Info, InfoSellBuyer }) {
  const dispatch = useDispatch();
  const inforUser = useSelector((state) => state.dataKit.infoUser);
  const handleAlert =()=>{
    alertWrong("Please! Sign In");
  }
  const handleNotUser = () => {
    console.log("active")
    return(
      <>
      <MKButton
        component={Button}
        onClick={handleAlert}
        variant="outlined"
        size="small"
        color={action.color ? action.color : "dark"}
      >
        {action.label}
      </MKButton>
      </>
    )
  }
  return (
    <Card >
      <MKBox position="relative" borderRadius="lg" mx={3} mt={1}>
        <MKBox
          component="img"
          src={Info.logo}
          alt={title}
          width="350px"
          height="260px"
          borderRadius="lg"
          shadow="md"
          position="relative"
          zIndex={1}
        />
        <MKBox
          borderRadius="lg"
          shadow="md"

          position="absolute"
          left={0}
          top={0}
          sx={{
            // objectFit:"cover",
            backgroundImage: `url(${Info.logo})`,
            transform: "scale(0.94)",
            filter: "blur(12px)",
            backgroundSize: "cover",

          }}
        />
      </MKBox>
      <MKBox p={3} mt={-2}>
        <MKTypography display="inline" variant="h6" fontWeight="bold">
          {Info.name}
        </MKTypography>
        <MKBox mt={1} mb={3}>
          <MKTypography variant="body2" component="p" color="text">
            {description}
          </MKTypography>
        </MKBox>
        {action.type === "external" && inforUser.walletAddress !== "" ? (
          <MKButton
            component={MuiLink}

            href={action.route}
            onClick={() => dispatch(setStatusAuction({}))}
            target="_blank"
            rel="noreferrer"
            variant="outlined"
            size="small"
            color={action.color ? action.color : "dark"}

          >
            {action.label}
          </MKButton>
        ) : null}
        {action.type !== "external" && inforUser.walletAddress !== "" ? (

          <MKButton
            component={Link}
            to={action.route}
            state={{ infoProduct: Info }}
            variant="outlined"
            size="small"
            color={action.color ? action.color : "dark"}

          >
            {action.label}
          </MKButton>
        ) : null}
        {inforUser.walletAddress === "" ? (
          handleNotUser()
        ) : null}
      </MKBox>
    </Card>
  );
}

// Typechecking props for the VehicleCard
VehicleCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  vehicleInfo: PropTypes.shape({
    miles: PropTypes.number,
    fuel: PropTypes.string,
    transmission: PropTypes.oneOf(["Manual", "Automatic"]),
  }).isRequired,
  action: PropTypes.shape({
    type: PropTypes.oneOf(["external", "internal"]).isRequired,
    route: PropTypes.string.isRequired,
    color: PropTypes.oneOf([
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "dark",
      "light",
    ]),
    label: PropTypes.string.isRequired,
  }).isRequired,
  Info: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    logo: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    createAt: PropTypes.string.isRequired,
    addressOwner: PropTypes.string.isRequired,
    addressCreateBy: PropTypes.string.isRequired,
    sellAt: PropTypes.string.isRequired,
    status: PropTypes.number.isRequired,
    nftTokenId: PropTypes.number.isRequired,
    TimeAuction: PropTypes.number.isRequired,
    AuctionID: PropTypes.number.isRequired,
    StepPrice: PropTypes.string.isRequired,
    Seller: PropTypes.string.isRequired,
    Buyer: PropTypes.string.isRequired,
    typeHistory: PropTypes.number.isRequired,
    BuyEndAt: PropTypes.number.isRequired
  })
};

export default VehicleCard;
