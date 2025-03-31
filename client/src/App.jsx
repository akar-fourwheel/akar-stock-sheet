import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import formInfo from '../carScheme.json'
import DealerContent from './Components/DealerContent';
import ZoneContent from './Components/zoneContent';
import PlantContent from './Components/PlantContent';

const App = () => {
  const [year, setYear] = useState('');
  const [model, setModel] = useState('');
  const [fuel, setFuel] = useState('');
  const [fuelList, setFuelList] = useState('');
  const [sub,setSub] = useState(true);
  const [gotResponse,setGotResponse] = useState(false);
  const [finalData,setFinalData] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  // Handle form submit
  const handleSubmit = (e) => {    
    e.preventDefault();

    if (!year || !model || !fuel) {
      alert("Please select year, model, and fuel type.");
      return;
    }

    var apiLink;
    if(selectedOption=='dealerStock') apiLink = 'dealership-data'
    else if(selectedOption=='zonalStock') apiLink = 'zonal-stock'
    else if(selectedOption=='plantStock') apiLink = 'plant-data'

    axios.get(`http://localhost:3000/${apiLink}`, {
      params: {
        year: year,
        model: model,
        fuel: fuel,
      },
    })
    .then((response) => {
      const data = response.data;
      setFinalData(data);
      setGotResponse(true);      
    });
  };

  const handleYearChange = (e) =>{
    setYear(e.target.value);
    setModel('');
    setFuelList([]);
    
  }

  const handleModelChange = (e) => {
    setModel(e.target.value);
    setFuelList([])
    setFuelList(formInfo[year][e.target.value]);
  }

  const handleFuelChange = (e) => {
    setFuel(e.target.value);
  }

  const handleOptionSelect = (option) => {
    setFinalData([]);
    setGotResponse(false);
    setSelectedOption(option);  // Set selected option as Deal, Zone, or Last
  };

  useEffect(() => {
    if(year && model && fuel) setSub(false);
    else setSub(true);
  },[year,model,fuel])

  return (
    <div className="m-auto w-full max-w-4xl p-4">
  <h2 className="text-2xl font-semibold text-center mb-6">Test form for the dealer-stock API</h2>
  
  <form onSubmit={handleSubmit} className="space-y-4">
    <div className="space-y-2">
      <label className="block text-lg">Year:</label>
      <select
        name="selectedYear"
        onChange={handleYearChange}
        className="w-full p-2 border border-gray-300 rounded-lg"
      >
        <option value="">Choose year</option>
        {Object.keys(formInfo).map((yr) => (
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
        onChange={handleModelChange}
        className="w-full p-2 border border-gray-300 rounded-lg"
      >
        <option value="">Choose model</option>
        {year && Object.keys(formInfo[year]).map((m) => (
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
        onChange={handleFuelChange}
        className="w-full p-2 border border-gray-300 rounded-lg"
        //disabled={!getFuel.length} // Disable fuel select until data is available
      >
        <option value="">Choose fuel type</option>
        {model && fuelList.map((f) => (
          <option value={f} key={f}>
            {f}
          </option>
        ))}
      </select>
    </div>
    <div className="space-y-2">
    <label className="block text-lg">Select Stock Location:</label>
    <div className="flex gap-4">
      <button
        type="button"
        className={`w-full py-2 px-4 text-lg rounded-lg border border-gray-300 ${selectedOption === 'dealerStock' ? 'bg-blue-500 text-white' : 'bg-white'}`}
        onClick={() => handleOptionSelect('dealerStock')}
      >
        Dealer
      </button>
      <button
        type="button"
        className={`w-full py-2 px-4 text-lg rounded-lg border border-gray-300 ${selectedOption === 'zonalStock' ? 'bg-blue-500 text-white' : 'bg-white'}`}
        onClick={() => handleOptionSelect('zonalStock')}
      >
        zonal
      </button>
      <button
        type="button"
        className={`w-full py-2 px-4 text-lg rounded-lg border border-gray-300 ${selectedOption === 'plantStock' ? 'bg-blue-500 text-white' : 'bg-white'}`}
        onClick={() => handleOptionSelect('plantStock')}
      >
        plant
      </button>
    </div>
  </div>
    <button
      type="submit"
      disabled={sub}
      className="w-full py-2 mt-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
    >
      Submit
    </button>
  </form>
    {gotResponse && finalData.length==0 && 
    <h5 className='text-red-400 p-2'>No related cars available in dealership right now ☹️!</h5>
    }
    { finalData.length > 0 && selectedOption=='dealerStock' && <DealerContent finalData={finalData}></DealerContent> }
    { finalData.length > 0 && selectedOption=='zonalStock' && <ZoneContent finalData={finalData}></ZoneContent> }
    { finalData.length > 0 && selectedOption=='plantStock' && <PlantContent finalData={finalData}></PlantContent> }
</div>
  );
};

export default App;
