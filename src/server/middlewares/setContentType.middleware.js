export default function (req, res, next) {
  if (req.query.download === "1") {
    const filename = req.path.split("/").slice(1).join("_");
    res.set("Content-Disposition", "attachment; filename=" + filename);
    res.set("Content-Type", "application/octet-stream");
  }
  next();
}
