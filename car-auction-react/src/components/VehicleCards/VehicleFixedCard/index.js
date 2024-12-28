import PropTypes from "prop-types";
import CIcon from "@coreui/icons-react";
import * as icon from '@coreui/icons';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PaidIcon from "@mui/icons-material/Paid";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import fotmatTime from "components/format/formatTime";
import VehicleCard from "../VehicleCard";

// import AuctionCountdown from "./AuctionCountdown";
import MKBadge from "../../MKBadge";

function VehicleFixedCard({
  image,
  title,
  // timeData,
  topBidPrice,
  allBidCount,
  vehicleInfo,
  action,
  Info,
}) {
  //   const { timeStart, timeDuration } = timeData;
  //   const timeEnd = Date.parse(timeStart) + timeDuration;
  // lam tiep dua san pham len ban, nguoi mua vaf dau gia
  const description = (
    <>
      <MKBadge
        badgeContent={
          <>
            <CIcon icon={icon.cibEthereum} style={{ width: 13 }} />
            &nbsp;{Info.price}
          </>
        }
        color="light"
        container
      />
      <MKBadge
        badgeContent={
          <>
            <CalendarTodayIcon style={{ width: 13 }} />
            <span>&nbsp; {fotmatTime(Info.sellAt)} </span>
          </>
        }
        color="light"
        container
      />
    </>
  );

  return (
    <VehicleCard
      image={image}
      title={title}
      description={description}
      // timeData={timeData}
      vehicleInfo={vehicleInfo}
      action={action}
      Info={Info}
    />
  );
}

VehicleFixedCard.defaultProps = {
  allBidCount: 0,
  topBidPrice: 0,
};

VehicleFixedCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  vehicleInfo: PropTypes.shape({
    miles: PropTypes.number,
    fuel: PropTypes.string,
    transmission: PropTypes.oneOf(["Manual", "Automatic"]),
  }).isRequired,
  // timeData: PropTypes.shape({
  //   timeStart: PropTypes.instanceOf(Date),
  //   timeDuration: PropTypes.number,
  // }).isRequired,
  topBidPrice: PropTypes.number,
  allBidCount: PropTypes.number,
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
    BuyEndAt:PropTypes.number.isRequired
  })

};

export default VehicleFixedCard;
