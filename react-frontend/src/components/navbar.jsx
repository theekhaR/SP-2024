import React from "react";

function Navbar() {
  return (
    <header className="flex shadow-md py-4 px-4 sm:px-10 bg-slate-800 font-[sans-serif] min-h-[70px] tracking-wide sticky top-0 z-50">
      <div className="flex items-center justify-evenly w-full">
        <a href="/">
          <h3 className="text-2xl text-[#cf5c2e] font-semibold">Logo</h3>
        </a>

        <div
          id="collapseMenu"
          className="ml-36 lg:!block max-lg:before:fixed max-lg:before:bg-black max-lg:before:opacity-50 max-lg:before:inset-0 max-lg:before:z-50"
        >
          {/* Button for relative  */}
          {/* <button
            id="toggleClose"
            className="lg:hidden fixed top-2 right-4 z-[100] rounded-full bg-white w-9 h-9 flex items-center justify-center border"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5 fill-black"
              viewBox="0 0 320.591 320.591"
            >
              <path
                d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                data-original="#000000"
              ></path>
              <path
                d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                data-original="#000000"
              ></path>
            </svg>
          </button> */}

          <ul className=" hidden lg:flex gap-x-5 max-lg:space-y-3 max-lg:fixed max-lg:bg-white max-lg:w-1/2 max-lg:min-w-[300px] max-lg:top-0 max-lg:left-0 max-lg:p-6 max-lg:h-full max-lg:shadow-md max-lg:overflow-auto z-50">
            <li className="mb-6 hidden max-lg:block">
              <a href="/">
                <h3 className="text-2xl text-[#cf5c2e] font-semibold">Logo</h3>
              </a>
            </li>
            <li className="max-lg:border-b border-gray-300 max-lg:py-3 px-3">
              <a
                href="/"
                className="hover:text-[#FF6636] text-[#8C94A3] block font-semibold text-[15px] relative cursor-pointer before:bg-[#FF6636] before:absolute before:-bottom-1 before:block before:h-[2px] before:w-full before:origin-bottom-right before:scale-x-0 before:transition before:duration-300 before:ease-in-out hover:before:origin-bottom-left hover:before:scale-x-100"
              >
                Home
              </a>
            </li>
            <li className="max-lg:border-b border-gray-300 max-lg:py-3 px-3">
              <a
                href="/listing"
                className="hover:text-[#FF6636] text-[#8C94A3]  block font-semibold text-[15px] relative cursor-pointer before:bg-[#FF6636] before:absolute before:-bottom-1 before:block before:h-[2px] before:w-full before:origin-bottom-right before:scale-x-0 before:transition before:duration-300 before:ease-in-out hover:before:origin-bottom-left hover:before:scale-x-100"
              >
                Find Jobs
              </a>
            </li>
            <li className="max-lg:border-b border-gray-300 max-lg:py-3 px-3">
              <a
                href="/company"
                className="hover:text-[#FF6636] text-[#8C94A3] block font-semibold text-[15px] relative cursor-pointer before:bg-[#FF6636] before:absolute before:-bottom-1 before:block before:h-[2px] before:w-full before:origin-bottom-right before:scale-x-0 before:transition before:duration-300 before:ease-in-out hover:before:origin-bottom-left hover:before:scale-x-100"
              >
                Company Side
              </a>
            </li>
          </ul>
        </div>

        <div className="flex max-lg:ml-auto space-x-4">
          <a href="/register">
            <button className="px-4 py-2 text-sm rounded-full font-bold text-white border-2 border-[#cf5c2e] bg-[#cf5c2e] transition-all ease-in-out duration-300 hover:bg-transparent hover:text-[#FF6636]">
              Register
            </button>
          </a>
          <a href="/login">
            <button className="px-4 py-2 text-sm rounded-full font-bold text-gray-500 border-2 border-gray-50  bg-gray-50 transition-all ease-in-out duration-300 hover:bg-transparent hover:text-[#FF6636]">
              Login
            </button>
          </a>

          {/* Button for relative  */}
          {/* <button id="toggleOpen" className="lg:hidden">
            <svg
              className="w-7 h-7"
              fill="#000"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </button> */}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
