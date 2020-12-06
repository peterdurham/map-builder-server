const {
  AuthenticationError,
  UserInputError,
} = require("apollo-server-express");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Map = require('./models/Map');
const jwt = require("jsonwebtoken");
const validateRegisterInput = require("./validation/register");
const validateLoginInput = require("./validation/login");

const getToken = ({ id, email }) =>
  jwt.sign(
    {
      id,
      email,
    },
    process.env.SECRET,
    { expiresIn: "1d" }
  );

module.exports = {
  Query: {
    getUser: async (_, args, ctx) => {
      const user = await User.findOne({ _id: ctx.user.id });

      return {
        id: user._id,
        username: user.username,
        email: user.email,
      };
    },
    getMaps: async (_, args, ctx) => {
      const myMaps = await Map.find({ user: ctx.user.id })
      return myMaps
    },
    getMap: async (_, { id }, ctx) => {
      const map = await Map.findOne({ _id: id })
      return map
    }
  },
  Mutation: {
    registerUser: async (_, { email, username, password }) => {

      const { errors, valid } = validateRegisterInput({ email, password });
      if (!valid) throw new UserInputError("Error", { errors });

      const user = await User.findOne({ email });
      if (user)
        throw new UserInputError("A user with this email already exists");

      password = await bcrypt.hash(password, 10);
      const newUser = new User({
        email,
        username,
        password,
      });

      const res = await newUser.save();
      const token = getToken(res);

      return { token };
    },
    registerGuest: async () => {
      const random = new Date().getTime();
      const randomString = random.toString();

      const newUser = new User({
        email: `guest${randomString}@test.com`,
        username: `guest-${randomString}`,
        password: randomString,
      });

      const res = await newUser.save();
      const token = getToken(res);

      return { token };
    },
    loginUser: async (_, { email, password }, ctx) => {
      const { errors, valid } = validateLoginInput({ email, password });

      if (!valid) throw new UserInputError("Error", { errors });

      const user = await User.findOne({ email });
      if (!user) throw new AuthenticationError("This user was not found");

      const match = await bcrypt.compare(password, user.password);
      if (!match) throw new AuthenticationError("Incorrect password");

      const token = getToken(user);

      return { token };
    },
    createMap: async (_, { name }, ctx) => {
      const user = await User.findOne({ _id: ctx.user.id });
      if (!user) throw new AuthenticationError("This user was not found");
      const newMap = new Map({
        name,
        user: ctx.user.id,
        locations: [],
        share: false,
      })

      const mapResponse = await newMap.save();
    
      return mapResponse;
    },
    shareMap: async (_, { id }, ctx) => {
      const user = await User.findOne({ _id: ctx.user.id });
      if (!user) throw new AuthenticationError("This user was not found");
      
      let map = await Map.findOne({ _id: id })  

      const updated = await Map.findOneAndUpdate(
        { _id: map._id },
        {
          $set: {
            share: true,
          },
        },
        { new: true }
      );


      return updated;
      
    },
    addLocation: async (_, { id, name, locationtype, notes, lng, lat }, ctx) => {
      let map = await Map.findOne({ _id: id })  
      let locations = [...map.locations]

      let updatedLocations = locations.concat({
        name,
        locationtype,
        notes,
        lng,
        lat
      })

      const updated = await Map.findOneAndUpdate(
        { _id: map._id },
        {
          $set: {
            locations: updatedLocations,
          },
        },
        { new: true }
      );


      return updated;
        
    },
    updateLocation: async(_, { id, locationid, name, locationtype, notes }, ctx) => {
      let map = await Map.findOne({ _id: id })  

      const updatedLocations = [...map.locations].map((location) => {
        if (location._id.toString() === locationid) {
          location.name = name
          location.locationtype = locationtype
          location.notes = notes
        }
        return location
      })
      const updated = await Map.findOneAndUpdate(
        { _id: map._id },
        {
          $set: {
            locations: updatedLocations,
          },
        },
        { new: true }
      );

      return updated;
    }
  },

};
