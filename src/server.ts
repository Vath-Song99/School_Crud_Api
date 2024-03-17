import connectToDatabase from "./utils/connecToDb";
import app from './app'


// Connect to database
connectToDatabase();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[Server] is running on port ${PORT}`);
});
