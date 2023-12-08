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
import Filters from "./Filters";
import Link from "next/link";
const columns = [
  {
    accessorKey: "firstName",
    header: "Owner",
    enableSorting: false,
    cell: (props) => (
      <Link href={`/boarding/view/${props.row.original._id}`}>
        {`${props.row.original.firstName} ${props.row.original.lastName}`}
      </Link>
    ),
  },
  {
    accessorKey: "petName",
    header: "Pet Name",
    enableSorting: false,
    cell: (props) => <p style={{ color: "blue" }}>{props.getValue()}</p>,
    // cell: (props) => <p>{props?.row?.original?.associatedBoarding?.petName}</p>,
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: (props) => <p style={{ color: "green" }}>{props.getValue()}</p>,
  },
  {
    accessorKey: "startTime",
    header: "Start Time",
    cell: (props) => <p>{props.getValue()}</p>,
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    cell: (props) => <p style={{ color: "red" }}>{props.getValue()}</p>,
  },
  {
    accessorKey: "endTime",
    header: "End Time",
    cell: (props) => <p>{props.getValue()}</p>,
  },
  {
    accessorKey: "updatedAt",
    header: "Booked At",
    cell: (props) => {
      const createdAt = new Date(props.getValue());
      const formattedEndTime = `${createdAt.toLocaleDateString()} ${createdAt.toLocaleTimeString()}`; // Adjust the format as needed
      return <p>{formattedEndTime}</p>;
    },
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
  // console.log(columnFilters);
  // console.log(table.getHeaderGroups());
  return (
    <>
      <div className="mt-8 pl-10 pr-10">
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6.97 2.47a.75.75 0 011.06 0l4.5 4.5a.75.75 0 01-1.06 1.06L8.25 4.81V16.5a.75.75 0 01-1.5 0V4.81L3.53 8.03a.75.75 0 01-1.06-1.06l4.5-4.5zm9.53 4.28a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V7.5a.75.75 0 01.75-.75z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  )}
                  {
                    {
                      asc: (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a.75.75 0 01-.75-.75V4.66L7.3 6.76a.75.75 0 11-1.1-1.02l3.25-3.5a.75.75 0 011.1 0l3.25 3.5a.75.75 0 01-1.1 1.02l-1.95-2.1v12.59A.75.75 0 0110 18z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ),
                      desc: (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ),
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
              table.getCanPreviousPage() ? "" : "cursor-not-allowed"
            }`}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </button>
          <button
            className={`p-2 pr-4 pl-4 text-lg border rounded-md hover:bg-gray-100 hover:text-white ${
              table.getCanNextPage() ? "" : "cursor-not-allowed"
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
