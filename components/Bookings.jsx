import { useEffect, useState } from "react";
import axios from "axios";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { getValue } from "@mui/system";
import Filters from "./Filters";
// import { getValue } from "@mui/system";
const columns = [
  {
    accessorKey: "firstName",
    header: "Owner",
    size: 225,
    cell: (props) => <p>{props.getValue()}</p>,
    // cell: (props) => (
    //   <p>{props?.row?.original?.associatedBoarding?.firstName}</p>
    // ),
  },
  {
    accessorKey: "petName",
    header: "Pet Name",
    cell: (props) => <p>{props.getValue()}</p>,
    // cell: (props) => <p>{props?.row?.original?.associatedBoarding?.petName}</p>,
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: (props) => <p>{props.getValue()}</p>,
  },
  {
    accessorKey: "startTime",
    header: "Start Time",
    cell: (props) => <p>{props.getValue()}</p>,
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    cell: (props) => <p>{props.getValue()}</p>,
  },
  {
    accessorKey: "endTime",
    header: "End Time",
    cell: (props) => <p>{props.getValue()}</p>,
  },
];

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [boarding, setBoarding] = useState([]);
  const [bookingsWithBoarding, setBookingsWithBoarding] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);

  useEffect(() => {
    // Fetch user bookings
    axios
      .get("/api/userbookings")
      .then((res) => {
        const bookingData = res.data;
        setBookings(bookingData);
        console.log(bookingData);

        // Fetch user information and create a mapping by userId
        axios
          .get("/api/boarding")
          .then((res) => {
            setBoarding(res.data);
            console.log(boarding);
          })
          .catch((error) => {
            console.error("Error fetching user information:", error);
          });
      })
      .catch((error) => {
        console.error("Error fetching user bookings:", error);
      });
  }, []);

  // Function to associate bookings with boarding details
  function associateBookingsWithBoarding(bookings, boarding) {
    return bookings.map((booking) => {
      const associatedBoarding =
        boarding.find((b) => b.userId === booking.userId) || null;
      return { ...booking, ...associatedBoarding };
    });
  }

  // Resulting array of bookings with associated boarding details
  // const bookingsWithBoarding = associateBookingsWithBoarding(
  //   bookings,
  //   boarding
  // );

  useEffect(() => {
    const updatedBookingsWithBoarding = associateBookingsWithBoarding(
      bookings,
      boarding
    );
    setBookingsWithBoarding(updatedBookingsWithBoarding);
  }, [bookings, boarding]);

  console.log(bookingsWithBoarding);

  const table = useReactTable({
    data: bookingsWithBoarding,
    columns,
    state: {
      columnFilters,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    columnResizeMode: "onChange",
  });

  // const bookingDetails = bookings.map((booking) => {
  //   const user = boarding[booking.userId];
  //   return user ? { firstName: user.firstName, lastName: user.lastName } : null;
  // });
  console.log(columnFilters);
  console.log(table.getHeaderGroups());
  return (
    <>
      <div className="mt-8">
        <Filters
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
        />
        <div className="table" style={{ width: `${table.getTotalSize()}px` }}>
          {table.getHeaderGroups().map((headerGroup) => (
            <div className="tr" key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <div
                  className="th"
                  style={{ width: `${header.getSize()}px` }}
                  key={header.id}
                >
                  {header.column.columnDef.header}
                  {header.column.getCanSort() && (
                    <button
                      className="ml-2 font-extralight"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      v
                    </button>
                  )}
                  {
                    {
                      asc: "🔼",
                      desc: "🔽",
                    }[header.column.getIsSorted()]
                  }
                  <div
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                    className={`resizer ${
                      header.column.getIsResizing() ? "isResizing" : ""
                    }`}
                  />
                </div>
              ))}
            </div>
          ))}
          {table.getRowModel().rows.map((row) => (
            <div className="tr" key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <div
                  className="td"
                  style={{ width: `${cell.column.getSize()}px` }}
                  key={cell.id}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div>
          <p className="mt-6">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </p>
        </div>
        <div>
          <button
            className={`p-2 pr-4 pl-4 text-lg border rounded-md hover:bg-gray-100 hover:text-white ${
              table.getCanPreviousPage()
                ? ""
                : "cursor-not-allowed"
            }`}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </button>
          <button
            className={`p-2 pr-4 pl-4 text-lg border rounded-md hover:bg-gray-100 hover:text-white ${
              table.getCanNextPage()
                ? ""
                : "cursor-not-allowed"
            }`}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {">"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Bookings;

/*
<div className="mt-8">
        <h1>Bookings</h1>
        <table className="w-full mt-6 text-left rounded shadow-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th>By</th>
              <th>Start Date</th>
              <th>Start Time</th>
              <th>End Date</th>
              <th>End Time</th>
              <th>Pet Name</th>
            </tr>
          </thead>
          {bookingsWithBoarding.map((booking, index) => (
            <tbody key={index}>
              <tr>
                <td>
                  {booking.associatedBoarding
                    ? `${booking.associatedBoarding.firstName} ${booking.associatedBoarding.lastName}`
                    : "Unknown User"}
                </td>
                <td>{booking.startDate}</td>
                <td>{booking.startTime}</td>
                <td>{booking.endDate}</td>
                <td>{booking.endTime}</td>
                <td>
                  {booking.associatedBoarding
                    ? booking.associatedBoarding.petName
                    : "Unknown Pet"}
                </td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>
*/
