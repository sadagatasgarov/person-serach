import React, { useState } from "react";
import axios from "axios";

export default function App() {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const ITEMS_PER_PAGE = 5;

  const handleSearch = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:8080/search", {
        params: {
          name: name || undefined,
          birth_date: birthDate || undefined,
          page,
          limit: ITEMS_PER_PAGE,
        },
      });
      setResults(response.data.results);
      setTotalPages(Math.ceil(response.data.total / ITEMS_PER_PAGE));
      setCurrentPage(page);
    } catch (err) {
      setError("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      handleSearch(newPage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-6 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold text-white mb-6">Person Search</h1>
      <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full transform transition-all hover:scale-105 duration-200">
        <div className="mb-6">
          <label className="block text-gray-700 font-medium text-lg mb-2">Name</label>
          <input
            type="text"
            className="w-full p-3 border-2 border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-medium text-lg mb-2">Birth Date</label>
          <input
            type="date"
            className="w-full p-3 border-2 border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
        </div>
        <button
          onClick={() => handleSearch(1)}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <p className="text-red-500 mt-6 text-lg">{error}</p>}

      <div className="mt-8 w-full max-w-3xl">
        {results.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Results</h2>
            <ul>
              {results.map((person) => (
                <li
                  key={person.id}
                  className="p-6 mb-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-all"
                >
                  <div className="text-xl font-semibold text-gray-700">{person.name}</div>
                  <p className="text-gray-600">{person.birth_date}</p>
                  <p className="text-gray-700 mt-2">{person.characteristics}</p>
                </li>
              ))}
            </ul>
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-5 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-gray-700 text-lg">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-5 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
        {results.length === 0 && !loading && !error && (
          <p className="text-center text-lg text-gray-600 mt-6">No results found.</p>
        )}
      </div>
    </div>
  );
}
