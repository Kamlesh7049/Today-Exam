// CreateRequestMainComponent.tsx
import React, { useState } from "react";
import { Button } from "flowbite-react";
import { HiPlus, HiTrash } from "react-icons/hi";
import axios from 'axios'; // Import axios for making API requests

interface CreateRequestMainComponentProps {}

interface ValidUrl {
  url: string;
  value: string;
}

export const CreateRequestMainComponent: React.FC<CreateRequestMainComponentProps> = () => {
  const [urlInputs, setUrlInputs] = useState<string[]>([""]);
  const [urlErrors, setUrlErrors] = useState<string[]>([""]); // For tracking individual field errors
  const [error, setError] = useState<string>("");
  const handleAddUrl = () => {
    if (urlInputs.length < 10) { // Limit to 10 URLs
      setUrlInputs([...urlInputs, ""]); // Add a new empty string to the array for a new input box
      setUrlErrors([...urlErrors, ""]); // Add a corresponding error message placeholder
    }
  };

  const handleInputChange = (index: number, value: string) => {
    const updatedInputs = [...urlInputs];
    updatedInputs[index] = value;
    setUrlInputs(updatedInputs); // Update the specific URL input

    // Clear the individual error for this input
    const updatedErrors = [...urlErrors];
    updatedErrors[index] = ""; 
    setUrlErrors(updatedErrors);
  };

  // Remove the input box at the specified index
  const handleDeleteInput = (index: number) => {
    const updatedInputs = urlInputs.filter((_, i) => i !== index); // Remove input at that index
    const updatedErrors = urlErrors.filter((_, i) => i !== index); // Remove corresponding error
    setUrlInputs(updatedInputs);
    setUrlErrors(updatedErrors);
  };

  // Function to validate Google Drive URLs
  const validateUrl = (url: string) => {
    const googleDriveRegex = /^(https?:\/\/)?(drive\.google\.com|docs\.google\.com)\/.*$/;
    return googleDriveRegex.test(url);
  };

  // Function to save URLs to the database
  const handleSaveUrls = async () => {
    setError(""); // Reset general error message
    const validUrls: ValidUrl[] = []; // Specify the type of validUrls
    const updatedErrors = [...urlErrors];

    // Validate each URL and update the error state
    urlInputs.forEach((url, index) => {
      if (validateUrl(url)) {
        validUrls.push({ url: `entry-${index + 1}`, value: url.split('/').pop()! });
        updatedErrors[index] = ""; // Clear the error if valid
      } else {
        updatedErrors[index] = "Invalid Google Drive URL"; // Set individual error message
      }
    });

    setUrlErrors(updatedErrors); // Update the error state

    // Check if all URLs are valid
    const allValid = validUrls.length === urlInputs.length && validUrls.length > 0;
    if (allValid) {
      try {
        // const response = await axios.post('http://localhost:5000/api/urls', { urls: validUrls });
        alert(JSON.stringify({ urls: validUrls })); 
        // console.log(response.data.message);
        setUrlInputs([""]);
        setUrlErrors([""]);
      } catch (error) {
        console.error('Error saving URLs:', error);
      }
    } else {
      setError("Please ensure all URLs are valid Google Drive links.");
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between p-2 border-b rounded-t">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white font-extrabold pl-10 text-base">
          Create New Request
        </h3>
        <button className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
          <HiTrash className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 space-y-6 mx-auto">
        <div>
          <h4 className="text-lg font-bold text-gray-900 dark:text-white">
            Add videos or folders
          </h4>
          <p className="text-sm text-gray-900 dark:text-gray-400">
            These videos would be cut, labeled, and made available in your Recharm video library
          </p>
        </div>

        {urlInputs.map((url, index) => (
          <div className="mb-4 flex items-center relative" key={index}>
            <div className="flex-grow relative">
              <label
                htmlFor={`video-url-${index}`} 
                className="block text-sm font-medium text-gray-700"
              >
                Video/Folder URL {index + 1}
              </label>
              <div className="relative">
                <input
                  type="text"
                  id={`video-url-${index}`}
                  className={`mt-1 p-2 block w-full border rounded-md shadow-sm sm:text-sm pr-10 ${
                    urlErrors[index] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={`Enter video URL ${index + 1}`}
                  value={url}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                />
                {/* Show the delete icon on the right side to remove the input box */}
                <button
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-red-600"
                  onClick={() => handleDeleteInput(index)}
                >
                  <HiTrash className="h-5 w-5" />
                </button>
              </div>
              {urlErrors[index] && (
                <p className="text-red-500 text-xs">{urlErrors[index]}</p> // Show individual error message
              )}
            </div>
          </div>
        ))}

        <div>
          <Button
            color="light"
            className="text-sm font-medium hover:text-purple-800 bg-white hover:bg-gray-50 border border-gray-300"
            onClick={handleAddUrl}
          >
            <span className="flex items-center">
              <span className="bg-purple-800 rounded-full p-0.5 mr-2">
                <HiPlus className="h-3 w-3 text-white" />
              </span>
              Add URL
            </span>
          </Button>
        </div>
        {/*  */}
        {/* Show error message if any */}
        {error && <p className="text-red-500">{error}</p>}
      </div>

      <div className="flex items-center justify-end p-4 border-t border-gray-200 rounded-b w-full">
        <Button
          color="primary"
          className="text-sm font-medium bg-purple-700 hover:bg-purple-800"
          onClick={handleSaveUrls} // Call the save function on button click
        >
          Create Request
        </Button>
      </div>
    </div>
  );
};
