import fs from "fs";
import https from "https";
import path from "path";
import sharp from "sharp";

export default function (links, dir, forcedFormat) {
  console.log(links);
  fs.mkdirSync(dir);
  const downloadedLinks = [];
  let downloadedCount = 0;

  return new Promise((resolve) =>
    links.forEach((element, index) => {
      const url = typeof element === "string" ? element : element.url;

      const extention = path.extname(new URL(url).pathname);
      const filename = (element.filename || index) + extention;

      https.get(url, function (response) {
        const data = [];
        response.on("data", function (chunk) {
          data.push(chunk);
        });

        response.on("end", async () => {
          const buffer = Buffer.concat(data);
          fs.writeFileSync(dir + filename, buffer);

          if ([".mp4", ".m4a", ".mp3"].includes(extention)) {
            downloadedLinks[index] = {
              path: dir + filename,
              format: forcedFormat ?? extention.slice(1),
            };
          }
          //
          else {
            const image = sharp(buffer);
            const metadata = await image.metadata();

            const size = { width: 300, height: 300 };
            if (metadata.height < metadata.width) delete size.height;
            else if (metadata.width < metadata.height) delete size.width;

            const blur = await image.resize(size).blur(30).toBuffer();
            downloadedLinks[index] = {
              path: dir + filename,
              format: metadata.format,
              width: metadata.width,
              height: metadata.height,
              blur: blur.toString("base64"),
            };
          }
          //
          if (++downloadedCount === links.length) {
            fs.writeFileSync(dir + ".lastaccessed", Date.now().toString());
            resolve(downloadedLinks);
          }
          // console.log("Download Completed.")
        });
      });
    })
  );
}
