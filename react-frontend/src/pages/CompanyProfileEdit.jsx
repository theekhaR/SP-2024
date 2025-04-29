import React, {useEffect, useRef, useState} from "react";
import Lnavbar from "../components/L_navbar";
import Footer from "../components/footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faInstagram, faLinkedinIn, faYoutube, faTiktok } from "@fortawesome/free-brands-svg-icons";
import { faGlobe, faIndustry } from "@fortawesome/free-solid-svg-icons";
import {useCompanyContext} from "../components/CompanyContext.jsx";
import {useUserContext} from "../components/UserContext.jsx";
import {supabase} from "../supabaseClient.jsx";
import {v4 as uuidv4} from "uuid";

function CompanyProfileEdit() {

  const {companyID, companyInfo, companyLogoURL, userCompanyData, loadingCompanyContext} = useCompanyContext();
  const {userID} = useUserContext();

  if (!companyInfo || companyInfo.companyID !== companyID) {
    return <div className="text-center p-12">Loading company data...</div>;
    //Should be improved
  }

  const [editCompanyName, setEditCompanyName] = useState(companyInfo.companyName);
  const [editCompanyAbout, setEditCompanyAbout] = useState(companyInfo.companyAbout);
  const [editCompanyOverview, setEditCompanyOverview] = useState(companyInfo.companyOverview);
  const [editCompanyLogoURL, setEditCompanyLogoURL] = useState(companyInfo.companyLogoURL);
  const [editCompanyLocation, setEditCompanyLocation] = useState(companyInfo.companyLocation);
  const [editIndustryID, setEditIndustryID] = useState(companyInfo.industryID);
  const [editCompanySize, setEditCompanySize] = useState(companyInfo.companySize);
  const [editCompanyPhone, setEditCompanyPhone] = useState(companyInfo.companyPhone);
  const [editCompanyEmail, setEditCompanyEmail] = useState(companyInfo.companyEmail);
  const [editCompanyWebsite, setEditCompanyWebsite] = useState(companyInfo.companySite);

  const [newLogoImage, setNewLogoImage] = useState(null); //New pfp of user, to be uploaded
  const hiddenFileInput = useRef(null);
  const [fileName, setFileName] = useState("No file chosen"); // Track of current chosen file name

  const [industryList, setIndustryList] = useState([]);

  async function getIndustryList() {
    try {
      const response = await fetch(`http://localhost:5000/get_all_industries`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        const data = await response.json();

        // Map raw data to desired format
        const industries = data.map((industry, index) => ({
          id: industry.industryID,
          name: industry.industryName,
        }));
        return industries;
      }

      // Unexpected error
      const data = await response.json();
      alert(data.error);
      return [];
    } catch (error) {
      console.error("Error :", error);
      return [];
    }
  }

  useEffect(() => {
    getIndustryList().then(setIndustryList);
  }, []);

  async function updateCompany() {

    try {
      const response = await fetch(`http://localhost:5000/edit_company`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'companyID': companyID,
          'companyName': editCompanyName,
          'companyAbout': editCompanyAbout,
          'companyOverview': editCompanyOverview,
          'companyLogoURL': editCompanyLogoURL,
          'companyLocation': editCompanyLocation,
          'industryID': editIndustryID,
          'companySize': editCompanySize,
          'companyPhone': editCompanyPhone,
          'companyEmail': editCompanyEmail,
          'companyWebsite': editCompanyWebsite,
        })
      });

      if (response.status === 201) {
        alert("Update Completed")
        window.location.href = "/CompanyProfile";
      }

      // Unexpected error
      const data = await response.json();
      alert(data.error);
    } catch (error) {
      console.error("Error :", error);
    }
  }

    async function updateCompanyLogoURL() {
    try {
      const { data: imageList, error } = await supabase.storage
          .from('company-media')
          .list(companyID + '/logo/', {
            limit: 1,
            offset: 0
          });

      if (error) { alert(error.message); return; }

      if (imageList && imageList.length > 0 && imageList[0].name !== "placeholder.txt") {
        const { data: urlData } = supabase.storage
            .from('company-media')
            .getPublicUrl(`${companyID}/logo/${imageList[0].name}`);

        const publicUrl = urlData.publicUrl;
        console.log(publicUrl)
        const response = await fetch(`http://localhost:5000/edit_company`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'companyID': companyID,
            'companyLogoURL': publicUrl // <--- Use freshly retrieved URL here
          })
        });

      //   if (response.ok) {
      //     //setProfileImageURL(publicUrl); // Update the state after successful update
      //     alert("Updated profile URL");
      //   }
      // } else {
      //   //setprofileExistBoolean(false);
         }
    } catch (error) {
      console.error("Error updating profile URL:", error);
    }
  }

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  }; // Call a function (passed as a prop from the parent component)

  // to handle the user-selected file
  async function handleChange(e) {
    const fileUploaded = e.target.files[0];
    if (fileUploaded) {
      setFileName(fileUploaded.name); // Update the span text with file name
      setNewLogoImage(e.target.files[0]);
    } else {
      setFileName("No file chosen"); // Reset if no file is selected
    }
  }

  async function uploadCompanyLogo() {

    await removeAllItemInFolder();
    const {data, error} = await supabase.storage
        .from("company-media")
        .upload(companyID + "/logo/" + uuidv4(), newLogoImage);

    if (data) {
      setNewLogoImage(null);
      setFileName("No file chosen");
      // Wait a moment to allow the upload to propagate
      setTimeout(async () => {
        await updateCompanyLogoURL(); // now fetch new URL after small delay
        window.location.reload()
      }, 3000);
    }
    if (error) {
      alert(error.message);
    }
  }

  async function removeAllItemInFolder() {
    //Remove all image inside folder as it should only have 1 image at a time
    const {data: list, errorGetList} = await supabase.storage
        .from('company-media')
        .list(companyID + '/logo/');
    if (errorGetList) {
      alert(errorGetList.message)
    }

    const filesToRemove = list.map((x) => `${companyID}/logo/${x.name}`);
    const {data, errorRemove} = await supabase.storage
        .from('company-media')
        .remove(filesToRemove);
    if (errorRemove) {
      alert(errorRemove.message)
    }
  }


  return (
      <div className="min-h-screen bg-gray-100">
        <Lnavbar />
        <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-md mt-12">
          <h2 className="text-xl font-bold text-orange-500  mb-6">
            Create New Company
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* LEFT: Form Section */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <label className=" text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                    type="text"
                    defaultValue={companyInfo.companyName}
                    onChange={(e) => setEditCompanyName(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Industry
                </label>
                <select className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={companyInfo.industryID}
                        onChange={(e) => setEditIndustryID(e.target.value)}>
                  {industryList.map((industry) => (
                      <option key={industry.id} value={industry.id}>
                        {industry.name}
                      </option>
                  ))}
                </select>
              </div>

              <div>
                <label className=" text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                    type="text"
                    defaultValue={companyInfo.companyLocation}
                    onChange={(e) => setEditCompanyLocation(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className=" text-sm font-medium text-gray-700 mb-1">
                  About Us - Who we are and why we exist.
                </label>
                <input
                    type="text"
                    defaultValue={companyInfo.companyAbout}
                    onChange={(e) => setEditCompanyAbout(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className=" text-sm font-medium text-gray-700 mb-1">
                  Overview - What we do and how we operate.
                </label>
                <textarea
                    rows="3"
                    defaultValue={companyInfo.companyOverview}
                    onChange={(e) => setEditCompanyOverview(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
            </div>

            {/* RIGHT: Image Upload */}
            <div className="flex flex-col items-center text-center bg-gray-100 px-4 py-4 md:p-4 rounded-md space-y-2">
              <img
                  src={companyInfo.companyLogoURL}
                  alt="Company Logo"
                  className="w-6/12 h-6/12 object-cover rounded-md mt-16 mb-12"
              />
              <input type="file" className="hidden" id="upload" />

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
              {newLogoImage ? (
                <label
                  //htmlFor="upload-photo"
                   className="px-3 py-1 bg-orange-600 text-white rounded-md hover:bg-orange-800 transition"
                  onClick={uploadCompanyLogo}
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
              )}<span>The page will reload after uploading.</span><span>Beware of losing progress</span>
            </div>
          </div>

          <h2 className="text-xl font-bold text-orange-500 mt-6 mb-3">
            Company social profile
          </h2>

          <div className="mb-3">
            <label className=" text-sm font-medium text-gray-700 mb-1">
              Company Website
            </label>
            <div className="flex items-center border rounded-md overflow-hidden w-full focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition">
              <div className="px-4">
                <FontAwesomeIcon
                    icon={faGlobe}
                    className="text-orange-500 text-lg"
                />
              </div>
              <div className="h-6 w-px bg-gray-200 mr-2" />
              <input
                  type="text"
                  defaultValue={companyInfo.companyWebsite}
                  onChange={(e) => setEditCompanyWebsite(e.target.value)}
                  className="w-full px-4 py-2 border placeholder:text-gray-400 focus:outline-none"
              />
            </div>

            <strong className=" text-sm font-medium text-gray-700 mb-1">
              Company Email
            </strong>
            <div className="flex items-center border rounded-md overflow-hidden w-full focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition">
              <div className="px-4">
                <FontAwesomeIcon
                    icon={faGlobe}
                    className="text-orange-500 text-lg"
                />
              </div>
              <div className="h-6 w-px bg-gray-200 mr-2" />
              <input
                  type="text"
                  defaultValue={companyInfo.companyEmail}
                  onChange={(e) => setEditCompanyEmail(e.target.value)}
                  className="w-full px-4 py-2 border placeholder:text-gray-400 focus:outline-none"
              />
            </div>

            <label className=" text-sm font-medium text-gray-700 mb-1">
              Company Phone Number
            </label>
            <div className="flex items-center border rounded-md overflow-hidden w-full focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition">
              <div className="px-4">
                <FontAwesomeIcon
                    icon={faGlobe}
                    className="text-orange-500 text-lg"
                />
              </div>
              <div className="h-6 w-px bg-gray-200 mr-2" />
              <input
                  type="text"
                  defaultValue={companyInfo.companyPhone}
                  onChange={(e) => setEditCompanyPhone(e.target.value)}
                  className="w-full px-4 py-2 border placeholder:text-gray-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Social Media Inputs - Kept as-is for now */}
          {/*<div className="grid grid-cols-3 gap-4">*/}
          {/*  {[*/}
          {/*    {*/}
          {/*      label: "LinkedIn",*/}
          {/*      icon: faLinkedinIn,*/}
          {/*      placeholder: "LinkedIn url",*/}
          {/*    },*/}
          {/*    {*/}
          {/*      label: "Facebook",*/}
          {/*      icon: faFacebookF,*/}
          {/*      placeholder: "Facebook url",*/}
          {/*    },*/}
          {/*    {*/}
          {/*      label: "Instagram",*/}
          {/*      icon: faInstagram,*/}
          {/*      placeholder: "Instagram url",*/}
          {/*    },*/}
          {/*    { label: "Youtube", icon: faYoutube, placeholder: "Youtube url" },*/}
          {/*    { label: "Tiktok", icon: faTiktok, placeholder: "Tiktok url" },*/}
          {/*  ].map((item, i) => (*/}
          {/*      <div key={i}>*/}
          {/*        <label className="text-sm font-medium text-gray-700 mb-1 block">*/}
          {/*          {item.label}*/}
          {/*        </label>*/}
          {/*        <div className="flex items-center border rounded-md overflow-hidden w-full max-w-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition">*/}
          {/*          <div className="px-4">*/}
          {/*            <FontAwesomeIcon*/}
          {/*                icon={item.icon}*/}
          {/*                className="text-orange-500 text-lg"*/}
          {/*            />*/}
          {/*          </div>*/}
          {/*          <div className="h-6 w-px bg-gray-200 mr-2" />*/}
          {/*          <input*/}
          {/*              type="text"*/}
          {/*              placeholder={item.placeholder}*/}
          {/*              className="flex-1 py-2 pr-4 text-gray-500 placeholder:text-gray-400 focus:outline-none"*/}
          {/*          />*/}
          {/*        </div>*/}
          {/*      </div>*/}
          {/*  ))}*/}
          {/*</div>*/}

          <div className="flex justify-end mt-4">
            <button
                className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-800 mr-4"
                onClick={async (e) => {
                  e.preventDefault();
                  await updateCompany();
                }}
            >
              Save Change
            </button>
            <button className="bg-slate-800 text-white px-4 py-2 rounded hover:bg-slate-800">
              <a href="/CompanyProfile" className="text-white">
                Cancel
              </a>
            </button>
          </div>
        </div>
        <Footer />
      </div>
  );
}

export default CompanyProfileEdit;
