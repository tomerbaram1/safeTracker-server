const Joi = require("joi");
const express = require("express");
const { User } = require("../models/user");
const router = express.Router();
const uuid = require("uuid");

router.post("/", async (req, res) => {

  const id = req.body.id
  console.log(id+"back");
  const users = await User.findOne({ _id: id });
  console.log(users);
  return res.send(users);
});

const childToken = uuid.v4();

console.log(childToken.slice(0, 13));

router.patch("/:id", async (req, res) => {
  const { id } = req.params.id;
  console.log(req.body.image);
  try {
    await User.findOneAndUpdate(id, {
      $push: {
        children: {
          childname: req.body.childname,
          phone: req.body.phone,
          connectionToken: childToken.slice(0, 13),
          image: req.body.image
        },
      },
    }).then((data) => res.send(data.children) && console.log(data));
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