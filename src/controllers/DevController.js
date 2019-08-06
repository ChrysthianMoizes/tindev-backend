const api = require('../services/api');
const Dev = require('../models/Dev');

module.exports = {

  async store(req, res) {
    const { username } = req.body;

    const userExist = await Dev.findOne({ user: username });

    if(userExist)
      return res.json(userExist);

    const response = await api.get(username);

    const {name, bio, avatar_url: avatar } = response.data;

    const dev = await Dev.create({
      name,
      user: username,
      bio,
      avatar
    });

    return res.json(dev);
  },

  async index(req, res) {
    const { user } = req.headers;

    const loggedDev = await Dev.findById(user);

    const devs = await await Dev.find({
      $and: [
        { _id: { $ne: user } },
        { _id: { $nin: loggedDev.likes } },
        { _id: { $nin: loggedDev.deslikes } },
      ]
    });

    return res.json(devs);
  }

};
