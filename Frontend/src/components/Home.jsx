import React, { useState } from "react";
// const path=require('path');
// import { FaFileWord } from "react-icons/fa6";
import {
  FaFileWord,
  FaFilePdf,
  FaFileExcel,
  FaFileImage,
  FaFileAlt,
} from "react-icons/fa";

const fileIcon = {
  docx: <FaFileWord className="text-3xl mr-3" />,
  pdf: <FaFilePdf className="text-3xl mr-3" />,
  jpg: <FaFileImage className="text-3xl mr-3" />,
  png: <FaFileImage className="text-3xl mr-3" />,
  txt: <FaFileAlt className="text-3xl mr-3" />,
  xslx:<FaFileExcel className="text-3xl mr-3" />
};




import axios from "axios";


function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [convert, setConvert] = useState("");
  const [downloadError, setDownloadError] = useState("");
  const [conversionformat, setConversionformat] = useState("");

  const handleFileChange = (e) => {
    console.log(e.target.files[0]);
    setSelectedFile(e.target.files[0]);
  };

  const handleConvertformat = (e) => {
    console.log(e.target.value);
    setConversionformat(e.target.value);
  };
 
  const defaultFileIcon=(selectedFile)=>{
    if(!selectedFile){
      return null;
    }
    const fileExtension=selectedFile.name.split(".").pop().toLowerCase();
    return fileIcon[fileExtension]|| null;
      }



      const conversionMap = {
        docx: { pdf: "docx-to-pdf", jpg: "docx-to-jpg", png: "docx-to-png" },
        pdf: { docx: "pdf-to-docx", jpg: "pdf-to-jpg", png: "pdf-to-png" },
        jpg: { docx: "jpg-to-docx", pdf: "jpg-to-pdf", png: "jpg-to-png" },
        png: { docx: "png-to-docx", pdf: "png-to-pdf", jpg: "png-to-jpg" }
    };
    
    // 🛠️ Function to handle file conversion dynamically
    const handleConversion = async (e) => {
        e.preventDefault();
        if (!selectedFile || !conversionformat) return ;
    
        const inputFormat = selectedFile.name.split(".").pop().toLowerCase();
        const conversionPath = conversionMap[inputFormat]?.[conversionformat];
       console.log(conversionPath)
        if (!conversionPath) {
            setDownloadError("Invalid file conversion selected.");
            return;
        }
    
        try {
            const formData = new FormData();
            formData.append("file", selectedFile);
    
            const response = await axios.post(
                `http://localhost:3001/convertfile/${conversionPath}`,
                formData,
                { responseType: "blob" }
            );
    
            downloadFile(response.data, selectedFile.name, conversionformat);
            setConvert("File Converted Successfully");
            resetStateAfterDelay();
    
        } catch (error) {
            console.error("Conversion Error:", error);
            setDownloadError(error.response?.data?.message || "Conversion failed");
        }
    };
    
    // 📌 Utility function for downloading the file
    const downloadFile = (data, originalName, newExtension) => {
        const url = URL.createObjectURL(new Blob([data]));
        const link = document.createElement("a");
        link.href = url;
        link.download = originalName.replace(/\.[^/.]+$/, `.${newExtension}`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url); // Free memory
    };
    
    // 📌 Utility function to reset state after a delay
    const resetStateAfterDelay = () => {
        setTimeout(() => {
            setSelectedFile(null);
            setConvert("");
            setDownloadError("");
            setConversionformat("");
        }, 2000);
    };

  return (
    <>
      <div className="max-w-screen-2xl mx-auto container px-6 py-3 md:px-40 ">
        <div className="flex h-screen items-center justify-center">
          <div className="border-2 border-dashed px-4 py-2 md:px-8 md:py-6 border-indigo-400 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-center mb-4 ">
              Convert Word to PDF Online
            </h1>
            <p className="text-sm text-center mb-5 ">
              Easily convert file to any format online, without having
              to install any software.
            </p>

            <div className="flex flex-col items-center space-y-4">
              <input
                type="file"
                accept=".doc,.docx ,.jpg,.pdf,.png"
                onChange={handleFileChange}
                className="hidden"
                id="FileInput"
              />
              <label
                htmlFor="FileInput"
                className="w-full flex items-center justify-center px-4 py-6 bg-gray-100 text-gray-700 rounded-lg shadow-lg cursor-pointer border-blue-300 hover:bg-blue-700 duration-300 hover:text-white"
              >
                {/* {selectedFile.name.split(".").pop() == "docx" ? (
                  <FaFileWord className="text-3xl mr-3" />
                ) : (
                  ""
                )} */}
                {defaultFileIcon(selectedFile)}
                <span className="text-2xl mr-2 ">
                  {selectedFile ? selectedFile.name : "Choose File"}
                </span>
              </label>

              <select
                className="w-full flex  py-2 border-2 border-gray-300 rounded-lg "
                value={conversionformat || ''}
                onChange={handleConvertformat}
              >
                <option value="" disabled selected hidden>
                  Select an option
                </option>
                <option value="docx" disabled={selectedFile?.name?.split('.').pop().toLowerCase() === "docx"}>docx</option>
                <option value="pdf" disabled={selectedFile?.name?.split('.').pop().toLowerCase() ==="pdf"}>pdf </option>
                <option value="jpg" disabled={selectedFile?.name?.split('.').pop().toLowerCase() ==="jpg"}>jpg</option>
                <option value="png" disabled={selectedFile?.name?.split('.').pop().toLowerCase() ==="png"}>png</option>
              </select>

              <button
                // onClick={handleSubmit}
                  onClick={handleConversion}
                disabled={!selectedFile}
                className="text-white bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 disabled:pointer-events-none duration-300 font-bold px-4 py-2 rounded-lg"
              >
                Convert File
              </button>
              {convert && (
                <div className="text-green-500 text-center">{convert}</div>
              )}
              {downloadError && (
                <div className="text-red-500 text-center">{downloadError}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
