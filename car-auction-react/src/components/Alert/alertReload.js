import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { fetchProducts } from "redux/redux";

const { default: Swal } = require("sweetalert2");

const alertReloadCustome = ({titles}) => {
    alertReloadCustome.propTypes = ({
        handleReload: PropTypes.func.isRequired,
        titles: PropTypes.string.isRequired,
    })
    Swal.fire({
        title: titles,
        width: 600,
        padding: "3em",
        color: "#716add",
        background: "#fff url()",
        backdrop: `
          rgba(0,0,123,0.4)
          url("https://res.cloudinary.com/djit2fyvr/image/upload/v1733587056/nyan-cat-rainbow-unscreen_acqjde.gif")
          left top
          no-repeat
        `

    }).then((result) => {
        if (result.isConfirmed) {
            const dispatch = useDispatch();
            dispatch(fetchProducts({}));
        }
    })
}
export default alertReloadCustome;