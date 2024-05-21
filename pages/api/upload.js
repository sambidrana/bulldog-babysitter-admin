import { mongooseConnect } from "@/lib/mongoose";
import Cors from "cors";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import multiparty from "multiparty";
import fs from "fs";
import mime from "mime-types";
import formidable from "formidable";

// import http from "node:http";

const bucketName = "bulldogbabysitter-uploads";
const cors = Cors({
  origin: process.env.NEXT_PUBLIC_CORS_ORIGIN,
  methods: ["POST"],
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handleUpload(req, res) {
  await mongooseConnect();
  await runMiddleware(req, res, cors);

  if (req.method === "POST") {
    const form = new formidable.IncomingForm();
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });
    console.log("field INFO", fields);
    console.log("FILES INFO", files); //

    // Initialize S3 Client with new v3 syntax

    const client = new S3Client({
      region: "ap-southeast-2",
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
    });

    //sub folder
    const userId = fields.userID;

    //pet image
    const petImage = files.petImage;
    const originalpetImageName = petImage.originalFilename;
    const fileExtPet = originalpetImageName.split(".").pop();
    const newPetImageName =
      Date.now() + "-" + petImage.newFilename + "." + fileExtPet;

    //vaccine image
    const vaccineImage = files.vaccineImage;
    const originalVaccineImageName = vaccineImage.originalFilename;
    const fileExtVaccine = originalVaccineImageName.split(".").pop();
    const newVaccineImageName =
      Date.now() + "-" + vaccineImage.newFilename + "." + fileExtVaccine;

    console.log(
      "newPetImageName: " + newPetImageName,
      "newVaccineImageName: " + newVaccineImageName
    );

    /* 
    // const file = files.file;
    // const originalFilename = file.originalFilename;
    // const fileExtension = originalFilename.split(".").pop();
    // const newFilename =
    //   Date.now() + "-" + file.newFilename + "." + fileExtension; // Append the extension to the new file name
    
    // console.log(newFilename);
    */
    /* 
    
    await client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: newFilename,
        // Body: fs.createReadStream(file.path),
        Body: fs.readFileSync(file.filepath),
        // ACL: "public-read",
        ContentType: file.mimetype,
      })
      );
      const link = `https://${bucketName}.s3.amazonaws.com/${newFilename}`;
      return res.json({ link });
      */

    await Promise.all([
      client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: `${userId}/petImage/${newPetImageName}`,
          Body: fs.readFileSync(petImage.filepath),
          ContentType: petImage.mimetype,
        })
      ),
      client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: `${userId}/vaccineImage/${newVaccineImageName}`,
          Body: fs.readFileSync(vaccineImage.filepath),
          ContentType: vaccineImage.mimetype,
        })
      ),
    ]);

    const links = {
      petImage: `https://${bucketName}.s3.amazonaws.com/${userId}/petImage/${newPetImageName}`,
      vaccineImage: `https://${bucketName}.s3.amazonaws.com/${userId}/vaccineImage/${newVaccineImageName}`,
    };

    return res.json({ links });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
