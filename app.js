//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require("ejs");
const mongoose = require("mongoose");

const encrypt = require("mongoose-encryption");
const app = express();

app.use(express.static("public"));

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb://localhost:27017/userDB");
const userSchema = new mongoose.Schema({
  email:String,
  password:String
});
userSchema.plugin(encrypt, {secret: process.env.SECRET , encryptedFields : ["password"]});
const User = mongoose.model("User",userSchema);

app.get("/",function(req,res){
  res.render("home");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.post("/register",function(req,res){
  User.find({email:req.body.username},function(err,result){
    if(err){
      res.send(err);
    }
    else{
      if(result.length>0){
        res.send("You had already Registered!Please Login!")
      }
      else{
          const newUser = new User({
            email:req.body.username,
            password:req.body.password
          });
          newUser.save(function(err){
            if(err){
              res.send(err);
            }
            else{
              res.render("secrets");
            }
          });
      }
    }
  });

});

app.post("/login",function(req,res){
  User.findOne({email:req.body.username},function(err,result){
  //  console.log(result);
    if(err){
      res.send(err);
    }
    else{
      if(result){
        if(result.password===req.body.password){
          res.render("secrets");
        }
        else{
          res.redirect("/login");
        }
      }
      else{
        res.send("Please Register First!");
      }
    }
  });
});

app.get("/logout",function(req,res){
    res.render("home");
});

app.get("/submit",function(req,res){
  res.render("submit");
})

app.post("/submit",function(req,res){
  const UserSecret = req.body.secret;
  res.send("Your Secret is safe with us!");
});

app.listen(3000,function(){
console.log("Server Started at Port 3000");
});
