const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();


const pinRoute = require("./routes/pins")
const userRoute = require("./routes/users")

app.use(express.json());
app.use(
  cors({
    origin: "https://react-travel-map.herokuapp.com/",
  },
));


//Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
    .then(()=>{
        console.log("mongoDB Connected!")
    }).catch(err=>console.log(err));


app.use("/api/users", userRoute);
app.use("/api/pins", pinRoute);

app.use(express.static(path.join(__dirname, "/frontend/build")));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/frontend/build', 'index.html'));
});

//Port for Express Server

const PORT = process.env.PORT || 8800;

app.listen(PORT, ()=>{
    console.log('backend server is running on port ' + PORT)
});
