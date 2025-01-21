import React from "react";
import Navbar from "../components/Navbar";
import Pic from "../assets/Login.png";

function Login() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="flex mt-20">
        {/* Left Section */}
        <div className="hidden lg:flex items-center justify-end  flex-1 bg-gray-100">
          <img src={Pic} alt="Illustration" className="w-[700px] h-auto" />
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-1/2 flex items-start justify-center bg-gray-100 py-10">
          <div className="max-w-lg w-full p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-4xl font-bold text-gray-900 text-center mb-10">
              Sign in to your account
            </h1>
            <form action="#" method="POST" className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Username or Email address"
                  className="mt-1 p-3 w-full border rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Create password"
                  className="mt-1 p-3 w-full border rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  name="terms"
                  className="h-4 w-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  Remember me
                </label>
              </div>
              <button
                type="submit"
                className="w-full bg-orange-500 text-white p-3 rounded-md hover:bg-orange-600 focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
              >
                Sign-in
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
