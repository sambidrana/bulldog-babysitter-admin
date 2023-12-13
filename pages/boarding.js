import Layout from "@/components/Layout";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Filters from "@/components/Filters";
import FilterBoarding from "@/components/FilterBoarding";

const columns = [
  {
    accessorKey: "firstName",
    header: "First Name",
    cell: (props) => <p>{props.getValue()}</p>,
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
    cell: (props) => <p>{props.getValue()}</p>,
  },
  {
    accessorKey: "petName",
    header: "Pet Name",
    cell: (props) => <p>{props.getValue()}</p>,
  },
];

const members = () => {
  const [boardingData, setBoardingData] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);

  const table = useReactTable({
    data: boardingData,
    columns,
    state: {
      columnFilters,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  useEffect(() => {
    axios.get("/api/boarding").then((res) => {
      // console.log(res.data);
      setBoardingData(res.data);
    });
  }, []);
  return (
    <Layout>
      <div className="mt-10 pl-16 pr-24 ">
        <FilterBoarding
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
        />
        <table className="w-full mt-10  shadow-lg text-center bg-[#dcdad7] ">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="customTR">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="p-4 text-lg text-gray-600  bg-[#f3e9c6]"
                  >
                    {header.column.columnDef.header}
                    {header.column.getCanSort() && (
                      <button
                        className="ml-2 pl-2"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-6 h-6 justify-items-center"
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
                            className="w-5 h-5 inline-block"
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
                            className="w-5 h-5 inline-block"
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
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="customTR">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="customTD border border-black">
                    <Link href={`/boarding/view/${row.original._id}`}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Link>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default members;
