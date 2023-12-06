import Layout from "@/components/Layout";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const View = () => {
  const [memberInfo, setMemberInfo] = useState(null); // Change initial state to null
  const router = useRouter();
  const { id } = router.query;
  useEffect(() => {
    if (!id) return;
    axios.get(`/api/boarding?id=${id}`).then((res) => {
      //   console.log(res.data);
      setMemberInfo(res.data);
    });
  }, [id]);

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

  return (
    <Layout>
      <div className="mt-10 ml-10">
        <table className="w-full mt-6 text-left rounded shadow-sm">
          <tbody>
            <tr>
              <td className="pt-5 text-2xl pb-4 pl-5 font-semibold text-gray-500 bg-white">
                Owner's Information
              </td>
            </tr>
            <tr className="customTR">
              <th className=" customTH">Owner</th>
              <td className=" customTD">
                {memberInfo.firstName} {memberInfo.lastName}
              </td>
            </tr>
            <tr className="customTR">
              <th className=" customTH">Phone</th>
              <td className=" customTD">{memberInfo.phone}</td>
            </tr>
            <tr className="customTR">
              <th className=" customTH">Email</th>
              <td className=" customTD">{memberInfo.email}</td>
            </tr>

            <tr>
              <td className="pt-10 text-2xl pb-4 pl-5 font-semibold text-gray-500 bg-white">
                Dog's Details
              </td>
            </tr>

            <tr className="customTR">
              <th className=" customTH">Pet Name</th>
              <td className=" customTD">{memberInfo.petName}</td>
            </tr>
            <tr className="customTR">
              <th className=" customTH">Pet Age</th>
              <td className=" customTD">{memberInfo.petAge}</td>
            </tr>
            <tr className="customTR">
              <th className=" customTH">Chip Number</th>
              <td className=" customTD">{memberInfo.chipNumber}</td>
            </tr>
            <tr className="customTR">
              <th className=" customTH">Pet Notes</th>
              <td className=" customTD">{memberInfo.petNotes}</td>
            </tr>
            <tr className="customTR">
              <th className=" customTH">Pet Type</th>
              <td className=" customTD">{memberInfo.petType}</td>
            </tr>

            <tr className="customTR">
              <th className=" customTH">Vaccines</th>
              <td className=" customTD">{memberInfo.vaccines}</td>
            </tr>
            <tr className="customTR">
              <th className=" customTH">Registration Date and Time</th>
              <td className=" customTD">
                {" "}
                {new Date(memberInfo.createdAt).toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="mt-7">
          <Link
            href={"/boarding"}
            className=" text-gray-400 border border-gray-400 rounded-md p-2 pl-4 pr-4 hover:border-white hover:bg-slate-400 hover:text-white"
          >
            Back
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default View;
