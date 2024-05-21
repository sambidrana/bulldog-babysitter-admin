import Layout from "@/components/Layout";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ConfirmDialog from "@/components/ConfirmDialog";

const Enquiries = () => {
  const [enquiryList, setEnquiryList] = useState([]);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isCompleteDialogOpen, setCompleteDialogOpen] = useState(false);
  const [selectedEnquiryId, setSelectedEnquiryId] = useState(null);

  const [isCompleted, setIsCompleted] = useState();

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/enquiry`)
      .then((res) => {
        setEnquiryList(res.data);
        console.log(res.data);
      });
  }, []);

  const handleEnquiryDelete = async (enquiryId) => {
    // Open the confirmation dialog and set the selected booking ID

    setSelectedEnquiryId(enquiryId);
    setDeleteDialogOpen(true);
  };
  const closeDeleteDialog = () => {
    // Close the confirmation dialog
    setDeleteDialogOpen(false);
  };
  const confirmActionDelete = async () => {
    // Close the confirmation dialog
    setDeleteDialogOpen(false);

    try {
      // Perform the delete action using axios
      const completeResponse = await axios.delete(
        `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/enquiry?id=${selectedEnquiryId}`
      );

      // Check the status code to determine success or failure
      if (completeResponse.status === 200) {
        // console.log("Enquiry deleted:", selectedEnquiryId);

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

  const handleEnquiryComplete = async (enquiryId) => {
    // setIsCompleted(true);
    setSelectedEnquiryId(enquiryId);
    setCompleteDialogOpen(true);
  };
  const closeCompleteDialog = () => {
    // Close the confirmation dialog
    setCompleteDialogOpen(false);
  };

  const confirmActionComplete = async () => {
    try {
      // Close the confirmation dialog
      setCompleteDialogOpen(false);

      // Perform the update action using axios
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/enquiry?id=${selectedEnquiryId}`,
        { completed: true }
      );

      // Check the status code to determine success or failure
      if (response.status === 200) {
        // Update the state to reflect the completion
        setEnquiryList((prevEnquiries) =>
          prevEnquiries.map((enquiry) =>
            enquiry._id === selectedEnquiryId
              ? { ...enquiry, completed: true }
              : enquiry
          )
        );
      } else {
        console.error("Failed to complete enquiry:", response.statusText);
        // Handle error and update UI accordingly
      }
    } catch (error) {
      console.error("Error completing enquiry:", error);
      // Handle error and update UI accordingly
    }
  };

  return (
    <>
      <Layout>
        <div className=" mx-auto overflow-x-auto">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 font-bold p-4 bg-gray-200 rounded-t-lg  tracking-wide">
            <div className="hidden md:block">Received On</div>
            <div className="hidden md:block">Name</div>
            <div className="hidden md:block">Phone</div>
            <div className="hidden md:block">Email</div>
            {/* <div className="hidden md:block">Message</div> */}
          </div>

          {enquiryList.length > 0 ? (
            enquiryList.map((item, index) => (
              <div
                key={index}
                className={`grid grid-cols-1 md:grid-cols-6 gap-2 p-2 mb-1 border-b text-sm md:text-base shadow-inner ${
                  item.completed ? "bg-green-100" : "bg-red-100"
                }`}
              >
                <div className=" font-mono text-sm p-2 ">
                  {`${new Date(item.createdAt).toLocaleDateString()} ${new Date(
                    item.createdAt
                  ).toLocaleTimeString()}`}
                </div>
                <div className="text-gray-600 font-serif tracking-wide p-2">
                  {item.name}
                </div>
                <div className="tracking-wide break-words p-2 w-1/2">
                  <a
                    href={`tel:${item.contact}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {item.contact}
                  </a>
                </div>{" "}
                <div className="break-words p-2 ">
                  <a
                    href={`mailto:${item.email}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {item.email}
                  </a>
                </div>
                <div className="font-sans break-words md:col-span-6 p-2 ">
                  {item.message}
                </div>

                <div className="grid grid-flow-col md:col-span-6 mt-10  mb-4  ">
                  <div className="font-sans text-center md:p-4  ">
                    {" "}
                    <button
                      onClick={() => handleEnquiryDelete(item._id)}
                      className="w-[100px] md:w-[150px] px-3 py-1 bg-red-500 rounded-md text-white tracking-wide hover:bg-red-600 drop-shadow-lg"
                    >
                      Delete
                    </button>
                  </div>
                  {item.completed ? (
                    <div className="w-[100px] md:w-[150px]"></div>
                  ) : (
                    <div className="font-sans text-center md:p-4 ">
                    <button
                        onClick={() => handleEnquiryComplete(item._id)}
                        className="w-[100px] md:w-[150px] px-3 py-1 bg-green-500 rounded-md text-white tracking-wide hover:bg-green-600 drop-shadow-lg"
                      >
                        Complete
                      </button>
                    </div>
                  )}
                </div>

              </div>
            ))
          ) : (
            <div className="text-center p-4 md:text-lg">No new enquiries</div>
          )}
        </div>
        <ConfirmDialog
          isOpen={isDeleteDialogOpen}
          onClose={closeDeleteDialog}
          onConfirm={confirmActionDelete}
          confirmMessage="Are you sure you want to Delete this enquiry?"
        />{" "}
        <ConfirmDialog
          isOpen={isCompleteDialogOpen}
          onClose={closeCompleteDialog}
          onConfirm={confirmActionComplete}
          confirmMessage="Are you sure you want to Complete this enquiry?"
        />{" "}
      </Layout>
    </>
  );
};

export default Enquiries;
