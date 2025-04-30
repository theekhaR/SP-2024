import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Pic from "../assets/Login.png";
import { supabase } from "../supabaseClient";

function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  //Check if user is already authenticated
  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setAuthenticated(!!session); //convert session into boolean value
      setLoading(false);
    };

    getSession();
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    if (data) {
      console.log(data.session.user.email);
      alert("Login Successfully");
      setEmail("");
      setPassword("");
      window.location.reload();
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut({
      scope: "local",
    });

    if (error) {
      alert(error.message);
      return;
    }
    window.location.reload();
  };

  // When user get in this page, it will have to check authentication first.
  // Process take time, so we add loading page here to prevent the rendering
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl font-semibold">Checking session...</p>
      </div>
    );
  }

  // Check if logged in or not. If logged in, Redirect to Listing

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

            {authenticated ? (
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
                    type="email"
                    id="UserEmail"
                    name="UserEmail"
                    placeholder="Your Email address"
                    required
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
                    required
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
                  onClick={handleLogin}
                  className="w-full bg-orange-500 text-white p-3 rounded-md hover:bg-orange-600 focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                >
                  Sign-in
                </button>
              </form>
            )}
            <div className="mt-4 text-sm text-gray-600 text-center">
              <p>
                Do not have an account?{" "}
                <a href="/Register" className="text-black hover:underline">
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
