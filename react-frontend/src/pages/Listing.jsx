import React from "react";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";

function Listing() {
  return (
    <div>
      <Navbar />
      <div className="flex">
        {/* List section */}
        <div>
          {/* List header */}
          <header className="z-4">Top Jobs suggestion for you</header>
          {/* List */}
          <div>
            <div>
              <a>1</a>
            </div>
            <div>
              <a>2</a>
            </div>
            <div>
              <a>3</a>
            </div>
          </div>
        </div>
        {/* Detail */}
        <div>Test</div>
        {/* Apply menu */}
        <div className="bg-white p-5 rounded-lg shadow-md mt-6">
          <p className="text-gray-500 text-sm mb-2 text-center text-orange-500">
            1
          </p>

          <div className="space-y-4">
            <div className="flex justify-between text-gray-700">
              <span>Duration:</span> <span>1</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Position Level:</span> <span>1</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Work experience:</span> <span>1</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Location:</span> <span>1</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <button className="w-full bg-orange-500 text-white font-semibold py-2 rounded-lg hover:bg-orange-600">
              Apply For Position
            </button>
            <button className="w-full border border-orange-500 text-orange-500 font-semibold py-2 rounded-lg hover:bg-orange-50">
              Have A Conversation
            </button>
            <button className="w-full text-gray-700 border border-gray-300 py-2 rounded-lg hover:bg-gray-100">
              Add To Bookmark
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Listing;
