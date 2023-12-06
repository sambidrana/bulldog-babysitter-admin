import Layout from "@/components/Layout";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

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
              <th className="border border-gray-200 customTH">Chip Number</th>
              <td className="border border-gray-500">
                {memberInfo.chipNumber}
              </td>
            </tr>

            
            <tr>
              <th className="border border-gray-200 customTH">Owner</th>
              <td className="border border-gray-500">
                {memberInfo.firstName} {memberInfo.lastName}
              </td>
            </tr>
            <tr>
              <th className="border border-gray-200 customTH">Pet Name</th>
              <td className="border border-gray-500">{memberInfo.petName}</td>
            </tr>
            <tr>
              <th className="border border-gray-200 customTH">Pet Age</th>
              <td className="border border-gray-500">{memberInfo.petAge}</td>
            </tr>

            <tr>
              <th className="border border-gray-200 customTH">Pet Notes</th>
              <td className="border border-gray-500">{memberInfo.petNotes}</td>
            </tr>
            <tr>
              <th className="border border-gray-200 customTH">Pet Type</th>
              <td className="border border-gray-500">{memberInfo.petType}</td>
            </tr>
            <tr>
              <th className="border border-gray-200 customTH">Phone</th>
              <td className="border border-gray-500">{memberInfo.phone}</td>
            </tr>
            <tr>
              <th className="border border-gray-200 customTH">Email</th>
              <td className="border border-gray-500">{memberInfo.email}</td>
            </tr>
            <tr>
              <th className="border border-gray-200 customTH">Vaccines</th>
              <td className="border border-gray-500">{memberInfo.vaccines}</td>
            </tr>
            <tr>
              <th className="border border-gray-200 customTH">Created At</th>
              <td className="border border-gray-500">
                {" "}
                {new Date(memberInfo.createdAt).toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default View;
