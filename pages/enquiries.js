import Layout from "@/components/Layout";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ConfirmDialog from "@/components/ConfirmDialog";

const enquiries = () => {
  const [enquiryList, setEnquiryList] = useState([]);
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedEnquiryId, setSelectedEnquiryId] = useState(null);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/enquiry`).then((res) => {
      setEnquiryList(res.data);
    });
  }, []);

  const handleEnquiry = async (enquiryId) => {
    // Open the confirmation dialog and set the selected booking ID

    setSelectedEnquiryId(enquiryId);
    setConfirmDialogOpen(true);
  };

  const closeConfirmDialog = () => {
    // Close the confirmation dialog
    setConfirmDialogOpen(false);
  };

  const confirmAction = async () => {
    // Close the confirmation dialog
    setConfirmDialogOpen(false);

    try {
      // Perform the delete action using axios
      const completeResponse = await axios.delete(
        `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/enquiry?id=${selectedEnquiryId}`
      );

      // Check the status code to determine success or failure
      if (completeResponse.status === 200) {
        console.log("Enquiry deleted:", selectedEnquiryId);

        // Update the state by filtering out the deleted enquiry
        setEnquiryList(
          enquiryList.filter((item) => item._id !== selectedEnquiryId)
        );
      } else {
        console.error("Failed to delete enquiry:", completeResponse.statusText);
        // Handle error and update UI accordingly
      }
    } catch (error) {
      console.error("Error deleting enquiry:", error);
      // Handle error and update UI accordingly
    }
  };

  return (
    <>
      <Layout>
        <div className=" mx-auto overflow-x-auto">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 font-bold p-4 bg-gray-200 rounded-t-lg">
            <div className="hidden md:block">Name</div>
            <div className="hidden md:block">Phone</div>
            <div className="hidden md:block">Email</div>
            <div className="hidden md:block">Message</div>
          </div>

          {enquiryList.length > 0 ? (
            enquiryList.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-6 gap-4 p-2 border-b"
              >
                <div className="text-gray-600 font-serif tracking-wide p-2">
                  {item.name}
                </div>
                <div className="tracking-wide break-words p-2">
                  <a
                    href={`tel:${item.contact}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {item.contact}
                  </a>
                </div>{" "}
                <div className="break-words p-2">
                  <a
                    href={`mailto:${item.email}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {item.email}
                  </a>
                </div>
                <div className="font-sans md:col-span-2 p-2">
                  {item.message}
                </div>
                <div className="font-sans text-center p-2 ">
                  {" "}
                  <button
                    onClick={() => handleEnquiry(item._id)}
                    className="px-3 py-1 bg-red-500 rounded-md text-white tracking-wide hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-4 md:text-lg">No new enquiries</div>
          )}
        </div>
        <ConfirmDialog
          isOpen={isConfirmDialogOpen}
          onClose={closeConfirmDialog}
          onConfirm={confirmAction}
          confirmMessage="Are you sure you want to complete this enquiry?"
        />{" "}
      </Layout>
    </>
  );
};

export default enquiries;
