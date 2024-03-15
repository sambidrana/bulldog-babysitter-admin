import axios from "axios";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";

const DateTimeSettings = () => {
  //Get Existing Disabled Dates
  const [settingsData, setSettingsData] = useState({});
  //Disable Dates Section
  const [disableDateInput, setDisableDateInput] = useState("");
  const [selectedDates, setSelectedDates] = useState([]);
  const [disabledDates, setDisabledDates] = useState([]);
  //Enable Date Section
  const [enableDate, setEnableDate] = useState("");
  //Time Interval Section
  const [timeIntervalStart, setTimeIntervalStart] = useState("");
  const [timeIntervalEnd, setTimeIntervalEnd] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/settings`
      );
      const data = await response.json();
      setSettingsData(data); // Store the data as an array, not a string
    };

    fetchData();
  }, []);
  // console.log(settingsData);

  const handleAddDate = () => {
    if (disableDateInput && !disabledDates.includes(disableDateInput)) {
      setDisabledDates([...disabledDates, disableDateInput]);
      setSelectedDates([...disabledDates, disableDateInput]);
    }
    // console.log(disabledDates);
  };

  const handleRemoveDate = (dateToRemove) => {
    setDisabledDates(disabledDates.filter((date) => date !== dateToRemove));
    setSelectedDates(disabledDates.filter((date) => date !== dateToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedDates = disabledDates.map((dateStr) =>
        new Date(dateStr).toISOString()
      );
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/settings`,
        {
          newDisabledDate: formattedDates, // Sending the entire array of dates
        }
      );
      // console.log(response.data);

      // Update the disabledDates state with the data from the response
      if (response.data && response.data.disabledDates) {
        setDisabledDates(
          response.data.disabledDates.map(
            (date) => new Date(date).toISOString().split("T")[0]
          )
        );
      }

      setDisableDateInput(""); // Clear the input field after submission
      setSelectedDates([]); // Clear the input field after submission
    } catch (error) {
      console.error("Error submitting date:", error);
    }
  };

  const handleEnableDate = async (e) => {
    e.preventDefault();
    try {
      // Send DELETE request to backend with the date to be enabled
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/settings`,
        {
          data: { dateToEnable: enableDate },
        }
      );
      // console.log(response.data);

      // Update local state to reflect the change
      setDisabledDates((currentDates) =>
        currentDates.filter((date) => date !== enableDate)
      );
    } catch (error) {
      console.error("Error enabling date:", error);
    }
    setEnableDate(""); // Clear the input field after submission
  };

  const handleOpeningAndClosingTime = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/hours`, {
        OpeningTime: timeIntervalStart,
        ClosingTime: timeIntervalEnd,
      });
      // console.log("Settings saved:", response.data);
    } catch (error) {
      // Handle error (e.g., notify the user)
      console.error("Error saving settings:", error);
    }
    setTimeIntervalStart("");
    setTimeIntervalEnd("");
  };

  useEffect(() => {
    const fetchTime = async () => {
      try {
        const response = await axios(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/hours`);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTime();
  }, []);
  return (
    <>
      <h1 className="text-xl font-serif font-bold p-2 mb-10 ">Settings</h1>
      <div className="pl-2 pr-2 grid grid-cols-1 md:grid-cols-2">
        <div className="p-1">
          <form
            className="border max-w-xl md:text-lg p-10"
            onSubmit={handleSubmit}
          >
            <div className="">
              <label htmlFor="disableDateInput" className="">
                Select the dates you don't want a booking to take place:
              </label>
              <div>
                <input
                  type="date"
                  id="disableDateInput"
                  className="bg-red-200  p-2 font-semibold "
                  value={disableDateInput}
                  onChange={(e) => setDisableDateInput(e.target.value)}
                />
                <button
                  className="px-2 py-1 rounded-lg mt-10 bg-green-500 ml-4 text-white"
                  type="button"
                  onClick={handleAddDate}
                >
                  Add Date
                </button>
              </div>
            </div>

            <div className="p-2 mt-4">
              <h3 className="md:text-lg font-serif font-bold">
                Selected Dates:
              </h3>
              <ul className="p-2">
                {selectedDates.map((date, index) => (
                  <li className="p-2 border-b-2 w-fit" key={index}>
                    {date}
                    <button
                      className="px-2 py-1 bg-red-600 text-white rounded-md ml-4"
                      onClick={() => handleRemoveDate(date)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center justify-center p-4">
              <button
                type="submit"
                className="px-2 py-1 bg-blue-400 text-white rounded-lg "
              >
                Confirm Dates
              </button>
            </div>
          </form>
          <div className="mt-4 p-2">
            <h1 className="text-lg font-serif font-semibold mb-1">
              Disabled Dates
            </h1>
            {settingsData && settingsData.disabledDates && (
              <ul className="list-disc pl-5">
                {settingsData.disabledDates.map((date, index) => (
                  <li className="text-lg" key={index}>
                    {new Date(date).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="p-2 mt-20 ">
          <form
            className="border max-w-xl md:text-lg p-10"
            onSubmit={handleEnableDate}
          >
            <div className="grid grid-cols-1 ">
              <label htmlFor="enableDate">Enable Booking Date</label>
              <input
                type="date"
                id="enableDate"
                className="bg-green-100 p-2 mt-4 font-semibold"
                value={enableDate}
                onChange={(e) => setEnableDate(e.target.value)}
              />
            </div>
            <div className="mt-4">
              <button
                type="submit"
                className="px-2 py-1 bg-blue-400 text-white rounded-lg "
              >
                Confirm
              </button>
            </div>
          </form>
        </div>
        <div className="p-2">
          <h2>Select Opening and Closing Timings</h2>
          <form
            className="border max-w-xl md:text-lg p-10"
            onSubmit={handleOpeningAndClosingTime}
          >
            <div className="grid grid-cols-1 ">
              <label htmlFor="openingTime">Opening Time</label>
              <input
                type="time"
                id="openingTime"
                className="bg-green-100 p-2 mt-4 font-semibold"
                value={timeIntervalStart}
                onChange={(e) => setTimeIntervalStart(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 ">
              <label htmlFor="closingTime">Closing Time</label>
              <input
                type="time"
                id="closingTime"
                className="bg-green-100 p-2 mt-4 font-semibold"
                value={timeIntervalEnd}
                onChange={(e) => setTimeIntervalEnd(e.target.value)}
              />
            </div>
            <div className="mt-4">
              <button
                type="submit"
                className="px-2 py-1 bg-blue-400 text-white rounded-lg "
              >
                Confirm
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
export default DateTimeSettings;
