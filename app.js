const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieparser = require('cookie-parser');
const app  = express();
const userModel = require('./usermodel');

// Middleware to parse JSON request body
app.use(express.json());
app.use(cookieparser());

app.get('/', (req,res) => {
    res.send(req.cookies);
});

// POST route to create a user
app.post('/create', (req, res) => {
    try {
        const { name, email, username, password } = req.body;
        bcrypt.genSalt(10, (err,salt) =>{
            bcrypt.hash(password, salt, async (err,hash) =>{
                let createdUser = await userModel.create({ 
                name:name, 
                email:email, 
                username:username, 
                password:hash
            });
            let token = jwt.sign({email}, 'shkey');
            res.cookie("token",token);
            res.status(200).send(createdUser)
            })  
        })
        
    } catch (err) {
        res.status(500).send("Error creating user: " + err.message);
    }
});

app.get('/gets', async (req,res) => {
    try {
        const allUsers = await userModel.find();
        res.status(201).send(allUsers);
    } catch (error) {
        res.status(500).send("Error fetchin users: " + error.message);
    }   
});

app.put('/update', async (req, res) => {
    try {
        const { name, username } = req.body;
        const updateUser = await userModel.findOneAndUpdate(
            { username: username },       // Filter
            { name: name },               // Update
            { new: true }                 // Options: return the updated document
        );

        res.send(updateUser);
    } catch (error) {
        res.status(500).send("Error updating user: " + error.message);
    }    
});

app.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleteUser = await userModel.deleteOne( { _id: id } );
        res.status(200).send(deleteUser)
    } catch (error) {
      res.status(500).send("Error deleting user: " + error.message);
    }    
});


app.listen(3000, () => console.log("Server running on port 3000"));
