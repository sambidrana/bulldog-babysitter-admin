import Layout from "@/components/Layout";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const members = () => {
  const [boardingData, setBoardingData] = useState([]);

  useEffect(() => {
    axios.get("/api/boarding").then((res) => {
      console.log(res.data);
      setBoardingData(res.data);
    });
  }, []);
  return (
    <Layout>
      <div>
        <h1 className="mb-10">Boardings</h1>
        {boardingData.map((boarding) => (
          <Link
            href={`/boarding/view/${boarding._id}`}
            key={boarding._id}
            className="p-2 flex flex-col "
          >{`${boarding.firstName} ${boarding.lastName}`}</Link>
        ))}
      </div>
    </Layout>
  );
};

export default members;
