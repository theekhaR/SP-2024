import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import Pic from "../assets/Tech.png";

const Register = () => {
  //To do
  //Make it so that the "User created" pop up in the website itself, not as browser alert

  const [firstNameState, setFirstname] = React.useState("");
  const [lastnameState, setLastname] = React.useState("");
  const [passwordState, setPassword] = React.useState("");
  const [passwordConfirmState, setPasswordConfirm] = React.useState("");
  const [emailState, setEmail] = React.useState("");

  const handleCreateUserRequest = () => {
    event.preventDefault();

    const opts = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify({
        userEmail: emailState,
        userPassword: passwordState,
        userFirstName: firstNameState,
        userLastName: lastnameState,
      }),
    };
    try {
      if (passwordState !== passwordConfirmState) {
        alert("Passwords do not match");
        return;
      }
      fetch("http://localhost:5000/create_user", opts) //DO NOT FORGET TO CHANGE TO DYNAMIC
        .then((resp) => {
          if (resp.status === 201) {
            return resp.json();
          } else alert(resp.statusText);
        })
        .then((data) => {
          console.log("Backend returned:", data);
          // Redirect to a success page or display a message
          alert(data.message); // Show success message
          window.location.href = "/login"; // Redirect to another page
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="flex mt-20">
        {/* Left Section */}
        <div className="hidden lg:flex items-center justify-center flex-1 bg-gray-100">
          <img src={Pic} alt="Illustration" className="w-[700px] h-auto" />
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-1/2 flex items-start justify-center bg-gray-100 py-10">
          <div className="max-w-lg w-full p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Create your account
            </h1>
            <p className="text-sm text-gray-600 text-center mb-6">
              Join to Our Community with all-time access and free
            </p>
            <form action="#" method="POST" className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <div className="flex space-x-4">
                  <input
                    type="text"
                    id="firstname"
                    name="firstname"
                    placeholder="First name.."
                    onChange={(e) => setFirstname(e.target.value)}
                    className="mt-1 p-3 flex-1 border rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                  />
                  <input
                    type="text"
                    id="lastname"
                    name="lastname"
                    placeholder="Last name.."
                    onChange={(e) => setLastname(e.target.value)}
                    className="mt-1 p-3 flex-1 border rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>
              <div>
                {/*<label*/}
                {/*  htmlFor="username"*/}
                {/*  className="block text-sm font-medium text-gray-700"*/}
                {/*>*/}
                {/*  Username*/}
                {/*</label>*/}
                {/*<input*/}
                {/*  type="text"*/}
                {/*  id="username"*/}
                {/*  name="username"*/}
                {/*  placeholder="Username.."*/}
                {/*  className="mt-1 p-3 w-full border rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"*/}
                {/*/>*/}
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  placeholder="Email address"
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 p-3 w-full border rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div className="flex space-x-4">
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
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 p-3 flex-1 border rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="confirm-password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirm-password"
                    name="confirm-password"
                    placeholder="Confirm password"
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    className="mt-1 p-3 flex-1 border rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  name="terms"
                  className="h-4 w-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree with all of your{" "}
                  <a href="#" className="text-orange-500 underline">
                    Terms & Conditions
                  </a>
                </label>
              </div>
              <button
                type="submit"
                onClick={handleCreateUserRequest}
                className="w-full bg-orange-500 text-white p-3 rounded-md hover:bg-orange-600 focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
              >
                Create Account
              </button>
            </form>
            <div className="mt-4 text-sm text-gray-600 text-center">
              <p>
                Already have an account?{" "}
                <a href="/login" className="text-black hover:underline">
                  Login here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
