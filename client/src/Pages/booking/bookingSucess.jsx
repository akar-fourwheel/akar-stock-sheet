import { useEffect, useState } from "react";
import { useParams } from "react-router";

const bookingSuccess = (req,res) => {
    const {chassis} = useParams();
    
    const [bookingData,setBookingData] = useState([]);

    useEffect(()=> {
        try{
            axios.get('/booking-details',{
                params:{
                    chassis:chassis
                }
            })
            .then((res) =>{
                setBookingData(res);
            }
        )}
        catch(e){
            console.log(e);

        }
    })
    return (
        <div>
            {bookingData}
        </div>
    )

}

export default bookingSuccess;