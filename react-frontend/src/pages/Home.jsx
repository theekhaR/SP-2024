import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/footer"
import {Link} from "react-router-dom";

const token = localStorage.getItem("token");
const Home = () => {
  return (
    <div className="flex flex-col bg-neutral-50 ">
      <Navbar />
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 my-auto mt-8 mb-8 md:grid-cols-2 xl:gap-14 md:gap-5">
          <div className="flex flex-col justify-center col-span-1 text-center lg:text-start">
            <h1 className="mb-4 text-4xl font-extrabold leading-tight lg:text-5xl text-dark-grey-900">
              Discover Your Next Career Move with Ease
            </h1>
            <p className="mb-6 text-base font-normal leading-7 lg:w-3/4 text-grey-900">
              Explore exciting job opportunities that fit your skills and
              passion, or connect with top recruiters to find the best talent
              for your organization.
            </p>
            <div className="flex flex-col items-center gap-4 lg:flex-row">
              <Link className="flex items-center py-4 text-sm font-bold text-white px-7 bg-slate-800 hover:bg-slate-700 focus:ring-4 focus:ring-blue-200 transition duration-300 rounded-xl"
              to={`/listing`}>
                Find Jobs Now
              </Link>
              <Link className="flex items-center py-4 text-sm font-bold text-white px-7 bg-[#cf5c2e] hover:bg-[#d96a3d] focus:ring-4 focus:ring-orange-200 transition duration-300 rounded-xl"
              to={`/company`}>
                Hire Top Talent
              </Link>
            </div>
          </div>
          <div className="items-center justify-end hidden col-span-1 md:flex">
            <img
              className="w-4/5 rounded-md"
              src="https://raw.githubusercontent.com/Loopple/loopple-public-assets/main/motion-tailwind/img/header-1.png"
              alt="header image"
            />
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Home;
