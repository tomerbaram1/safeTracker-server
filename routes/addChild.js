const Joi = require("joi");
const express = require("express");
const { User } = require("../models/user");
const router = express.Router();
const uuid = require("uuid");
const ShortUniqueId = require('short-unique-id');

const childToken = () => {
  let arr = []
  for (let i = 0; i < 13; i++) {
    arr[i] =Math.floor(Math.random() * (9 - 1 + 1)) + 1
    console.log(arr[i])
  }
  return arr.join('')
}

router.post("/", async (req, res) => {

  const id = req.body.id
  console.log(id+"back");
  const users = await User.findOne({ _id: id });
  console.log(users);
  return res.send(users);
});



router.patch("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await User.findByIdAndUpdate(id, {
      $push: {
        children: {
          childname: req.body.childname,
          phone: req.body.phone,
          connectionToken: childToken(),
          batteryLevel: 100
        },
      },
    }).then((data) => res.send(data) && console.log(data));
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
