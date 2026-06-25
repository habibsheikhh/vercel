import { S3 } from "aws-sdk"
import { resolve } from "dns";
import fs from "fs"
import path from "path"
import { getAllFiles } from "./utils";

const s3 = new S3({
    accessKeyId: "321db901c0faa64607a6bde5dcf07123",
    secretAccessKey: "7503114c10f2c5bc0da58a1a0be8229d9247528a5aeec7c8d8814ebca55db961",
    endpoint: "https://9c2a90dc4d3b0f52d06795bdf7b541f8.r2.cloudflarestorage.com"
})


export async function downloadS3Folder (prefix : string) {
    const allFiles = await s3.listObjectsV2({
        Bucket: "vercel",
        Prefix: prefix
    }).promise();

    const allPromises = allFiles.Contents?.map(async ({Key}) => {
        return new Promise(async (resolve) => {
            if(!Key) {
                resolve("");
                return;
            }
            const finalOutputPath = path.join(__dirname, Key);
            const dirName = path.dirname(finalOutputPath);
            if(!fs.existsSync(dirName)) {
                fs.mkdirSync(dirName, {  recursive: true  });
            }

            const outputFile = fs.createWriteStream(finalOutputPath);
            s3.getObject({
                Bucket: "vercel",
                Key: Key || ""
            }).createReadStream().pipe(outputFile)
            .on("finish", () => {
                resolve("");
            })
        })

    }) || []

    console.log("awaiting")
    
    await Promise.all(allPromises.filter(x => x != undefined));
}

export function copyFinalDist (id: string) {
    const folderPath= path.join(__dirname, `output/${id}/dist`);
    const allFiles = getAllFiles(folderPath);
    allFiles.forEach(file => {
        uploadFile(`dist/${id}/` + file.slice(folderPath.length + 1) ,file)
    })
}


const uploadFile = async (fileName: string, localFilePath: string) => {
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
