import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router";

const BookingForm = () => {
  const quoteID = useParams().id;

  const navigate = useNavigate();

  const [bookingAmount, setBookingAmount] = useState(0);
  const [resData, setResData] = useState({});
  const [color, setColor] = useState("");
  const [colorList,setColorList] = useState([]);
  const [bookingError, setBookingError] = useState("");
  
  const finalAmt = parseFloat(resData[5]) || 0;
  const RemainingAmt = finalAmt - parseFloat(bookingAmount || 0);

  const handleBooking = () => {
    try {      
      axios.post(`/booking-process`, {
        quoteID: quoteID,
        customer:resData[0],
        sales_adv:resData[6],
        year: resData[1],
        bookingAmount: bookingAmount,
        RemainingAmount: RemainingAmt,
        color: color,
        variant: resData[2]
      })
      .then(response =>{
        console.log( response.data?.chassisNo);
        console.log(response.data);
        
        const chassisNo = response.data?.chassisNo;
        console.log(response.data);
        
        if (chassisNo) {
          navigate(`/booking-success/${chassisNo}`);
        } else {
          setBookingError("Sorry, the car is not available in Dealer Stock. Please try looking into Plant or Zonal Stock.");
        }
      });
    } catch (e) {
      console.error("Booking error", e);
    }
  };

  useEffect(() => {
    if (!quoteID) return;
  
    axios.get(`/booking-form`, {
      params: { quoteID },
    }).then((res) => {
      setResData(res.data);
      setColor(res.data[3]);
  
      if (!res.data[3] || res.data[3] === "N/A") {
        axios.get(`/booking-color`, {
          params: {
            year: res.data[1],
            variant: res.data[2],
          },
        }).then((res) => {
          setColorList(res.data);
        });
      }
    });
  }, [quoteID]);

  useEffect(() => {
    const maxAmount = resData[5];
    if (bookingAmount > maxAmount) {
      setBookingAmount(maxAmount);
    }
  }, [bookingAmount]);

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4 sm:px-6 lg:px-8">
  <div className="bg-white shadow-lg rounded-2xl p-6 space-y-6">
    <h2 className="text-2xl font-semibold text-gray-800">Booking Details</h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-sm text-gray-700">
      <Field label="Customer Name" value={resData[0]} />
      <Field label="Model Year" value={resData[1]} />
      <Field label="Variant" value={resData[2]} />

      <div className="flex flex-col">
        <label className="text-gray-600 mb-1 font-medium">Color</label>
        {color && color !== "N/A" ? (
          <select
            className="p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
            value={color}
            disabled
          >
            <option value={color}>{color}</option>
          </select>
        ) : (
          <select
            className="p-2 border border-gray-300 rounded-lg"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          >
            <option value="">Select a color</option>
            {colorList.map((clr, index) => (
              <option key={index} value={clr}>
                {clr}
              </option>
            ))}
          </select>
        )}
      </div>

      <Field label="Total Discount" value={resData[4]} />
      <Field label="Final Amount" value={resData[5]} />

      <div className="flex flex-col">
        <label className="text-gray-600 mb-1 font-medium">Booking Amount</label>
        <input
          type="number"
          className="p-2 border border-gray-300 rounded-lg"
          value={bookingAmount} 
          onChange={(e) => setBookingAmount(e.target.value)}
        />
      </div>

      <Field label="Remaining Amount" value={RemainingAmt} />
    </div>

    {bookingError && (
      <div className="p-3 rounded-lg bg-red-100 text-red-700 border border-red-300 text-sm">
        {bookingError}
      </div>
    )}

    <button
      type="submit"
      className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
      onClick={handleBooking}
    >
      Book Car
    </button>
  </div>
</div>

  );
};
const Field = ({ label, value }) => (
  <div className="flex flex-col">
    <label className="text-gray-600 mb-1 font-medium">{label}</label>
    <div className="p-2 border border-gray-300 rounded-lg bg-gray-50">{value}</div>
  </div>
);

export default BookingForm;
