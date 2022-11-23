const {Message} = require('../models/message');

const sosMessage = async (message) => {
    
    try {
      const newMessage = await Message.create({
        message,
      });
        return({newMessage})
    } catch (error) {
        throw error;
    }
    
  };
  module.exports = {
    sosMessage
}