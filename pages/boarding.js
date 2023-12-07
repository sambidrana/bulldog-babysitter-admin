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
        <table className="w-full mt-10 rounded shadow-lg text-center bg-[#e9e3d0] ">
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
                        v
                      </button>
                    )}
                    {
                      {
                        asc: "🔼",
                        desc: "🔽",
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
