export default (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Internal server error occured." });
    });
  };
};
