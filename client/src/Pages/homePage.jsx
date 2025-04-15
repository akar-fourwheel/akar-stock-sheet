import { Link } from "react-router";

const HomePage = (req, res) => {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-4xl w-full">
          <div>
            <img src="./logo.jpg" alt="Logo" className="h-40 mx-auto" />
          </div>
          <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
            Akar Home Page
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/stock-sheet">
              <button
                type="button"
                className="w-full py-3 px-6 text-lg font-semibold rounded-lg border border-transparent bg-blue-500 text-white hover:bg-blue-600 transition ease-in-out duration-300"
              >
                Stock Sheet
              </button>
            </Link>
            <Link to="/scheme-sheet">
              <button
                type="button"
                className="w-full py-3 px-6 text-lg font-semibold rounded-lg border border-transparent bg-green-500 text-white hover:bg-green-600 transition ease-in-out duration-300"
              >
                Scheme Sheet
              </button>
            </Link>
            <Link to="/quotation">
              <button
                type="button"
                className="w-full py-3 px-6 text-lg font-semibold rounded-lg border border-transparent bg-purple-500 text-white hover:bg-purple-600 transition ease-in-out duration-300"
              >
                Quotation
              </button>
            </Link>
          </div>

          {/* <div className="mt-6 lg:mt-8 hidden lg:flex justify-center gap-4">
            <Link to="/quotation-list">
              <button
                type="button"
                className="py-3 px-6 text-lg font-semibold rounded-lg border border-transparent bg-slate-600 text-white hover:bg-slate-500 transition ease-in-out duration-300"
              >
                Quotation List
              </button>
            </Link>
            <Link to="/booking-list">
              <button
                type="button"
                className="py-3 px-6 text-lg font-semibold rounded-lg border border-transparent bg-slate-600 text-white hover:bg-slate-500 transition ease-in-out duration-300"
              >
                Booking List
              </button>
            </Link>
          </div> */}
        </div>
      </div>

      {/* <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white p-4 shadow-lg">
        <div className="flex justify-center gap-4">
          <Link to="/quotation-list">
            <button
              type="button"
              className="py-3 px-6 text-lg font-semibold rounded-lg border border-transparent bg-slate-600 text-white hover:bg-slate-500 transition ease-in-out duration-300"
            >
              Quotation List
            </button>
          </Link>
          <Link to="/booking-list">
            <button
              type="button"
              className="py-3 px-6 text-lg font-semibold rounded-lg border border-transparent bg-slate-600 text-white hover:bg-slate-500 transition ease-in-out duration-300"
            >
              Booking List
            </button>
          </Link>
        </div>
      </div> */}
    </>
  );
};

export default HomePage;
