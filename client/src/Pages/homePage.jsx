import { Link } from "react-router";

const homePage = (req, res) => {
 return (
  <>
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-4xl w-full">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
          Akar Home Page
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to='/stock-sheet'>
            <button
              type="button"
              className="w-full py-3 px-6 text-lg font-semibold rounded-lg border border-transparent bg-blue-500 text-white hover:bg-blue-600 transition ease-in-out duration-300"
            >
              Stock Sheet
            </button>
          </Link>
          <Link to='/scheme-sheet'>
            <button
              type="button"
              className="w-full py-3 px-6 text-lg font-semibold rounded-lg border border-transparent bg-green-500 text-white hover:bg-green-600 transition ease-in-out duration-300"
            >
              Scheme Sheet
            </button>
          </Link>
          <Link to='/quotation'>
            <button
              type="button"
              className="w-full py-3 px-6 text-lg font-semibold rounded-lg border border-transparent bg-purple-500 text-white hover:bg-purple-600 transition ease-in-out duration-300"
            >
              Quotation
            </button>
          </Link>
        </div>

        {/* The last button placed just below the other three buttons on large screens */}
        <div className="mt-6 lg:mt-8 flex justify-center
         align-center lg:block hidden">
          <Link to='/quotation'>
            <button
              type="button"
              className="w-full py-3 px-6 text-lg font-semibold rounded-lg border border-transparent bg-purple-500 text-white hover:bg-purple-600 transition ease-in-out duration-300"
            >
              All Quotation
            </button>
          </Link>
        </div>
      </div>
    </div>

    {/* On smaller screens, make it fixed at the bottom */}
    <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white p-4 shadow-lg">
      <div className="flex justify-center">
        <Link to='/all-quotation'>
          <button
            type="button"
            className="w-xs py-3 px-6 text-lg font-semibold rounded-lg border border-transparent bg-yellow-500 text-white hover:bg-purple-600 transition ease-in-out duration-300"
          >
            All Quotation
          </button>
        </Link>
      </div>
    </div>
  </>
);

}

export default homePage;
