function ZoneContent({responseData}){
    return (
    <div className="overflow-x-auto mt-6">
    <table className="min-w-full table-auto border-collapse">
      <thead>
        <tr className="bg-blue-500">
          {/* <th className="border border-solid p-2 text-white">YEAR</th>
          <th className="border border-solid p-2 text-white">MODEL</th>
          <th className="border border-solid p-2 text-white">FUEL</th> */}
          <th className="border border-solid md:p-2 p-1 text-[12px] md:text-sm text-white">Dealer</th>
          <th className="border border-solid md:p-2 p-1 text-[12px] md:text-sm text-white">City</th>
          <th className="border border-solid md:p-2 p-1 text-[12px] md:text-sm text-white">Age</th>
          <th className="border border-solid md:p-2 p-1 text-[12px] md:text-sm text-white">Varient</th>
          <th className="border border-solid md:p-2 p-1 text-[12px] md:text-sm text-white">Color</th>
          <th className="border border-solid md:p-2 p-1 text-[12px] md:text-sm text-white">Enquiry</th>
        </tr>
      </thead>
      <tbody>
        {responseData.map((row, rowIndex) => (
          <tr key={rowIndex} className="hover:bg-gray-100 text-[14px] md:text-lg">
            {row.map((cell, cellIndex) => (
              <td key={cellIndex} className="border border-solid p-2">
                {cell}
              </td>
            ))}
            <td className="border border-solid p-2">
              <button className="w-full px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">
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