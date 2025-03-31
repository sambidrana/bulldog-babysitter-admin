import axios from "axios";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

const DateTimeSettings = () => {
  const router = useRouter();

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

  /*
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
    */

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios
        .get(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/settings`)
        .then((res) => {
          // console.log(res.data[0].disabledDates);
          setSettingsData(res.data[0]);
        });
      // setSettingsData(data); // Store the data as an array, not a string
    };

    fetchData();
  }, []);

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
      router.refresh();
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
    router.refresh()
  };

  const handleOpeningAndClosingTime = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/hours`,
        {
          OpeningTime: timeIntervalStart,
          ClosingTime: timeIntervalEnd,
        }
      );
      // console.log("Settings saved:", response.data);
    } catch (error) {
      // Handle error (e.g., notify the user)
      console.error("Error saving settings:", error);
    }
    setTimeIntervalStart("");
    setTimeIntervalEnd("");
    router.refresh()

  };

  useEffect(() => {
    const fetchTime = async () => {
      try {
        const response = await axios(
          `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/hours`
        );
      } catch (err) {
        console.error(err);
      }
    };

    fetchTime();
  }, []);
  return (
    <>
      <div className="text-gray-800">
        <h1 className="text-sm md:text-xl text-center md:text-start font-serif font-bold p-2 mb-4 md:mb-10 ">
          Settings
        </h1>
        <div className="grid grid-cols-1 place-items-center ">
          <div>
            <div className="p-1 md:w-[700px]">
              <form
                className="border text-sm md:text-lg p-5 md:p-10"
                onSubmit={handleSubmit}
              >
                <div className="">
                  <label htmlFor="disableDateInput" className="text-gray-700">
                    Select the dates you don&apos;t want a booking to take
                    place:
                  </label>
                  <div className="flex flex-col items-center mt-5">
                    <input
                      type="date"
                      id="disableDateInput"
                      className="bg-red-200 p-2 font-semibold "
                      value={disableDateInput}
                      onChange={(e) => setDisableDateInput(e.target.value)}
                    />
                    <button
                      className="px-2 py-1 rounded-lg mt-5 bg-green-500 text-white hover:bg-green-600"
                      type="button"
                      onClick={handleAddDate}
                    >
                      Add Date
                    </button>
                  </div>
                </div>

                <div className="p-2 mt-4">
                  <h3 className="font-serif font-bold">Selected Dates:</h3>
                  <ul className="">
                    {selectedDates.map((date, index) => (
                      <li
                        className="grid grid-cols-2 gap-1 p-2 place-items-center border-b-2 "
                        key={index}
                      >
                        {date}
                        <button
                          className="px-2 py-1 bg-red-600 text-white rounded-md ml-2 hover:bg-red-700"
                          onClick={() => handleRemoveDate(date)}
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center justify-center mt-4">
                  <button
                    type="submit"
                    className="px-2 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Confirm Dates
                  </button>
                </div>
              </form>

              <div className="mt-4 p-2 text-sm md:text-lg ">
                <h1 className="font-serif text-red-600 font-semibold mb-1">
                  Disabled Dates
                </h1>
                {settingsData && settingsData.disabledDates && (
                  <ul className="list-disc ml-5 flex flex-wrap gap-6">
                    {settingsData.disabledDates
                      .map((date) => new Date(date)) // Parse ISO strings into Date objects
                      .sort((a, b) => a - b) // Sort the Date objects
                      .map((date, index) => (
                        <li className="text-gray-600" key={index}>
                          {date.toLocaleDateString()}
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
          <div className="p-2 mt-5 md:w-[700px]">
            <form
              className="border text-sm md:text-lg p-5 md:p-10"
              onSubmit={handleEnableDate}
            >
              <div className="flex flex-col items-center mt-5">
                <label htmlFor="enableDate">
                  <p className="text-gray-700">
                    <span className="text-green-500 font-semibold">Enable </span>
                    Booking Date
                  </p>
                </label>
                <input
                  type="date"
                  id="enableDate"
                  className="bg-green-100 p-2 mt-4 font-semibold"
                  value={enableDate}
                  onChange={(e) => setEnableDate(e.target.value)}
                />
                <div className="mt-4">
                  <button
                    type="submit"
                    className="px-2 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="p-2 md:w-[700px]">
            <form
              className="border text-sm md:text-lg p-5 md:p-10"
              onSubmit={handleOpeningAndClosingTime}
            >
              <label className="font-bold">Select </label>
              <div className="flex flex-col items-center mt-5">
                <label className="text-green-500" htmlFor="openingTime">
                  Opening Time
                </label>
                <input
                  type="time"
                  id="openingTime"
                  className="bg-green-100 p-2 mt-4 font-semibold"
                  value={timeIntervalStart}
                  onChange={(e) => setTimeIntervalStart(e.target.value)}
                />
              </div>
              <div className="flex flex-col items-center mt-5">
                <label className="text-red-500" htmlFor="closingTime">
                  Closing Time
                </label>
                <input
                  type="time"
                  id="closingTime"
                  className="bg-red-100 p-2 mt-4 font-semibold"
                  value={timeIntervalEnd}
                  onChange={(e) => setTimeIntervalEnd(e.target.value)}
                />
              </div>
              <div className="flex justify-center items-center mt-5">
                <button
                  type="submit"
                  className="px-2 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 "
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
export default DateTimeSettings;
