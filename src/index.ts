// id - 321db901c0faa64607a6bde5dcf07123
// secret - 7503114c10f2c5bc0da58a1a0be8229d9247528a5aeec7c8d8814ebca55db961
// url - https://9c2a90dc4d3b0f52d06795bdf7b541f8.r2.cloudflarestorage.com

import express from "express"
import simpleGit from "simple-git"
import cors from "cors"
import { generate } from "./utils"
import path from "path";
import { getAllFiles } from "./file";
import { uploadFile } from "./aws";


import { createClient } from "redis"
const publisher = createClient();
publisher.connect();

// uploadFile("habibsheikhh/testing/package.json", "D:/Projects/vercel/dist/output/qzz83/package.json")

const app = express()

app.use(express.json())
app.use(cors())

app.post("/deploy", async (req, res) => {
    const repoUrl = req.body.repoUrl;
    const id = generate();

    await simpleGit().clone(repoUrl, path.join(__dirname, `output/${id}`));

    const files = getAllFiles(path.join(__dirname, `output/${id}`));

    files.forEach(async file => {
        await uploadFile(file.slice(__dirname.length + 1), file)
    })

    publisher.lPush("build-queue", id);

    res.json({
        id : id
    })
})

app.listen(3000);