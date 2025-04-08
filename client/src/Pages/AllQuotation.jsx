import React from 'react';

function AllQuotation() {
  const data = [
    { id: 1, salesPerson: "John Doe", customer: "Alice Johnson", phoneNo: "123-456-7890", variant: "Pro Max", pdf: "Link", whatsapp: "Yes" },
    { id: 2, salesPerson: "Jane Smith", customer: "Bob Lee", phoneNo: "234-567-8901", variant: "Ultra", pdf: "Link", whatsapp: "No" },
    { id: 3, salesPerson: "Michael Green", customer: "Charlie Brown", phoneNo: "345-678-9012", variant: "Lite", pdf: "Link", whatsapp: "Yes" },
    { id: 4, salesPerson: "Sarah White", customer: "Diana Prince", phoneNo: "456-789-0123", variant: "Pro", pdf: "Link", whatsapp: "No" },
    { id: 5, salesPerson: "David Black", customer: "Edward Harris", phoneNo: "567-890-1234", variant: "Mini", pdf: "Link", whatsapp: "Yes" },
  ];

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">Dummy Data work in progress</h2>
      <div className="overflow-x-auto">
<table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
  <thead>
    <tr className="bg-gray-100">
      <th className="sm:px-4 sm:py-3 px-1 py-2 text-left text-sm sm:text-base font-medium text-gray-700">Sales_Person</th>
      <th className="sm:px-4 sm:py-3 px-1 py-2 text-left text-sm sm:text-base font-medium text-gray-700">Customer</th>
      <th className="sm:px-4 sm:py-3 px-1 py-2 text-left text-sm sm:text-base sm:w-[500px] font-medium text-gray-700">Phone_Number</th>
      <th className="sm:px-4 sm:py-3 px-1 py-2 text-left text-sm sm:text-base font-medium text-gray-700">Variant</th>
      <th className="sm:px-4 sm:py-3 px-1 py-2 text-left text-sm sm:text-base font-medium text-gray-700">PDF</th>
      <th className="sm:px-4 sm:py-3 px-1 py-2 text-left text-sm sm:text-base font-medium text-gray-700">WhatsApp</th>
    </tr>
  </thead>
  <tbody>
    {data.map((row) => (
      <tr key={row.id} className="border-b hover:bg-gray-50">
        <td className="sm:px-4 sm:py-3 px-1 py-2 text-sm sm:text-base font-medium text-gray-900">{row.salesPerson}</td>
        <td className="sm:px-4 sm:py-3 px-1 py-2 text-sm sm:text-base text-gray-700">{row.customer}</td>
        <td className="sm:px-4 sm:py-3 px-1 py-2 text-sm w-[50px] w-24 sm:text-base text-gray-700">{row.phoneNo}</td>
        <td className="sm:px-4 sm:py-3 px-1 py-2 text-sm sm:text-base text-gray-700">{row.variant}</td>
        <td className="sm:px-4 sm:py-3 px-1 py-2 text-xs sm:text-base text-gray-700">
          <button
            onClick={() => window.open(row.pdf, '_blank')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            aria-label="Open PDF"
          >
            Open
          </button>
        </td>
        <td className="sm:px-4 sm:py-3 px-3 py-2 text-xs text-gray-700">
          <button
            onClick={() => window.location.href = `https://wa.me/${row.phoneNo}`}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            aria-label="Send WhatsApp message"
          >
            WhatsApp
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

      </div>
    </div>
  );
}

export default AllQuotation;
