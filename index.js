const express = require('express');
const fs = require('fs');
const mongoose = require('mongoose');

const app = express();
const PORT = 8000;

// Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/project-1")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("Mongo Error", err));

// Schema 
  const userSchema = new mongoose.Schema({
    firstName: {
      type: String,
      required: true,
    },
    lastName:{
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    job_title: {
      type: String,
    }
  })

  const User = mongoose.model("user", userSchema);

// Middleware - Plugins
app.use(express.urlencoded({ extended: false }));

// Routes
app.get("/users", async(req,res) => {
  const allDbUsers = await User.find({});
    const html = `
    <ul>
        ${users.map((user) => `<li>${user.firstName} - ${user.email}</li>`).join("")}
    </ul>
    `;
    res.send(html);
}) 

app.get("/api/users", async(req, res) =>{
  const allDbUsers = await User.find({});
    return res.json(allDbUsers);
});

app
  .route("/api/users/:id")
  .get(async(req, res) => {
    const user = users.findByid(req.params.id);
    if(!user) return res.status(404).json({ error: 'User not found' });
    return res.json(user);
  })
  .patch(async(req, res) => {
    await User.findByIdAndUpdate(req.params.id, {lastName: "Changed"});
    return res.json({ status: "Success" });
  })
  .delete(async(req, res) => {
    await User.findByIdAndDelete(req.params.id);
    return res.json({ status: "Success" });
  });

app.post("/api/users", async(req, res) =>{
    // Create new user
    const body = req.body;
    if(
      !body ||
      !body.first_name ||
      !body.last_name ||
      !body.email ||
      !body.gender ||
      !body.job_title
    ){
      return res.status(400).json({msg: "All fields are required"});
    }
    
    const result = await User.create({
      firstName: body.first_name,
      lastName: body.last_name,
      email: body.email,
      gender: body.gender,
      jobTitle: body.job_title,
    });
    return res.status(200).json({msg: "success"});
});

app.listen(PORT, () => console.log(`listening on port ${PORT}`));