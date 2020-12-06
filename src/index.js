require("dotenv").config();

const { ApolloServer, gql } = require("apollo-server");

const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const typeDefs = require("./schema");
const resolvers = require("./resolvers");

const getUser = async (auth) => {
  const token = auth.split("Bearer ")[1];

  if (token) {
    return await jwt.verify(token, process.env.SECRET);
  } else {
    console.log("SESSION EXPIRED");
    return null;
  }
};

const context = async ({ req }) => {
  const token = req.headers.authorization || "";

  const user = await getUser(token);

  return {
    user,
  };
};

mongoose
  .connect(process.env.MONGOURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Mongo Database connected"))
  .catch((err) => console.log(err));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
  context,
});

server.listen({ port: process.env.PORT || 4444 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
