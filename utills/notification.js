const { Expo } = require("expo-server-sdk");
const express = require("express");

// "ExponentPushToken[Uh8EfSGwGP2wOYky3ImWmQ]"

const sendPushNotification = async (targetExpoPushToken, message) => {
  console.log("s2***************************");
  const expo = new Expo();

  const chunks = expo.sendPushNotificationsAsync([
    { to: targetExpoPushToken, sound: "default", body: "message" },
  ]);
};

function activatePushNotification(expoPushToken, message) {
  console.log("expoPushToken");
  // if (Expo.isExpoPushToken(expoPushToken)) {
  sendPushNotification(expoPushToken, message);
  //     console.log("true")
  // }
  // else console.log("false")
}

module.exports = activatePushNotification;
