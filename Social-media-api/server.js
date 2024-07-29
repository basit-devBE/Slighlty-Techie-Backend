const express = require("express");
const dotenv = require("dotenv");
const authrouter = require("./routes/authroutes.js");
const morgan = require("morgan");

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan("combined"))

app.use('/api/v1/auth/user', authrouter)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
