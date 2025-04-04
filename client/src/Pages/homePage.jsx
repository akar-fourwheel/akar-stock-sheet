import { Link } from "react-router";
const homePage = (req,res) => {
    return (
        <div>
            <h1>Akar Home Page</h1>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Link to='/stock-sheet'>
              <button
                type="button"
                className={`w-full py-2 px-4 text-lg rounded-lg border border-gray-300 bg-blue-500 text-white cursor-pointer`}
              >
                Stock Sheet
              </button>
              </Link>
              <Link to='/scheme-sheet'>
              <button
                type="button"
                className={`w-full py-2 px-4 text-lg rounded-lg border border-gray-300 bg-blue-500 text-white cursor-pointer`}
              >
                Scheme Sheet
              </button>
              </Link>
              <Link to='/quotation'>
              <button
                type="button"
                className={`w-full py-2 px-4 text-lg rounded-lg border border-gray-300 bg-blue-500 text-white cursor-pointer`}
              >
                Quotation
              </button>
              </Link>
            </div>
        </div>   
    )
}

export default homePage;