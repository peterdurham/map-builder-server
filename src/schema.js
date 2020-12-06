const { gql } = require("apollo-server-express");

module.exports = gql`
  type User {
    id: ID!
    username: String
    email: String
  }

  type Token {
    token: String!
  }

  type Map {
    user: ID!
    id: ID!
    name: String!
    locations: [Location]
    share: Boolean
  }

  type Location {
    id: ID!
    name: String
    locationtype: String
    notes: String
    lng: Float
    lat: Float
  }

  type Query {
    getUser: User
    getMaps: [Map]
    getMap(id: ID): Map
  }

  type Mutation {
    registerUser(email: String, username: String, password: String): Token!
    registerGuest: Token!
    loginUser(email: String, password: String): Token!
    createMap(name: String): Map
    shareMap(id: ID): Map
    addLocation(id: ID, name: String, locationtype: String, notes: String, lng: Float, lat: Float): Location
    updateLocation(id: ID, locationid: ID, name: String, locationtype: String, notes: String): Location
  }
`;
