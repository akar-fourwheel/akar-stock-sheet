import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

const BookingPage = () => {
  const quoteID = useParams().id;
  console.log(quoteID);

  const [bookingAmount, setBookingAmount] = useState(0);
  const [resData, setResData] = useState({});
  const [color, setColor] = useState("");

  useEffect(() => {
    if (!quoteID) return;
    axios
      .get(`${import.meta.env.VITE_SERVER}booking-page`, {
        params: { quoteID },
      })
      .then((res) => {
        setResData(res.data);
        console.log(res.data);
        
        setColor(res.data.color); // make color editable
      });
  }, []);

  const finalAmt = parseFloat(resData.finalAmt) || 0;
  const RemainingAmt = finalAmt - parseFloat(bookingAmount || 0);

  const handleBooking = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER}booking-process`, {
        quoteID,
        bookingAmount,
        RemainingAmount: RemainingAmt,
        color,
      });

      console.log( response.data);

      const chassisNo = response.data?.chassisNo;
      if (chassisNo) {
        navigate(`/booking-success/${chassisNo}`);
      } else {
        alert("Booking complete, but no phone number returned.");
      }
    } catch (e) {
      console.error("Booking error", e);
    }
  };

  return (
    <div className="overflow-x-auto mt-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div>Customer Name :</div>
        <div className="w-full p-2 border border-gray-300 rounded-lg">{resData[0]}</div>
        <div>Model Year :</div>
        <div className="w-full p-2 border border-gray-300 rounded-lg">{resData[1]}</div>
        <div>Varient :</div>
        <div className="w-full p-2 border border-gray-300 rounded-lg">{resData[2]}</div>
        <div>Color :</div>
        <input
          className="w-full p-2 border border-gray-300 rounded-lg"
          defaultValue={resData[3]}
          onChange={(e) => setColor(e.target.value)}
        />
        <div>Total Discount :</div>
        <div className="w-full p-2 border border-gray-300 rounded-lg">{resData[4]}</div>
        <div>Final Amount :</div>
        <div className="w-full p-2 border border-gray-300 rounded-lg">{resData[5]}</div>
        <div>Booking Amount :</div>
        <input
          type="number"
          className="w-full p-2 border border-gray-300 rounded-lg"
          onChange={(e) => setBookingAmount(e.target.value)}
        />
        <div>Remaining Amount :</div>
        <div className="w-full p-2 border border-gray-300 rounded-lg">{RemainingAmt}</div>
      </div>

      <button
        type="submit"
        className="w-full py-2 mt-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
        onClick={handleBooking}
      >
        Submit
      </button>
    </div>
  );
};

export default BookingPage;
