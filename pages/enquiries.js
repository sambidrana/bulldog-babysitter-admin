import Layout from "@/components/Layout";
import React from "react";
import axios from "axios";
const enquiries = () => {
  const uploadImage = async (e) => {
    const file = e.target?.files[0]; // Get the first file
    if (file) {
      const data = new FormData();
      data.append("file", file);

      try {
        const response = await axios.post("/api/upload", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Upload successful", response.data);
        // Handle the response here (e.g., show success message or image preview)
      } catch (error) {
        console.error("Upload error", error);
        // Handle the error here (e.g., show error message)
      }
    }
  };
  return (
    <Layout>
      <form>
        <div>
          <div>
            <label>
              <span>Add a photo</span>
              <input onChange={uploadImage} type="file" />
            </label>
          </div>
        </div>
      </form>
    </Layout>
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