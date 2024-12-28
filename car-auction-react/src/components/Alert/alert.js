const { default: Swal } = require("sweetalert2");

const alertCustome = (titles) =>{
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
        
      });
}
  export default alertCustome;