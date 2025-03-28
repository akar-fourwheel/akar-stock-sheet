import React, { useEffect, useState } from 'react';
import axios from 'axios';

const apiCall = () => {
  // axios.get('http://localhost:3000').then((data) => {
  //   console.log(data)

  axios.get('http://localhost:3000/dealership-data').then((data) => {
    console.log(data.data);
  })
}

import './App.css'

const App = () => {
  // State for form fields
  const [getYear,setgetYear] = useState([]);
  const [year,setYear] = useState('');
  const [getModel,setgetModel]=useState([]);
  const [model, setModel] = useState('');
  const [getFuel,setgetFuel]=useState([])
  const [fuel,setFuel] = useState('');

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  function dataBasedonYear(){
    axios.get('http://localhost:3000/dealership-data',{
      params:{
        year:year
      }
    })
  }

  useEffect(() => {
    // Fetch data from the API
    axios.get('http://localhost:3000/dealership-data')
      .then((response) => {
        // Create a new array from the response data
        const fetchedYears = response.data.flat();
        setgetYear(fetchedYears);
        console.log(fetchedYears);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  // useEffect(()=>{
  //   if(year!=''){
  //     axios.get('http://localhost:3000/dealership-data',)
  //   }
  // },[year])

  return (
    <div>
      <h2>test form for the dealer-stock api</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>year:</label>
          <select name="selectedFruit" onChange={dataBasedonYear}>
            <option value="">choose year</option>
          {getYear.map(yr =>{
            return <option value={yr}  key={yr}>{yr}</option>
          })}
          </select>
        </div>
        {/* <div>
          <label>Fuel:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div> */}
        <button type="submit">Submit</button>
      </form>

      <button onClick={apiCall} >test</button>
    </div>
  );
};

export default App;
