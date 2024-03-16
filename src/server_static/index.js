import cors from "cors";
import express from "express";
import fallback from "express-history-api-fallback";

// import url from "url"
// import path from "path"
// const __filename = url.fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

const app = express();
const cwd = process.cwd();

app.use(cors());
app.use(express.static("dist"));

app.use("/classic", fallback("index.html", { root: cwd + "/dist/classic" }));
app.use(fallback("index.html", { root: cwd + "/dist" }));

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log("server started: http://localhost:" + PORT));
