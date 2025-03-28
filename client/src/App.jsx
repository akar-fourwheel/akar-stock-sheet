import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [getYear, setGetYear] = useState([]);
  const [year, setYear] = useState('');
  const [getModel, setGetModel] = useState([]);
  const [model, setModel] = useState('');
  const [getFuel, setGetFuel] = useState([]);
  const [fuel, setFuel] = useState('');

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
    .get('http://localhost:3000/dealership-data', {
      params: {
        year: year,
        model: model,
        fuel: fuel,
      },
    })
    .then((response) => {
      const data = response.data;
      console.log('Data length:', data);
    });
  };

  const dataBasedOnYear = (e) => {
    const selectedYear = e.target.value;
    setYear(selectedYear);

    // Fetch models based on selected year
    axios
      .get('http://localhost:3000/dealership-data', {
        params: { year: selectedYear },
      })
      .then((response) => {
        const data = response.data.flat();
        setGetModel(data);
        setGetFuel([]); // Clear fuel options when the year is changed
      });
  };

  // Fetch models and fuel based on year and model
  const dataBasedOnYearAndModel = (e) => {
    const selectedModel = e.target.value;
    setModel(selectedModel);

    axios
      .get('http://localhost:3000/dealership-data', {
        params: {
          year: year,
          model: selectedModel,
        },
      })
      .then((response) => {
        console.log(response.data);
        
        if(response.data=="data not found") return;
        const data = response.data.flat();
        setGetFuel(data); // Assuming fuel types are returned based on year and model
      });
  };

  // Fetch data when the year or model or fuel is selected

  useEffect(() => {
    // Fetch years initially
    axios
      .get('http://localhost:3000/dealership-data')
      .then((response) => {
        const fetchedYears = response.data.flat();
        setGetYear(fetchedYears);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div>
      <h2>Test form for the dealer-stock API</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Year:</label>
          <select name="selectedYear" onChange={dataBasedOnYear}>
            <option value="">Choose year</option>
            {getYear.map((yr) => (
              <option value={yr} key={yr}>
                {yr}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Model:</label>
          <select name="selectedModel" onChange={dataBasedOnYearAndModel}>
            <option value="">Choose model</option>
            {getModel.map((m) => (
              <option value={m} key={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Fuel:</label>
          <select
            name="selectedFuel"
            onChange={(e) => setFuel(e.target.value)}
            //disabled={!getFuel.length} // Disable fuel select until data is available
          >
            <option value="">Choose fuel type</option>
            {getFuel.map((f) => (
              <option value={f} key={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default App;
