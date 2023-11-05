import app from "./app.js";
import connectDB from "./data/DatabaseConnection.js";

connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
