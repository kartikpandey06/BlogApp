const express = require("express")
const mongoose = require("mongoose")
const app = express()

mongoose.connect("mongodb+srv://kartikpandey2024_db_user:XiI0XwATdNuIVGQ5@cluster0.whae8ml.mongodb.net/crud")
    .then(() => console.log("✅ MongoDB connected"))
    .catch(err => console.log("❌ DB Error:", err));

const userSchema = new mongoose.Schema({
    name: String,
    age: Number
})

const userModel = mongoose.model("emps", userSchema);

// Insert test data (only once)
app.get("/add", async (req, res) => {
    const user = new userModel({ name: "Kartik", age: 19 });
    await user.save();
    res.send("User added ✅");
});

app.get("/all", async (req, res) => {
    const users = await userModel.find();
    res.json(users);
});

app.listen(3001, () => {
    console.log("🚀 Server is running on port 3001")
});
