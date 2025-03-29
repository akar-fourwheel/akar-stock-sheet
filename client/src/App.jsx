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
  const [finalData,setFinalData] = useState([])

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.get('http://localhost:3000/dealership-data', {
      params: {
        year: year,
        model: model,
        fuel: fuel,
      },
    })
    .then((response) => {
      const data = response.data;
      setFinalData(data);
      console.log(data);
      
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


  // useEffect(() => {
  // }, [finalData]);

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
    <div className="m-auto w-full max-w-4xl p-4">
  <h2 className="text-2xl font-semibold text-center mb-6">Test form for the dealer-stock API</h2>
  
  <form onSubmit={handleSubmit} className="space-y-4">
    <div className="space-y-2">
      <label className="block text-lg">Year:</label>
      <select
        name="selectedYear"
        onChange={dataBasedOnYear}
        className="w-full p-2 border border-gray-300 rounded-lg"
      >
        <option value="">Choose year</option>
        {getYear.map((yr) => (
          <option value={yr} key={yr}>
            {yr}
          </option>
        ))}
      </select>
    </div>

    <div className="space-y-2">
      <label className="block text-lg">Model:</label>
      <select
        name="selectedModel"
        onChange={dataBasedOnYearAndModel}
        className="w-full p-2 border border-gray-300 rounded-lg"
      >
        <option value="">Choose model</option>
        {getModel.map((m) => (
          <option value={m} key={m}>
            {m}
          </option>
        ))}
      </select>
    </div>

    <div className="space-y-2">
      <label className="block text-lg">Fuel:</label>
      <select
        name="selectedFuel"
        onChange={(e) => setFuel(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-lg"
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

    <button
      type="submit"
      className="w-full py-2 mt-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
    >
      Submit
    </button>
  </form>

  <div className="overflow-x-auto mt-6">
    <table className="min-w-full table-auto border-collapse">
      <thead>
        <tr className="bg-sky-400">
          <th className="border border-solid p-2 text-white">YEAR</th>
          <th className="border border-solid p-2 text-white">MODEL</th>
          <th className="border border-solid p-2 text-white">FUEL</th>
          <th className="border border-solid p-2 text-white">VARIANT</th>
          <th className="border border-solid p-2 text-white">COLOR</th>
          <th className="border border-solid p-2 text-white">QUANTITY</th>
          <th className="border border-solid p-2 text-white">BOOKING</th>
        </tr>
      </thead>
      <tbody>
        {finalData.map((row, rowIndex) => (
          <tr key={rowIndex} className="hover:bg-gray-100">
            {row.map((cell, cellIndex) => (
              <td key={cellIndex} className="border border-solid p-2">
                {cell}
              </td>
            ))}
            <td className="border border-solid p-2">
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                Book
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
  );
};

export default App;
