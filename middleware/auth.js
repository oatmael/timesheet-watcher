require("dotenv").config();

const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Auth middleware for verifying JWT tokens
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
function auth(req, res, next) {
  let token = req.headers.authorization;

  if (!token.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Please use Bearer Authorization" });
  }
  // Remove 'Bearer ' from start of auth string
  token = token.replace(/^Bearer\s/, "");

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      console.log(err);
      return res
        .status(401)
        .json({ error: "Invalid JWT token, please reauthorize" });
    }

    // Attach user to the request object to be used in deeper routes
    req.user = User.findOne({ _id: decoded.id });
  });

  return next();
}

module.exports = auth;
