import React, {useRef, useState} from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import supabase from "./main.jsx";

//export const FileUploader = ({handleFile}) => {  // Create a reference to the hidden file input element


const token = localStorage.getItem("token");

const UploadFile = () => {
    const hiddenFileInput = useRef(null);
    const [fileName, setFileName] = useState("No file chosen"); // State to track file name



    // Programatically click the hidden file input element
    // when the Button component is clicked
    const handleClick = event => {
        hiddenFileInput.current.click();
    };  // Call a function (passed as a prop from the parent component)

    // to handle the user-selected file
    const handleChange = event => {
        const fileUploaded = event.target.files[0];
        if (fileUploaded) {
            setFileName(fileUploaded.name); // Update the span text with file name
        } else {
            setFileName("No file chosen"); // Reset if no file is selected
        }
        uploadProfileImage(fileUploaded);
    };

    function uploadProfileImage(e) {
        let file = e.target.files[0];

        const { data, error } = supabase
            .storage
            .from('uploads')
            .upload()

    }

    return (
        <div className="flex flex-col bg-neutral-50 ">
            <Navbar />
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 my-auto mt-8 mb-8 md:grid-cols-2 xl:gap-14 md:gap-5">
                    <div className="flex flex-col justify-center col-span-1 text-center lg:text-start">
                        <h1 className="mb-4 text-4xl font-extrabold leading-tight lg:text-5xl text-dark-grey-900">
                            Add your profile picture
                        </h1>
                        <p className="mb-6 text-base font-normal leading-7 lg:w-3/4 text-grey-900">
                            Please upload your profile picture hear
                        </p>
                        <div className="flex flex-col items-center gap-4 lg:flex-row">
                            <div className="flex items-center py-4 text-sm font-bold text-white px-7 bg-[#cf5c2e] hover:bg-[#d96a3d] focus:ring-4 focus:ring-orange-200 transition duration-300 rounded-xl">
                                <button className="button-upload" onClick={handleClick}>
                                    Upload a file
                                </button>
                                <input
                                    type="file"
                                    onChange={handleChange}
                                    ref={hiddenFileInput}
                                    style={{display: 'none'}} // Make the file input element invisible
                                />
                                <button/>
                            </div>

                            {/* Display Selected File Name */}
                            <span id="file-chosen" className="text-gray-600">{fileName}</span>
                            <button id="upload-button" className="flex items-center py-4 text-sm font-bold text-white px-7 bg-[#cf5c2e] hover:bg-[#d96a3d] focus:ring-4 focus:ring-orange-200 transition duration-300 rounded-xl">
                                Upload
                            </button>

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

export default UploadFile;


