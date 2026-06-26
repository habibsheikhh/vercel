import express from "express"
import { S3 } from "aws-sdk"
const app = express()

const s3 = new S3({
    accessKeyId: "321db901c0faa64607a6bde5dcf07123",
    secretAccessKey: "7503114c10f2c5bc0da58a1a0be8229d9247528a5aeec7c8d8814ebca55db961",
    endpoint: "https://9c2a90dc4d3b0f52d06795bdf7b541f8.r2.cloudflarestorage.com"
})

app.get("/*", async (req, res) => {
    const host = req.hostname;
    const id = host.split(".")[0]
    const filePath = req.path;

    const contents = await s3.getObject({
        Bucket: "vercel",
        Key: `dist/${id}${filePath}`
    }).promise()

    const type = filePath.endsWith("html") ? "text/html" : filePath.endsWith("css") ? "text/css" : "application/javascript"

    res.set("Content-Type", type)

    res.send(contents.Body)
})

app.listen(3001);
