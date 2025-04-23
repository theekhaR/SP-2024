import React from "react";
import { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

function main() {
  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-7xl mx-auto">
        {/* Search and Filter */}
        <div className="flex justify-between items-center mb-6">
          <button className="border px-4 py-2 rounded-lg">Filter</button>
          <input
            type="text"
            placeholder="Search..."
            className="border px-4 py-2 rounded-lg w-1/3"
          />
          <p>Sort by..</p>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="border rounded-lg overflow-hidden shadow-md"
            >
              <div className="h-40 bg-gray-300"></div>{" "}
              <div className="p-4">
                <h3 className="text-lg font-semibold"> Title</h3>
                <p className="text-sm text-gray-600">Category</p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-red-500 font-bold">$20</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default main;
