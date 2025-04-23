import React, { useEffect, useRef, useState } from "react";
import Lnavbar from "../components/L_navbar";
import Footer from "../components/footer";
import DefaultProfilePic from "../assets/DefaultProfilePic.jpg";
import { supabase } from "../supabaseClient.jsx";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";

function UserProfile() {

  const hiddenFileInput = useRef(null);
  const [profileImageURL, setProfileImageURL] = useState(); //Current pfp of user
  const [userID, setUserID] = useState("");
  const [newProfileImage, setNewProfileImage] = useState(null); //New pfp of user, to be uploaded
  const [fileName, setFileName] = useState("No file chosen"); // Track of current chosen file name
  const [profileExistBoolean, setprofileExistBoolean] = useState(false);

  //Upload CV
  const [portfolioFileName, setPortfolioFileName] = useState("");
  const portfolioFileInput = useRef(null);

  const handlePortfolioChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPortfolioFileName(file.name);
    }
  };

  const mockSkillDatabase = ["JavaScript", "React", "Tailwind CSS"];
  // const mockSkillDatabase = [];

  useEffect(() => {
    getUserId();
    console.log(userID);
    getCurrentProfilePic();
  }, [userID, newProfileImage]);

  // Programatically click the hidden file input element
  // when the Button component is clicked
  const handleClick = (event) => {
    hiddenFileInput.current.click();
  }; // Call a function (passed as a prop from the parent component)

  // to handle the user-selected file
  async function handleChange(e) {
    const fileUploaded = e.target.files[0];
    if (fileUploaded) {
      setFileName(fileUploaded.name); // Update the span text with file name
      setNewProfileImage(e.target.files[0]);
    } else {
      setFileName("No file chosen"); // Reset if no file is selected
    }
  }


  async function updateUserProfileURL() {
    try {
      const { data: imageList, error } = await supabase.storage
          .from('user-profile-image')
          .list(userID + '/', {
            limit: 1,
            offset: 0
          });

      if (error) {
        alert(error.message);
        return;

      }

      if (imageList && imageList.length > 0 && imageList[0].name !== "placeholder.txt") {
        const { data: urlData } = supabase.storage
            .from('user-profile-image')
            .getPublicUrl(`${userID}/${imageList[0].name}`);

        const publicUrl = urlData.publicUrl;

        const response = await fetch(`http://localhost:5000/update_user`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userID: userID,
            userPicURL: publicUrl // <--- Use freshly retrieved URL here
          })
        });

        if (response.ok) {
          setProfileImageURL(publicUrl); // Update the state after successful update
          alert("Updated profile URL");
        }
      } else {
        setprofileExistBoolean(false);
      }
    } catch (error) {
      console.error("Error updating profile URL:", error);
    }
  }

  async function uploadProfileImage() {

    await removeAllItemInFolder();
    const { data, error } = await supabase.storage
      .from("user-profile-image")
      .upload(userID + "/" + uuidv4(), newProfileImage);

    if (data) {
      setNewProfileImage(null);
      setFileName("No file chosen");
      // Wait a moment to allow the upload to propagate
      setTimeout(async () => {
        await updateUserProfileURL(); // now fetch new URL after small delay
      }, 1000); // try with 1000ms (1 sec), tweak if needed
    }
    if (error) {
      alert(error.message);
    }
  }

  async function removeAllItemInFolder() {
    //Remove all image inside folder as it should only have 1 image at a time
    const {data: list, errorGetList} = await supabase.storage
        .from('user-profile-image')
        .list(userID + '/');
    if (errorGetList) {
      alert(errorGetList.message)
    }

    const filesToRemove = list.map((x) => `${userID}/${x.name}`);
    const { data, errorRemove } = await supabase.storage
        .from('user-profile-image')
        .remove(filesToRemove);
    if (errorRemove) { alert(errorRemove.message) }

  }

  //To get current profile image
  async function getCurrentProfilePic() {
    const { data: imageList, error } = await supabase.storage
      .from("user-profile-image")
      .list(userID + "/", {
        limit: 1,
        offset: 0,
      });
    if (error) {
      alert(error.message);
    }
    if (
      !!imageList ||
      imageList[0].name === null ||
      imageList[0].name === "placeholder.txt"
    ) {
      //console.log("Profile Image doesn't exist")
      setprofileExistBoolean(false);
    }
    if (imageList && imageList.length > 0 && imageList[0].name !== "placeholder.txt") {
      const {data} = supabase.storage
          .from('user-profile-image')
          .getPublicUrl(`${userID}/${imageList[0].name}`)
      setProfileImageURL(data.publicUrl)
      setprofileExistBoolean(true);
    }
  }

  const getUserId = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user !== null) { setUserID(user.id); }
      else { setUserID('') }
    }
    catch (e) {console.log(e)}
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Lnavbar />
      <div className="w-full max-w-5xl mx-auto px-4 py-4 space-y-10 bg-white shadow-md rounded-lg">
        {/* Account Settings */}
        <div className="flex flex-col space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Account Settings</h2>
          <div className="flex flex-row space-x-8">
            {/* Picture Box (a) */}
            <div className="flex flex-col items-center border-2 border-orange-500 rounded-md p-4 shadow">
              {profileExistBoolean ? (
                <img
                  src={profileImageURL}
                  className="w-full h-full object-cover rounded"
                  style={{
                    width: "200px",
                    height: "200px",
                    objectFit: "cover",
                  }} //Force image to fit in 200x200
                />
              ) : (
                <img
                  src={DefaultProfilePic}
                  className="w-full h-full object-cover rounded"
                  style={{
                    width: "200px",
                    height: "200px",
                    objectFit: "cover",
                  }} //Force image to fit in 200x200
                />
              )}

              {/* Upload Image button */}
              {/*This is the real button*/}
              <input
                type="file"
                id="upload-photo"
                onChange={(e) => handleChange(e)}
                ref={hiddenFileInput}
                style={{ display: "none" }} // Make the file input element invisible
              />

              {/*This is the fake (pretty) button*/}
              <button
                //htmlFor="upload-photo"
                className="mt-5 text-sm text-white bg-gray-700 hover:bg-gray-800 px-4 py-2 rounded"
                onClick={handleClick}
              >
                Choose Photo
              </button>

              {newProfileImage ? (
                <label
                  //htmlFor="upload-photo"
                  className="mt-5 text-sm text-white bg-orange-500 hover:bg-gray-800 px-4 py-2 rounded"
                  onClick={uploadProfileImage}
                >
                  Upload Photo
                </label>
              ) : (
                <label
                  //htmlFor="upload-photo"
                  className="mt-5 text-sm text-white bg-orange-500 hover:bg-gray-800 px-4 py-2 rounded"
                >
                  No Image To Upload
                </label>
              )}

              <span id="file-chosen" className="mt-4 text-gray-600">
                {fileName}
              </span>
            </div>

            {/* User Info Form (b) */}
            <div className="flex flex-col flex-grow space-y-4">
              <div>
                <label className=" text-sm font-medium text-gray-700 mb-1">
                  Full name
                </label>
                <div className="flex space-x-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="w-1/2 px-3 py-2 border border-slate-800 rounded"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="w-1/2 px-3 py-2 border border-slate-800 rounded"
                  />
                </div>
              </div>
              <div>
                <label className=" text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full px-3 py-2 border border-slate-800 rounded"
                />
              </div>
              <div>
                <label className=" text-sm font-medium text-gray-700 mb-1">
                  Phone number
                </label>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full px-3 py-2 border border-slate-800 rounded"
                />
              </div>
              <div>
                <label className=" text-sm font-medium text-gray-700 mb-1">
                  Date of birth
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-slate-800 rounded"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <h2 className="text-xl font-bold text-gray-800">User Education</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                University
              </label>
              <input
                type="text"
                placeholder="Name of Institution"
                className="w-full px-3 py-2 border border-slate-800 rounded"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Degree
              </label>
              <input
                type="text"
                placeholder="e.g. BSc Computer Science"
                className="w-full px-3 py-2 border border-slate-800 rounded"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Curriculum
              </label>
              <input
                type="text"
                placeholder="Major / Specialization"
                className="w-full px-3 py-2 border border-slate-800 rounded"
              />
            </div>
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-slate-800 rounded"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-slate-800 rounded"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <h2 className="text-xl font-bold text-gray-800">User Experience</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Organization
              </label>
              <input
                type="text"
                placeholder="Company or Organization"
                className="w-full px-3 py-2 border border-slate-800 rounded"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Position
              </label>
              <input
                type="text"
                placeholder="Job Title / Role"
                className="w-full px-3 py-2 border border-slate-800 rounded"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                placeholder="City / Country"
                className="w-full px-3 py-2 border border-slate-800 rounded"
              />
            </div>
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-slate-800 rounded"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-slate-800 rounded"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <h2 className="text-xl font-bold text-gray-800">User Skill</h2>

          {(() => {
            if (mockSkillDatabase.length === 0) {
              return (
                <h1 className="text-sm text-center text-gray-500">
                  Upload Portfolio to get the list of skill
                </h1>
              );
            } else {
              return (
                <div className="flex flex-wrap gap-2">
                  {mockSkillDatabase.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm bg-orange-500 text-white rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              );
            }
          })()}
        </div>

        <div className="flex flex-col space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Upload Portfolio</h2>
          <div className="flex flex-col items-center justify-center w-full border-2 border-dashed border-orange-300 rounded-xl p-6 bg-orange-50">
            {/* Hidden File Input */}
            <input
              type="file"
              id="portfolio-upload"
              className="hidden"
              onChange={(e) => handlePortfolioChange(e)}
              ref={portfolioFileInput}
            />

            <button
              onClick={() => portfolioFileInput.current.click()}
              className="flex flex-col items-center space-y-2"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-orange-200 rounded-full">
                <FontAwesomeIcon
                  icon={faUpload}
                  className="text-orange-700 text-xl"
                />
              </div>
              <span className="text-orange-700 font-medium">Upload File</span>
            </button>

            {/* File Name */}
            {portfolioFileName && (
              <p className="mt-4 text-sm text-gray-600">{portfolioFileName}</p>
            )}
          </div>
        </div>
        <div className="flex justify-end space-x-4 mt-2">
          <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
            Save Changes
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default UserProfile;
