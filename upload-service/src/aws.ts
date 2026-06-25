import { S3 } from "aws-sdk"
import fs from "fs"

const s3 = new S3({
    accessKeyId: "321db901c0faa64607a6bde5dcf07123",
    secretAccessKey: "7503114c10f2c5bc0da58a1a0be8229d9247528a5aeec7c8d8814ebca55db961",
    endpoint: "https://9c2a90dc4d3b0f52d06795bdf7b541f8.r2.cloudflarestorage.com"
})

export const uploadFile = async (fileName: string, localFilePath: string) => {
    console.log("called")

    const fileContent = fs.readFileSync(localFilePath);

    const key = fileName.replace(/\\/g, "/");
    const response = await s3.upload({
        Body: fileContent,
        Bucket: "vercel",
        Key: key,
    }).promise();
    console.log(response);
}