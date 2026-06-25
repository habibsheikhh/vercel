import { createClient } from "redis";
import { copyFinalDist, downloadS3Folder } from "./aws";
import { buildProject } from "./utils";

const subscriber = createClient();

async function main() {
    await subscriber.connect();

    while (true) {  // pulls id's on redis queue infinetely
        const response = await subscriber.brPop("build-queue", 0);
        // @ts-ignore
        const id = response.element;

        await downloadS3Folder(`output/${id}`);
        console.log("downloaded")
        await buildProject(id);
        await copyFinalDist(id);
    }
}

main();

