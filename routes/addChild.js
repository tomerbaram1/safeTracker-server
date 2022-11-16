const Joi = require("joi");
const express = require("express");
const { User } = require("../models/user");
const router = express.Router();
const uuid = require('uuid')

router.get("/", async (req, res) => {
  const users = await User.find({});
  return res.send(users);
});

const childToken = uuid.v4();

console.log(childToken.slice(0,13));

router.patch("/", async (req, res) => {
 
  // const {child} = req.body
  const {id} = req.body
  try {
    const addedChild = await User.findOneAndUpdate( id, {
      $push: {
        children: {
          childName: req.body.childName,
          childPhone: req.body.childPhone,
          connectionToken: childToken.slice(0,13),
        },
      },
    })
    .then((data) => res.send(data.children) && console.log(data))
  } catch (error) {
    console.log(error);
  }


});

// router.patch("/:id", async(req,res) => {
//   User.findByIdAndDelete({_id: req.params.id})
//   .then(data=> res.json(data))
//   .catch(next)
// })

module.exports = router;
