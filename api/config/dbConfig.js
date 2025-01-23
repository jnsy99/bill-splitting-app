const mongoose = require("mongoose");

const port = process.env.PORT || 5000;

module.exports = (app) => {
  mongoose
    .connect(process.env.DB_URL)
    .then(() => {
      app.listen(port, () => {
        console.log(`App is running at : ${port}`);
      });
    })
    .catch((err) => logger.error("MongoDB connection error:", err));
};
