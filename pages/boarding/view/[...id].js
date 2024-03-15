import Layout from "@/components/Layout";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ConfirmDialog from "@/components/ConfirmDialog";

const View = () => {
  const [memberInfo, setMemberInfo] = useState(null); // Change initial state to null
  const [editMode, setEditMode] = useState(false);
  const [editedInfo, setEditedInfo] = useState({});

  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedBoardingId, setSelectedBoardingId] = useState(null);

  const router = useRouter();
  // console.log(router);
  const { id } = router.query;
  useEffect(() => {
    if (!id) return;
    axios
      .get(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/boarding?id=${id}`)
      .then((res) => {
        //   console.log(res.data);
        setMemberInfo(res.data);
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target; //this needs to be changed as it needs to target each field
    // setEditedInfo({ ...editedInfo, [name]: value });
    setEditedInfo((prevState) => ({ ...prevState, [name]: value }));
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleSave = async () => {
    // Assuming your API expects an id in the body to identify the record
    try {
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/boarding?id=${id}`,
        {
          ...editedInfo,
          id: memberInfo._id,
        }
      );
      setMemberInfo(res.data); // Update the local state to reflect the saved changes
      setEditMode(false); // Exit edit mode
    } catch (error) {
      console.error("Failed to save changes", error);
      // Optionally, implement error handling logic here
    }
  };

  if (memberInfo === null) {
    // Check for null instead of !memberInfo
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          Loading...
        </div>
      </Layout>
    );
  }
  const handleGoBack = () => {
    router.back();
  };

  // For Delete Action
  const handleDelete = async () => {
    // Open the confirmation dialog and set the selected booking ID

    setSelectedBoardingId(id);
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
        `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/boarding?id=${selectedBoardingId}`
      );

      // Check the status code to determine success or failure
      if (completeResponse.status === 200) {
        // console.log("Boarding deleted:", selectedBoardingId);
        router.push("/boarding");
      } else {
        console.error(
          "Failed to delete boarding details:",
          completeResponse.statusText
        );
      }
    } catch (error) {
      console.error("Error deleting boarding details: ", error.message);
      // Handle error and update UI accordingly
    }
  };

  return (
    <Layout>
      <div className="mt-10 ml-10 ">
        <table className="w-full mt-6 text-left rounded shadow-sm ">
          <tbody>
            <tr>
              <td
                colSpan="100%"
                className="pt-5 md:text-2xl pb-4 pl-5 font-semibold text-gray-500 font-serif bg-[#f4f2eb]"
              >
                Owner's Information
                <button
                  onClick={() => handleDelete()}
                  className="text-xs mt-3 font-sans md:text-sm md:ml-3  px-3 py-2 bg-red-500 rounded-md text-white tracking-wide hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
            <tr className="customTR">
              <th className=" customTH">Owner</th>
              <td className=" customTD">
                {editMode ? (
                  <>
                    <input
                      type="text"
                      name="firstName"
                      value={editedInfo.firstName || memberInfo.firstName}
                      onChange={handleInputChange}
                      className="border p-1"
                    />
                    <input
                      type="text"
                      name="lastName"
                      value={editedInfo.lastName || memberInfo.lastName}
                      onChange={handleInputChange}
                      className="border p-1"
                    />
                  </>
                ) : (
                  `${memberInfo.firstName} ${memberInfo.lastName}`
                )}
              </td>
            </tr>
            <tr className="customTR">
              <th className=" customTH ">Phone</th>
              <td className=" customTD">
                {editMode ? (
                  <input
                    type="text"
                    name="phone"
                    value={editedInfo.phone || memberInfo.phone}
                    onChange={handleInputChange}
                    className="border p-1"
                  />
                ) : (
                  memberInfo.phone
                )}
              </td>
            </tr>
            <tr className="customTR">
              <th className=" customTH">Email</th>
              <td className=" customTD">
                {editMode ? (
                  <input
                    type="text"
                    name="email"
                    value={editedInfo.email || memberInfo.email}
                    onChange={handleInputChange}
                    className="border p-1"
                  />
                ) : (
                  memberInfo.email
                )}
              </td>
            </tr>

            <tr>
              <td
                colSpan="100%"
                className="pt-10 md:text-2xl pb-4 pl-5 font-semibold text-gray-500 font-serif bg-[#f4f2eb]"
              >
                Dog's Details
              </td>
            </tr>
            <tr>
              <td colSpan="100%">
                <div className="p-4 max-w-[500px]">
                  <a target="_blank" href={memberInfo.imageUrl}>
                    <img
                      src={memberInfo.imageUrl}
                      alt={memberInfo.petName}
                      className="border p-4 hover:scale-105 transition-transform shadow-lg md:max-w-sm"
                    />
                  </a>
                </div>
              </td>
            </tr>
            <tr className="customTR">
              <th className=" customTH">Pet Name</th>
              <td className=" customTD">
                {editMode ? (
                  <input
                    type="text"
                    name="petName"
                    value={editedInfo.petName || memberInfo.petName}
                    onChange={handleInputChange}
                    className="border p-1"
                  ></input>
                ) : (
                  memberInfo.petName
                )}
              </td>
            </tr>
            <tr className="customTR">
              <th className=" customTH">Pet Age</th>
              <td className=" customTD">
                {editMode ? (
                  <input
                    type="text"
                    name="petAge"
                    value={editedInfo.petAge || memberInfo.petAge}
                    onChange={handleInputChange}
                    className="border p-1"
                  ></input>
                ) : (
                  memberInfo.petAge
                )}
              </td>
            </tr>
            <tr className="customTR">
              <th className=" customTH">Chip Number</th>
              <td className=" customTD">
                {editMode ? (
                  <input
                    type="text"
                    name="chipNumber"
                    value={editedInfo.chipNumber || memberInfo.chipNumber}
                    onChange={handleInputChange}
                    className="border p-1"
                  ></input>
                ) : (
                  memberInfo.chipNumber
                )}
              </td>
            </tr>
            <tr className="customTR">
              <th className=" customTH">Sex</th>
              <td className=" customTD">
                {editMode ? (
                  <input
                    type="text"
                    name="petType"
                    value={editedInfo.petType || memberInfo.petType}
                    onChange={handleInputChange}
                    className="border p-1"
                  ></input>
                ) : (
                  memberInfo.petType
                )}
              </td>
            </tr>

            <tr className="customTR">
              <th className=" customTH">Vaccines</th>
              <td className=" customTD">
                {editMode ? (
                  <input
                    type="text"
                    name="vaccines"
                    value={editedInfo.vaccines || memberInfo.vaccines}
                    onChange={handleInputChange}
                    className="border p-1"
                  ></input>
                ) : (
                  memberInfo.vaccines
                )}
              </td>
            </tr>
            <tr className="customTR">
              <th className=" customTH">Pet Notes</th>
              <td className=" customTD">
                {editMode ? (
                  <textarea
                    type="text"
                    name="petNotes"
                    value={editedInfo.petNotes || memberInfo.petNotes}
                    onChange={handleInputChange}
                    className="border p-1 w-full h-24"
                  ></textarea>
                ) : (
                  memberInfo.petNotes
                )}
              </td>
            </tr>
            <tr className="customTR">
              <th className=" customTH">Registration Date and Time</th>
              <td className=" customTD">
                {new Date(memberInfo.createdAt).toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="mt-7">
          <button
            onClick={handleGoBack}
            className="text-xs mr-4  text-gray-400 border border-gray-400 tracking-wide rounded-md md:text-sm p-2 pl-4 pr-4 hover:border-white hover:bg-slate-400 hover:text-white"
          >
            Back
          </button>
          <button
            onClick={toggleEditMode}
            className="text-xs ml-2 text-white bg-blue-500 hover:bg-blue-700 tracking-wide rounded-lg md:text-sm p-2 pl-5 pr-5 text-center"
          >
            {editMode ? "Cancel" : "Edit"}
          </button>
          {editMode && (
            <button
              onClick={handleSave}
              className="text-xs ml-2 text-white bg-green-500 hover:bg-green-700 tracking-wide rounded-lg md:text-sm p-2 pl-4 pr-4 text-center"
            >
              Save
            </button>
          )}
        </div>
      </div>
      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={closeConfirmDialog}
        onConfirm={confirmAction}
        confirmMessage="Are you sure to delete this users information?"
      />{" "}
    </Layout>
  );
};

export default View;
