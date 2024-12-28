import PropTypes from "prop-types";
import CIcon from "@coreui/icons-react";
import * as icon from '@coreui/icons';
import PaidIcon from "@mui/icons-material/Paid";
import { useSelector } from "react-redux";
import fotmatTime from "components/format/formatTime";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TimerIcon from '@mui/icons-material/Timer';
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import VehicleCard from "../VehicleCard";
import AuctionCountdown from "./AuctionCountdown";
import MKBadge from "../../MKBadge";


function VehicleAuctionCard({
  image,
  title,
  timeData,
  topBidPrice,
  allBidCount,
  vehicleInfo,
  action,
  Info,

}) {
  function formatDuration(milliseconds) {
    // if (typeof milliseconds !== 'number' || isNaN(milliseconds)) {
    //   return 'Invalid input'; // Handle non-numeric or NaN input
    // }

    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    let formattedDuration = '';

    if (minutes > 0) {
      formattedDuration += `${minutes}m`; // Use lowercase 'm' here
    }

    if (remainingSeconds > 0) {
      formattedDuration += `${remainingSeconds}s`;
    }

    return formattedDuration || '0s';
  }
  const { timeStart, timeDuration } = timeData;
  const allhistorys = useSelector((state) => state.dataKit.allhistorys);
  const allProducts = useSelector((state) => state.dataKit.allProducts);
  const filterData = allhistorys.historydata.filter(item => item.AuctionID === Info.AuctionID)
  const filterDataInTime = allProducts.products.filter(item => item.AuctionID === Info.AuctionID)
  const timeEnd = timeStart + timeDuration;
  const currentTime = new Date();
  // console.log(timeStart);
  const description = (
    // làm tiếp đấu giá và cho người dùng đấu giá 

    <>
      <AuctionCountdown timeEnd={timeEnd} Info={Info} />
      <MKBadge
        badgeContent={
          <>
            <CIcon icon={icon.cibEthereum} style={{ width: 13 }} />
            &nbsp;{topBidPrice}
          </>
        }
        color="light"
        container
      />
      <MKBadge
        badgeContent={
          <>
            <PeopleAltIcon />
            &nbsp;{allBidCount}
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
      <MKBadge
        badgeContent={
          <>
            <TimerIcon style={{ width: 13 }} />
            <span>&nbsp; {filterData[0]?.AuctionDuration !== undefined ?formatDuration(filterData[0].AuctionDuration).toLowerCase(): formatDuration(filterDataInTime[0].TimeAuction).toLowerCase()} </span>
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
      timeData={timeData}
      vehicleInfo={vehicleInfo}
      action={action}
      Info={Info}
    />
  );
}

VehicleAuctionCard.defaultProps = {
  allBidCount: 0,
  topBidPrice: 0,
};

VehicleAuctionCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  vehicleInfo: PropTypes.shape({
    miles: PropTypes.number,
    fuel: PropTypes.string,
    transmission: PropTypes.oneOf(["Manual", "Automatic"]),
  }).isRequired,
  timeData: PropTypes.shape({
    timeStart: PropTypes.instanceOf(Date),
    timeDuration: PropTypes.number,
  }).isRequired,
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
  }),
};

export default VehicleAuctionCard;
