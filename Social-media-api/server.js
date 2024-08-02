const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectdb = require("./config/dbconfig.js");
const authrouter = require("./routes/authroutes.js");
const { notfound, errorhandler } = require("./middlewares/errorhandler.js");
const createpostrouter = require("./routes/postroutes.js");

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

// Connect to database
connectdb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Mount the authrouter
app.use('/api/v1/auth/user', authrouter);
app.use('/api/v1/post', createpostrouter)

// 404 middleware should be after all the routes
app.use(notfound);

// Error handler middleware
app.use(errorhandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
