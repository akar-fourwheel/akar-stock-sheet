import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from "react-select";

const quotationPage = () => {
  const [getYear, setGetYear] = useState([]);
  const [year, setYear] = useState('');
  const [getModel, setGetModel] = useState([]);
  const [model, setModel] = useState('');
  const [getFuel, setGetFuel] = useState([]);
  const [fuel, setFuel] = useState('');
  const [getVariant, setGetVariant] = useState([]);
  const [variant, setVariant] = useState('');
  const [finalData,setFinalData] = useState({});
  const [selectedInsurance, setSelectedInsurance] = useState([]);
  const [selectedDiscounts, setSelectedDiscounts] = useState([]);
  const [addExc, setAddExc] = useState(0);
  const [loyalty, setLoyalty] = useState(0);
  const [corpOffer, setCorpOffer] = useState("");
  const [addDisc, setAddDisc] = useState(0);
  const [sss, setSss] = useState(0);
  const [rto, setRto] = useState("RTO");
  const [totalDisc, setTotalDisc] = useState(0);
  const [ew, setEw] = useState();
  const [accessories, setAccessories] = useState([]);
  const [selectedAcc, setSelectedAcc] = useState([]);
  const [color, setColor] = useState([]);
  const [selectedColor, setSelectedColor] = useState();
  const [selectedVas, setSelectedVas] = useState();
  const [selectedHpn, setSelectedHpn] = useState();
  const [totalAddOns, setTotalAddOns] = useState(0);
  const [accTotal, setAccTotal] = useState(0);
  const [loyaltyType, setLoyaltyType] = useState();
  const [scrap, setScrap] = useState();
  const [loading, setLoading] = useState(false);

  let tcs, totalESP;

  const discounts = [
    { value: 'CONSUMER', label: 'Consumer' },
    { value: 'EXCHANGE', label: 'Exchange' },
    { value: 'INTERVENTION', label: 'Intervention' },
    { value: 'CORPORATE_TOP_10', label: 'Corporate Top 10' },
    { value: 'CORPORATE_TOP_20', label: 'Corporate Top 20' },
    { value: 'GRID', label: 'Grid' },
  ];

  const corpOfferOptions = [
    { value: 'MSME', label: 'MSME' },
    { value: 'SOLER', label: 'Solar' },
  ];

  const rtoOptions = [
    { value: 'RTO', label: 'Normal RTO' },
    { value: 'BH RTO', label: 'BH RTO' },
    { value: 'Scrap RTO', label: 'Scrap RTO'},
  ];

  const ewOptions = [
    { value: 'EW 1 Year', label: '1 Year' },
    { value: 'EW 2 Year', label: '2 Years' },
    { value: 'EW 3 Year', label: '3 Years'},
  ];

  const vasOptions = [
    { label: 'Ceramic Coating', value: 25000 },
    { label: 'Teflon Coating', value: 15000 },
  ];

  const hpnOptions = [
    { "label": "Axis Bank", "value": "Axis Bank" },
    { "label": "Bandhan Bank", "value": "Bandhan Bank" },
    { "label": "Bank of Baroda", "value": "Bank of Baroda" },
    { "label": "Bank of India", "value": "Bank of India" },
    { "label": "Canara Bank", "value": "Canara Bank" },
    { "label": "Central Bank of India", "value": "Central Bank of India" },
    { "label": "Federal Bank", "value": "Federal Bank" },
    { "label": "HDFC Bank", "value": "HDFC Bank" },
    { "label": "ICICI Bank", "value": "ICICI Bank" },
    { "label": "IDBI Bank", "value": "IDBI Bank" },
    { "label": "IDFC First Bank", "value": "IDFC First Bank" },
    { "label": "IndusInd Bank", "value": "IndusInd Bank" },
    { "label": "Kotak Mahindra Bank", "value": "Kotak Mahindra Bank" },
    { "label": "Punjab National Bank", "value": "Punjab National Bank" },
    { "label": "RBL Bank", "value": "RBL Bank" },
    { "label": "State Bank of India", "value": "State Bank of India" },
    { "label": "UCO Bank", "value": "UCO Bank" },
    { "label": "Union Bank of India", "value": "Union Bank of India" },
    { "label": "Yes Bank", "value": "Yes Bank" },
    { "label": "N/A", "value": "N/A" }
  ];
  

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.get('http://localhost:3000/quotation-data', {
      params: {
        year: year,
        model: model,
        fuel: fuel,
        variant: variant
      },
    })
    .then((response) => {      
      const data = JSON.parse(response.data[0]);
      const data1 = JSON.parse(response.data[1]);
      const data2 = JSON.parse(response.data[2]);
      console.log(data2);
      setColor(data2);
      setAccessories(data1)
      setFinalData(data);
    });
  };

  const dataBasedOnYear = (e) => {
    const selectedYear = e.target.value;
    setYear(selectedYear);

    // Fetch models based on selected year
    axios
      .get('http://localhost:3000/quotation-data', {
        params: { year: selectedYear },
      })
      .then((response) => {
        const data = response.data.flat();
        setGetModel(data);
        setGetFuel([]); // Clear fuel options when the year is changed
      });
  };

  // Fetch fuel based on year and model
  const dataBasedOnYearAndModel = (e) => {
    const selectedModel = e.target.value;
    setModel(selectedModel);

    axios
      .get('http://localhost:3000/quotation-data', {
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

  // Fetch variant based on year, model and fuel
  const dataBasedOnYearModelAndFuel = (e) => {
    const selectedFuel = e.target.value;
    setFuel(selectedFuel);
    console.log(model);
    
  
    axios
      .get('http://localhost:3000/quotation-data', {
        params: {
          year: year,
          model: model,
          fuel: selectedFuel
        },
      })
      .then((response) => {
        console.log(response.data);
        
        if(response.data === "data not found") return;
        const data = response.data.flat();
        setGetVariant(data); // Correctly updating variants
      });
  };

  // Fetch data when the year or model or fuel is selected

  useEffect(() => {
    // Fetch years initially
    axios
      .get('http://localhost:3000/quotation')
      .then((response) => {
        const fetchedYears = response.data.flat();
        setGetYear(fetchedYears);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    const newTotal = selectedDiscounts.reduce((accumulator, item) => {
      return accumulator + (finalData[item.value] || 0) + addExc + loyalty + finalData[corpOffer];
    }, 0) + Number(addDisc) + Number(sss);

    setTotalDisc(newTotal);
  }, [selectedDiscounts, addExc, loyalty, corpOffer, addDisc, sss]);

  useEffect(() => {
    const newInsuranceTotal = selectedInsurance.reduce((accumulator, item) => {
      return accumulator + (finalData[item.value] || 0);
    }, 0);

    setTotalAddOns(newInsuranceTotal);
  }, [selectedInsurance]);

  useEffect(() => {
  const newAccTotal = selectedAcc.reduce((accumulator, item) => {
    return accumulator + (item.value || 0);
  }, 0);

  setAccTotal(newAccTotal);
}, [selectedAcc]);

  const handleInsurance = (selected) => {
    setSelectedInsurance(selected);
  };

  const handleDiscount = (selected) => {
    setSelectedDiscounts(selected);
    
    if (!selected.some((opt) => opt.value === "EXCHANGE")) {setLoyalty(0); setAddExc(0);}
    if (!selected.some((opt) => opt.value === "CORPORATE OFFER")) {setCorpOffer(0);}
  };

  const handleAddExch = (selected) => {
    if (selected.value) {setAddExc(finalData["ADDITIONAL EXCHANGE"])}
    else setAddExc(0);
  }

  const handleLoyalty = (selected) => {
    finalData[selected.value] ? setLoyalty(finalData[selected.value]) : setLoyalty(0);
    setLoyaltyType(selected.value);
  }

  const handleCorpOffer = (selected) => {
    finalData[selected.value] ? setCorpOffer(selected.value) : setCorpOffer("")
    
  }

  const handleAddDisc = (e) => {
    setAddDisc(e.target.value)
  }

  const handleSss = (e) => {
    setSss(e.target.value)
  }

  const handleRto = (selected) => {
    setRto(selected.value)
  }

  const handleEw = (selected) => {
    selected ? setEw(selected.value) : setEw()
  }

  const handleAccessories = (selected) => {
    setSelectedAcc(selected)
  }

  const handleColor = (selected) => {
    selected && setSelectedColor(selected.value)
  }

  const handleVas = (selected) => {
    setSelectedVas(selected)
  }

  const handleHpn = (selected) => {
    setSelectedHpn(selected)
  }

  const generatePDF = async () => {
    var Qdata = {
      date: '01-01-2025',
      name: "Shyam",
      HPN: (selectedHpn ? selectedHpn.value : "N/A"),
      mobile: '123456',
      email: "qwert@gmail.com", 
      address: "qwertyuiop", 
      salesPerson: 'dharmendar', 
      year: finalData.YEAR, 
      model: finalData.PPL, 
      fuel: finalData.Fuel, 
      color: selectedColor, 
      varient: finalData.Variant, 
      ESP: finalData.ESP, 
      consumerDisc: (selectedDiscounts.some((opt) => opt.value === "CONSUMER") ? finalData.CONSUMER : 0), 
      interventionDisc: (selectedDiscounts.some((opt) => opt.value === "INTERVENTION") ? finalData.INTERVENTION : 0), 
      exchangeScrap: (selectedDiscounts.some((opt) => opt.value === "EXCHANGE") ? finalData.EXCHANGE : 0), 
      addExcDisc: addExc, 
      corpTop10Disc: (selectedDiscounts.some((opt) => opt.value === "CORPORATE TOP 10") ? finalData["CORPORATE TOP 10"] : 0), 
      corpTop20Disc: (selectedDiscounts.some((opt) => opt.value === "CORPORATE TOP 20") ? finalData["CORPORATE TOP 20"] : 0), 
      solarDisc:((corpOffer === "SOLER") ? finalData.SOLER : 0), 
      MSMEDisc: ((corpOffer === "MSME") ? finalData.MSME : 0), 
      corpOfferToggle: (finalData[corpOffer] > 0 ? true : false),
      gridDisc: (selectedDiscounts.some((opt) => opt.value === "GRID") ? finalData.GRID : 0), 
      addDisc: addDisc, 
      ICEtoEV: (loyaltyType == 'ICE to EV' && finalData[loyaltyType]), 
      EVtoEV: (loyaltyType == 'EV to EV' && finalData[loyaltyType]), 
      loyalty: (!loyalty || loyalty == 0 ? false : true), 
      billingPrice: finalData.ESP - totalDisc, 
      tcs: tcs, 
      fasttag: finalData.FastTag, 
      cod: (scrap ? 30000 : 0), 
      rtoType: rto, 
      rtoAmt: finalData[rto], 
      mudflap: (selectedAcc.some((opt) => opt.label === "Mudflap") ? selectedAcc.find((opt) => opt.label === "Mudflap").value : 0), 
      uniMatting: (selectedAcc.some((opt) => opt.label === "Universal Matting") ? selectedAcc.find((opt) => opt.label === "Universal Matting").value : 0), 
      seatCover: (selectedAcc.some((opt) => opt.label === "Seat Cover") ? selectedAcc.find((opt) => opt.label === "Seat Cover").value : 0), 
      doorVisor: (selectedAcc.some((opt) => opt.label === "Door Visor") ? selectedAcc.find((opt) => opt.label === "Door Visor").value : 0), 
      doorEdge: (selectedAcc.some((opt) => opt.label === "Door Edge Guard") ? selectedAcc.find((opt) => opt.label === "Door Edge Guard").value : 0), 
      bsm: (selectedAcc.some((opt) => opt.label === "BSM") ? selectedAcc.find((opt) => opt.label === "BSM").value : 0), 
      scuffPlate: (selectedAcc.some((opt) => opt.label === "Scuff Plate") ? selectedAcc.find((opt) => opt.label === "Scuff Plate").value : 0), 
      sideStep: (selectedAcc.some((opt) => opt.label === "Side Step") ? selectedAcc.find((opt) => opt.label === "Side Step").value : 0), 
      mat7D:(selectedAcc.some((opt) => opt.label === "7 D Mat") ? selectedAcc.find((opt) => opt.label === "7 D Mat").value : 0), 
      trunkMat: (selectedAcc.some((opt) => opt.label === "Trunk Mat") ? selectedAcc.find((opt) => opt.label === "Trunk Mat").value : 0), 
      perfume: (selectedAcc.some((opt) => opt.label === "Perfume") ? selectedAcc.find((opt) => opt.label === "Perfume").value : 0), 
      ganeshji: (selectedAcc.some((opt) => opt.label === "Ganesh Ji") ? selectedAcc.find((opt) => opt.label === "Ganesh Ji").value : 0), 
      accTotal: accTotal, 
      inc: finalData.Insurance, 
      rsa: (selectedInsurance.some((opt) => opt.value === "RSA") ? finalData["RSA"] : 0), 
      keyRep: (selectedInsurance.some((opt) => opt.value === "Key Replacement") ? finalData["Key Replacement"] : 0), 
      engineProtect: (selectedInsurance.some((opt) => opt.value === "Engine Protection") ? finalData["Engine Protection"] : 0), 
      rti: (selectedInsurance.some((opt) => opt.value === "RTI") ? finalData["RTI"] : 0), 
      tyreNcover: (selectedInsurance.some((opt) => opt.value === "Tyre and Alloy Cover") ? finalData["Tyre and Alloy Cover"] : 0), 
      consumables: (selectedInsurance.some((opt) => opt.value === "Consumables") ? finalData["Consumables"] : 0), 
      personalBelong: (selectedInsurance.some((opt) => opt.value === "Personal Belongings") ? finalData["Personal Belongings"] : 0), 
      batteryP: (selectedInsurance.some((opt) => opt.value === "Battery Protection") ? finalData["Battery Protection"] : 0), 
      incTotal: totalAddOns + finalData.Insurance, 
      ewType: ew, 
      vasType: selectedVas ? selectedVas.label : "", 
      ew: finalData[ew], 
      vas: selectedVas ? selectedVas.value : 0, 
      grandTotal: totalESP, };

      console.log(Qdata);

      try {
        setLoading(true);
        const response = await axios.post("http://localhost:3000/generate-pdf", Qdata, {
          responseType: "blob", // Important to receive file as a blob
        });
  
        // Create a URL for the file
        const pdfBlob = new Blob([response.data], { type: "application/pdf" });
        const pdfUrl = window.URL.createObjectURL(pdfBlob);
  
        // Create a download link
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.setAttribute("download", "Quotation.pdf");
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (error) {
        console.error("Error generating PDF", error);
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="m-auto w-full max-w-4xl p-4">
  <h2 className="text-2xl font-semibold text-center mb-6">Test form for Quotation</h2>
  
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
          onChange={dataBasedOnYearModelAndFuel}
          className="w-full p-2 border border-gray-300 rounded-lg"
        >
        <option value="">Choose fuel type</option>
        {getFuel.map((f) => (
          <option value={f} key={f}>
            {f}
          </option>
        ))}
      </select>
    </div>

    <div className="space-y-2">
      <label className="block text-lg">Variant:</label>
      <select
        name="selectedVariant"
        onChange={(e) => setVariant(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-lg"
        //disabled={!getFuel.length} // Disable fuel select until data is available
      >
        <option value="">Choose Variant</option>
        {getVariant.map((f) => (
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
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Object.keys(finalData).map((key, i) => (
            <>
              {(i >= 20 && i<= 26) ?
                i == 20 &&
                  <>
                    <div>Select Insurance Add-ons:</div>
                    <Select
                      options={Object.keys(finalData)
                        .filter((key, i) => (i >= 20 && i <= 26))
                        .map((key) => ({ value: key, label: key }))}
                      isMulti
                      value={selectedInsurance}
                      onChange={handleInsurance}
                      className="w-full p-1 rounded-lg"
                    />
                      <div>Insurance Total:</div>
                      <div className="w-full p-2 border border-gray-300 rounded-lg">
                        {totalAddOns + finalData.Insurance}
                      </div>
                      <div>TCS:</div>
                      <div className="w-full p-2 border border-gray-300 rounded-lg">
                        {tcs = (finalData.ESP - totalDisc) > 1000000 ? (finalData.ESP - totalDisc) * 0.01 : 0}
                      </div>
                  </>
                :
                (i >=5 && i<= 15) ?
                i == 5 &&
                  <>
                    {(color.length > 0) && 
                    <>
                    <div>Color:</div>
                      <Select
                      options={color}
                      isClearable
                      onChange={handleColor}
                      className="w-full p-1 rounded-lg"
                      />
                      </>}
                    <div>Select Discount Type:</div>
                    <Select
                      options={[...discounts.filter(x => finalData[x.value] > 0), (finalData['MSME'] || finalData['SOLER']) ? { value: 'CORPORATE OFFER', label: 'Corporate Offer' } : { value: 'None', label: 'None' }].filter(x => x.value != "None")}
                      isMulti
                      value={selectedDiscounts}
                      onChange={handleDiscount}
                      className="w-full p-1 rounded-lg"
                    />
                    {(selectedDiscounts.some((opt) => opt.value === "EXCHANGE") && fuel == 'Electric') &&
                  <>
                    <div>Additional Exchange: </div>
                    <Select
                      options={[{value: true, label: 'Yes' }, { value: false, label: 'No' }]}
                      onChange={handleAddExch}
                      className="w-full p-1 rounded-lg"
                    />
                    <div>Loyalty Bonus: </div>
                    <Select
                      options={[{value: "ICE to EV", label: 'ICE to EV' }, { value: "EV to EV", label: 'EV to EV' }, { value: "N/A", label: 'N/A'}]}
                      onChange={handleLoyalty}
                      className="w-full p-1 rounded-lg"
                    />
                  </>}
                  {selectedDiscounts.some((opt) => opt.value === "CORPORATE OFFER") &&
                  <>
                    <div>Corporate Offer: </div>
                    <Select
                      options={corpOfferOptions}
                      onChange={handleCorpOffer}
                      className="w-full p-1 rounded-lg"
                    />
                  </>}
                    <div>Additional Discount:</div>
                      <input className="w-full p-2 border border-gray-300 rounded-lg" 
                      type="number"
                      value={addDisc}
                      onChange={handleAddDisc}
                      />
                      <div>SSS:</div>
                      <input className="w-full p-2 border border-gray-300 rounded-lg" 
                      type="number"
                      value={sss}
                      onChange={handleSss}
                      />
                      <div>Total Discount:</div>
                      <div className="w-full p-2 border border-gray-300 rounded-lg">
                        {totalDisc}
                      </div>
                      <div>ESP after Discount:</div>
                      <div className="w-full p-2 border border-gray-300 rounded-lg">
                        {finalData.ESP - totalDisc}
                      </div>
                  </>
                  :
                  (i >=16 && i<= 18) ?
                  i == 16 &&
                  <>
                    <div>RTO Type: </div>
                    <Select
                      options={rtoOptions.filter(x => finalData[x.value] > 0)}
                      onChange={handleRto}
                      defaultValue={{ value: 'RTO', label: 'Normal RTO' }}
                      className="w-full p-1 rounded-lg"
                    />
                    <div>RTO Amount: </div>
                      <div className="w-full p-2 border border-gray-300 rounded-lg">
                        {finalData[rto]}
                      </div>
                    {(selectedDiscounts.some((opt) => opt.value === "EXCHANGE") && fuel == 'Electric') &&
                    <>
                      <div>Scrap by: </div>
                      <Select
                      isClearable
                        options={[{value: true, label: 'Dealer' }, { value: false, label: 'Self' }]}
                        onChange={(selected) => {setScrap(selected && selected.value)}}
                        className="w-full p-1 rounded-lg"
                      />
                    </>
                    }
                  </>
                  :
                  (i >=27 && i<= 29) ?
                  i ==27 &&
                  <>
                  <div>EW Type: </div>
                    <Select
                      isClearable
                      options={ewOptions.filter(x => finalData[x.value] > 0)}
                      onChange={handleEw}
                      className="w-full p-1 rounded-lg"
                    />
                    <div>EW Amount: </div>
                      <div className="w-full p-2 border border-gray-300 rounded-lg">
                        {finalData[ew]}
                      </div>
                      <div>Accessories: </div>
                    <Select
                      options={accessories.filter(x => x.value > 0)}
                      isMulti
                      onChange={handleAccessories}
                      className="w-full p-1 rounded-lg"
                    />
                    <div>Accessories Amount: </div>
                      <div className="w-full p-2 border border-gray-300 rounded-lg">
                        {accTotal}
                      </div>
                      <div>VAS Type: </div>
                      <Select
                      isClearable
                      options={vasOptions}
                      onChange={handleVas}
                      className="w-full p-1 rounded-lg"
                    />
                    <div>VAS Amount: </div>
                      <div className="w-full p-2 border border-gray-300 rounded-lg">
                        {selectedVas ? selectedVas.value : 0}
                      </div>
                      <div>HPN: </div>
                      <Select
                      options={hpnOptions}
                      onChange={handleHpn}
                      value={selectedHpn}
                      className="w-full p-1 rounded-lg"
                    />
                  </> :
                <>
                  <div key={i}>{key} :</div>
                  <div className="w-full p-2 border border-gray-300 rounded-lg">{finalData[key]}</div>
                  {i == 32 && <>
                  <div>Total Price:</div>
                  <div className="w-full p-2 border border-gray-300 rounded-lg">{ totalESP = finalData.ESP - totalDisc + (finalData[rto] ? finalData[rto] : 0) + totalAddOns + finalData.Insurance + tcs + (finalData[ew] ? finalData[ew] : 0) + accTotal + (selectedVas ? selectedVas.value : 0) + finalData.AMC + finalData.RSA + finalData.FastTag + (scrap ? 30000 : 0)
                                                                                /*console.log(finalData.ESP, totalDisc, (finalData[rto] ? finalData[rto] : 0), totalAddOns, finalData.Insurance, tcs, (finalData[ew] ? finalData[ew] : 0), accTotal , (selectedVas ? selectedVas.value : 0) , finalData.AMC , finalData.RSA , finalData.FastTag)*/}</div> 
                  <button className="w-full py-2 mt-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600" onClick={generatePDF}>
                    Submit
                  </button></>}
                </>}
            </>
          ))}
        </div>
        
  </div>
</div>
  );
};

export default quotationPage;
