const { default: Swal } = require("sweetalert2");

const alertWrong =(titles) => {
    Swal.fire({
        icon: "error",
        title: titles,
        text: "Something went wrong!",
      });
}
export default alertWrong;