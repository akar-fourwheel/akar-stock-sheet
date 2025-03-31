function ZoneContent({finalData}){
    return (
    <div className="overflow-x-auto mt-6">
    <table className="min-w-full table-auto border-collapse">
      <thead>
        <tr className="bg-sky-400">
          {/* <th className="border border-solid p-2 text-white">YEAR</th>
          <th className="border border-solid p-2 text-white">MODEL</th>
          <th className="border border-solid p-2 text-white">FUEL</th> */}
          <th className="border border-solid p-2 text-white">Dealer</th>
          <th className="border border-solid p-2 text-white">City</th>
          <th className="border border-solid p-2 text-white">Age</th>
          <th className="border border-solid p-2 text-white">Varient</th>
          <th className="border border-solid p-2 text-white">Color</th>
          <th className="border border-solid p-2 text-white">Enquiry</th>
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
                Contact
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
    )
}

export default ZoneContent;