import PropTypes from "prop-types";

const { Timestamp } = require("@firebase/firestore");

const fotmatTime = (date) => {
  // console.log(date)
  const formattedDate = date instanceof Timestamp
    ? new Date(date.seconds * 1000).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const jsDate = date instanceof Timestamp
    ? new Date(date.seconds * 1000)
    : new Date(date);
  const timePart = jsDate.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  const [hours, minutes, seconds] = timePart.split('/');
  const parts = formattedDate.split('/'); // Tách chuỗi theo dấu /
  return (`${hours} ${parts[0]}-${parts[1]}-${parts[2]}`);
}
fotmatTime.prototype = ({
  date: PropTypes.number.isRequired
})
export default fotmatTime;