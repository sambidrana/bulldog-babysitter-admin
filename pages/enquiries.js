import Layout from "@/components/Layout";
import React, { useEffect, useState } from "react";
import axios from "axios";
const enquiries = () => {
  const [enquiryList, setEnquiryList] = useState([]);

  useEffect(() => {
    axios.get("/api/enquiry").then((res) => {
      setEnquiryList(res.data);
      console.log(res.data);
    });
  }, []);
  return (
    <>
      <Layout>
        <div className=" mx-auto overflow-x-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-bold p-4 bg-gray-200 rounded-t-lg">
            <div className="hidden md:block">Name</div>
            <div className="hidden md:block">Phone</div>
            <div className="hidden md:block">Email</div>
            <div className="hidden md:block">Message</div>
          </div>

          {enquiryList.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border-b"
            >
              <div className="text-gray-600 font-serif tracking-wide">{item.name}</div>
              <div className="tracking-wide">
                <a
                  href={`tel:${item.contact}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {item.contact}
                </a>
              </div>{" "}
              <div className="">
                <a
                  href={`mailto:${item.email}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {item.email}
                </a>
              </div>{" "}
              <div className="font-sans" >{item.message}</div>
            </div>
          ))}
        </div>
      </Layout>
    </>
  );
};

export default enquiries;

/*
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowPublicReadObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3.GetObject",
            "Resource": "arn:aws:s3:::bulldogbabysitter-upload/*",
 
        },
        ],
}
*/
