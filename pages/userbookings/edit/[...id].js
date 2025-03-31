import Layout from "@/components/Layout";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

const ViewBooking = () => {
  const [bookingInfo, setBookingInfo] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedInfo, setEditedInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();
  const { id, firstName, lastName, petName } = router.query;

  // Helper function to convert DD/MM/YYYY to YYYY-MM-DD
  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("Failed to get booking info.");
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/userbookings?id=${id}`
        );
        setBookingInfo(response.data);
      } catch (error) {
        setError("Failed to fetch booking info. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedInfo((prev) => ({ ...prev, [name]: value }));
  };

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    if (!editMode) {
      setEditedInfo({});
    }
  };

  const handleSave = async () => {
    console.log(editedInfo);
    console.log(bookingInfo._id);

    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/userbookings?id=${id}`,
        {
          ...editedInfo,
          id: bookingInfo._id,
        }
      );
      setBookingInfo(response.data);
      setEditMode(false);
    } catch (error) {
      console.error("Failed to save booking info:", error.message);
    }
  };

  return (
    <Layout>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : bookingInfo ? (
        <div className="text-gray-800 font-serif">
          {/* User Information */}
          <div>
            <h1 className="text-2xl">
              You are changing the Booking Information for:
            </h1>
            <h3 className="text-xl mt-2 ">
              {`${firstName} ${lastName} (${petName})`}
            </h3>
          </div>
          {/* Editable Information */}
          <div className="mt-10 text-lg">
            <div>
              <label className="mr-10 p-10">Start Date:</label>
              {editMode ? (
                <input
                  type="date"
                  name="startDate"
                  value={
                    editedInfo.startDate || formatDate(bookingInfo.startDate)
                  }
                  onChange={handleInputChange}
                />
              ) : (
                new Date(formatDate(bookingInfo.startDate)).toLocaleDateString(
                  "en-GB"
                )
              )}
            </div>
            <div>
              <label className="mr-10 p-10">Start Time:</label>
              {editMode ? (
                <input
                  type="time"
                  name="startTime"
                  step="900"
                  value={editedInfo.startTime || bookingInfo.startTime}
                  onChange={handleInputChange}
                />
              ) : (
                bookingInfo.startTime
              )}
            </div>
            <div>
              <label className="mr-10 p-10">End Date:</label>
              {editMode ? (
                <input
                  type="date"
                  name="endDate"
                  value={editedInfo.endDate || formatDate(bookingInfo.endDate)}
                  onChange={handleInputChange}
                />
              ) : (
                new Date(formatDate(bookingInfo.endDate)).toLocaleDateString(
                  "en-GB"
                )
              )}
            </div>
            <div>
              <label className="mr-10 p-10">End Time:</label>
              {editMode ? (
                <input
                  type="time"
                  name="endTime"
                  step="900"
                  value={editedInfo.endTime || bookingInfo.endTime}
                  onChange={handleInputChange}
                />
              ) : (
                bookingInfo.endTime
              )}
            </div>
          </div>
          {/* Action Buttons */}
          <div className="mt-16">
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
      ) : (
        <div>No booking information available</div>
      )}
    </Layout>
  );
};

export default ViewBooking;
