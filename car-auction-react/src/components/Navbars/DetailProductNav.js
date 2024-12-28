// import Button from "assets/theme/components/button";
import RentalPage from "layouts/pages/landing-pages/rental";
import PropTypes from "prop-types";
import React from "react";
import { useDispatch } from "react-redux";
import { Link, Route, Routes, useNavigate } from "react-router-dom";

// reactstrap components
import {
    Collapse,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    NavbarBrand,
    Navbar,
    NavItem,
    NavLink,
    Nav,
    Container,
    UncontrolledTooltip,
} from "reactstrap";
import { setStatusAuction,setFlagCurrent } from "redux/redux";

function DetailProductNav({title,to}) {
    const [navbarColor, setNavbarColor] = React.useState("navbar-transparent");
    const [collapseOpen, setCollapseOpen] = React.useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    DetailProductNav.propTypes ={
        title:PropTypes.string.isRequired,
        to:PropTypes.string.isRequired
    }
    const handleClick = () => {
        dispatch(setStatusAuction({}));
        navigate(to);
    };

    React.useEffect(() => {
        const updateNavbarColor = () => {
            if (
                document.documentElement.scrollTop > 399 ||
                document.body.scrollTop > 399
            ) {
                setNavbarColor("");
            } else if (
                document.documentElement.scrollTop < 400 ||
                document.body.scrollTop < 400
            ) {
                setNavbarColor("navbar-transparent");
            }
        };
        window.addEventListener("scroll", updateNavbarColor);
        return function cleanup() {
            window.removeEventListener("scroll", updateNavbarColor);
        };
    });
    return (
        < >
            {collapseOpen ? (
                <div
                    role="button"
                    aria-label="Open navbar"
                    id="bodyClick"
                    tabIndex={0}
                    onKeyDown={() => {
                        document.documentElement.classList.toggle("nav-open");
                        setCollapseOpen(false);
                    }}
                    onClick={() => {
                        document.documentElement.classList.toggle("nav-open");
                        setCollapseOpen(false);
                    }}
                />
            ) : null}
            <Navbar className={`fixed-top ${navbarColor}`} color="white" expand="lg">
                <Container>
                    <UncontrolledDropdown className="button-dropdown">
                        <DropdownToggle
                            caret
                            data-toggle="dropdown"
                            href="#pablo"
                            id="navbarDropdown"
                            tag="a"
                            onClick={(e) => e.preventDefault()}
                        >
                            <span className="button-bar" />
                            <span className="button-bar" />
                            <span className="button-bar" />
                        </DropdownToggle>
                    </UncontrolledDropdown>
                    <div className="navbar-translate">
                        <button style={{ color: "white", backgroundColor: "transparent", border: 'none' }} type="button" onClick={handleClick} >{title}</button>
                        <button
                            className="navbar-toggler navbar-toggler"
                            onClick={() => {
                                document.documentElement.classList.toggle("nav-open");
                                setCollapseOpen(!collapseOpen);
                            }}
                            aria-expanded={collapseOpen}
                            type="button"
                        >
                            
                            <span className="navbar-toggler-bar top-bar" />
                            <span className="navbar-toggler-bar middle-bar" />
                            <span className="navbar-toggler-bar bottom-bar" />
                        </button>
                    </div>
                    <Collapse
                        className="justify-content-end"
                        isOpen={collapseOpen}
                        navbar
                    >
                        <Nav />
                    </Collapse>
                </Container>
            </Navbar>
        </>
    );
}

export default DetailProductNav;
