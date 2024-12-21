const express = require('express');
const path = require('path');// for ejs
const cookieparser= require('cookie-parser');
const urlRoute = require('./routes/url');
const staticRoute = require('./routes/staticRouter');
const userRoute = require('./routes/user');

const { connectToMongoDB } = require('./connect');
const { restrictToLoggedinUserOnly, checkAuth } = require("./middlewares/auth");
const app = express();
const PORT = 8001;

connectToMongoDB("mongodb://localhost:27017/short-url").then(() =>
	console.log("MongoDB Connected")
);

app.set("view engine", "ejs");
app.set("views",path. resolve("./views"));// for ejs

//middleware
app.use(express.json());  // for json 
app.use(express.urlencoded({ extended: true })); // for form data
app.use(cookieparser());

app.use("/",checkAuth, staticRoute);
app.use("/url",restrictToLoggedinUserOnly, urlRoute);
app.use("/user", userRoute);

// app.get("/test", async(req, res) => {
//     const allUrls = await URL.find({});
//     return res.render("home", {
//         urls: allUrls,
//     });
//     return res.end(`
//         <html>
//              <head></head>
//             <body>
//                 <ol>
//                     ${allUrls
//                         .map(
//                             (url) =>
//                                 `<li> ${url.shortId} - ${url.redirectURL} - ${url.visitHistory.length} </li>`
//                         )
//                         .join("")
//                     }
//                 </ol>
//             </body>
//         </html>
//         `
//     )
// });

// app.use("/", staticRoute); // for static files
//post



//getmon
const URL = require('./models/url');
app.get('/url/:shortId', async (req, res) => {
    const shortId = req.params.shortId;

    const entry = await URL.findOneAndUpdate(
        {
            shortId,
        },
        {
            $push: {
                visitHistory: {
                    timestamp: Date.now(),
                },
            },
        }
    );
    res.redirect(entry.redirectURL);
})




app.listen(PORT,()=>console.log(`Server is running on PORT: ${PORT}`));