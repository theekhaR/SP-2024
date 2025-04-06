import React from "react";
import Navbar from "../components/Navbar";
import Pic from "../assets/Login.png";

function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const token = localStorage.getItem("token");

  const handleSubmit = () => {
    event.preventDefault();

    const opts = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userEmail: email,
        userPassword: password,
      }),
    };
    try {
      fetch("http://localhost:5000/token", opts) //DO NOT FORGET TO CHANGE TO DYNAMIC
        .then((resp) => {
          if (resp.status === 200) return resp.json();
          else alert(resp.statusText);
        })
        .then((data) => {
          console.log("Backend returned", data);
          localStorage.setItem("token", data.access_token); //Save token to session storage on web
          window.location.reload();
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };
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

            {token && token != "" && token != undefined ? (
              <div className="flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  You are already signed in
                </h1>
                <button
                  type="submit"
                  onClick={handleLogout}
                  className="bg-orange-500 text-white p-3 rounded-md hover:bg-orange-600 focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                >
                  Sign-out
                </button>
              </div>
            ) : (
              //Tell user that you are already login IT WILL DO EITHER [THIS] : [THAT]
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
                    id="UserEmail"
                    name="UserEmail"
                    placeholder="Your Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    id="UserPassword"
                    name="UserPassword"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                  onClick={handleSubmit}
                  className="w-full bg-orange-500 text-white p-3 rounded-md hover:bg-orange-600 focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                >
                  Sign-in
                </button>
              </form>
            )}
            <div className="mt-4 text-sm text-gray-600 text-center">
              <p>
                Didn't have an account?{" "}
                <a href="/register" className="text-black hover:underline">
                  Register here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
