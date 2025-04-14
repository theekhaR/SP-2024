import React, {useEffect, useRef, useState} from "react";
import Lnavbar from "../components/L_navbar";
import Footer from "../components/footer";
import DefaultProfilePic from "../assets/DefaultProfilePic.jpg";
import {supabase} from "../supabaseClient.jsx";
import { v4 as uuidv4 } from 'uuid';

function UserProfile() {

  const hiddenFileInput = useRef(null);
  const [profileImageURL, setProfileImageURL] = useState(); //Current pfp of user
  const [userID, setUserID] = useState('');
  const [newProfileImage, setNewProfileImage] = useState(null); //New pfp of user, to be uploaded
  const [fileName, setFileName] = useState("No file chosen"); // Track of current chosen file name
  const [profileExistBoolean, setprofileExistBoolean] = useState(false);

  useEffect( () => {
    getUserId();
    console.log(userID)
    getCurrentProfilePic();
  }, [userID, newProfileImage]);


  // Programatically click the hidden file input element
  // when the Button component is clicked
  const handleClick = event => {
    hiddenFileInput.current.click();
  };  // Call a function (passed as a prop from the parent component)

  // to handle the user-selected file
  async function handleChange(e) {
    const fileUploaded = e.target.files[0];
    if (fileUploaded) {
      setFileName(fileUploaded.name); // Update the span text with file name
      setNewProfileImage(e.target.files[0])
    } else {
      setFileName("No file chosen"); // Reset if no file is selected
    }
  }


  async function uploadProfileImage() {

    await removeAllItemInFolder();
    const { data, error } = await supabase.storage.from('user-profile-image')
        .upload(userID + '/' + uuidv4(), newProfileImage);

    if (data){
      setNewProfileImage(null);
      setFileName("No file chosen")
    }
    if (error){
      alert(error.message);
    }
  }

  async function removeAllItemInFolder () {
    //Remove all image inside folder as it should only have 1 image at a time
    const { data:list, errorGetList } = await supabase.storage
        .from('user-profile-image')
        .list(userID + '/');
    if (errorGetList) { alert(errorGetList.message) }

    const filesToRemove = list.map((x) => `${userID}/${x.name}`);
    const { data, errorRemove } = await supabase.storage
        .from('user-profile-image')
        .remove(filesToRemove);
    if (errorRemove) { alert(errorRemove.message) }

  }

  //To get current profile image
  async function getCurrentProfilePic() {
    const { data: imageList , error } = await supabase.storage.from('user-profile-image')
        .list(userID + '/', {
          limit: 1,
          offset: 0
        });
    if (error) { alert(error.message); }
    if ( !!imageList || imageList[0].name === null || imageList[0].name === "placeholder.txt") {
      //console.log("Profile Image doesn't exist")
      setprofileExistBoolean(false)
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
              <div className="flex flex-col items-center border rounded-md p-4 shadow">
                {
                  profileExistBoolean?
                      (
                          <img
                              src= {profileImageURL}
                              className="w-full h-full object-cover rounded"
                              style={{ width: "200px", height: "200px", objectFit: "cover" }} //Force image to fit in 200x200
                          />
                      ):(
                          <img
                              src= {DefaultProfilePic}
                              className="w-full h-full object-cover rounded"
                              style={{ width: "200px", height: "200px", objectFit: "cover" }} //Force image to fit in 200x200
                          />
                      )
                }

                {/* Upload Image button */}
                {/*This is the real button*/}
                <input
                    type="file"
                    id="upload-photo"
                    onChange={(e) => handleChange(e)}
                    ref={hiddenFileInput}
                    style={{display: 'none'}} // Make the file input element invisible
                />

                {/*This is the fake (pretty) button*/}
                <button
                    //htmlFor="upload-photo"
                    className="mt-14 text-sm text-white bg-gray-700 hover:bg-gray-800 px-4 py-2 rounded"
                    onClick={handleClick}
                >
                  Choose Photo
                </button>

                {
                  newProfileImage?
                      (
                          <label
                              //htmlFor="upload-photo"
                              className="mt-14 text-sm text-white bg-orange-500 hover:bg-gray-800 px-4 py-2 rounded"
                              onClick={uploadProfileImage}
                          >
                            Upload Photo
                          </label>
                      ) : (
                          <label
                              //htmlFor="upload-photo"
                              className="mt-14 text-sm text-white bg-orange-500 hover:bg-gray-800 px-4 py-2 rounded"
                          >
                            No Image To Upload
                          </label>
                      )
                }

                <span id="file-chosen" className="text-gray-600">{fileName}</span>

              </div>

              {/* User Info Form (b) */}
              <div className="flex flex-col flex-grow space-y-4">
                <div className="flex space-x-4">
                  <input
                      type="text"
                      placeholder="First Name"
                      className="w-1/2 px-3 py-2 border rounded"
                  />
                  <input
                      type="text"
                      placeholder="Last Name"
                      className="w-1/2 px-3 py-2 border rounded"
                  />
                </div>
                <input
                    type="email"
                    placeholder="Email address"
                    className="w-full px-3 py-2 border rounded"
                />
                <input
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full px-3 py-2 border rounded"
                />
                <input type="date" className="w-full px-3 py-2 border rounded" />

                <div className="flex justify-end space-x-4">
                  <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <h2 className="mt-5 text-xl font-bold text-gray-800">
              User Portfolio
            </h2>
            <div className="flex flex-row space-x-4">
              <h3 className="text-gray-600">a</h3>
              <h3 className="text-gray-600">b</h3>
            </div>
          </div>
        </div>

        <Footer />
      </div>
  );
}

export default UserProfile;
