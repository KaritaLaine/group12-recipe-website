"use strict"

import passport from "passport"
import { User } from "../models/user.js"

const getUserParams = (body) => {
  return {
    userName: body.userName,
    email: body.email,
    password: body.password,
  }
}

export const usersController = {
  authenticate: passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: "Failed to login.",
    successRedirect: "/",
    successFlash: "Logged in!",
  }),

  index: async (req, res, next) => {
    try {
      const users = await User.find()
      res.locals.users = users
      res.render("users/index")
    } catch (error) {
      console.log(`Error fetching users: ${error.message}`)
      next(error)
    }
  },

  login: (req, res) => {
    res.render("users/login")
  },

  logout: (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err)
      req.flash("success", "You have been logged out!")
      res.redirect("/")
    })
  },

  register: (req, res) => {
    res.render("users/register")
  },

  create: async (req, res, next) => {
    let newUser = new User(getUserParams(req.body))
    try {
      const user = await User.register(newUser, req.body.password)
      req.flash("success", `${user.userName} registered successfully!`)
      res.locals.redirect = "/login"
      next()
    } catch (error) {
      req.flash("error", `Failed to register user because: ${error.message}.`)
      res.locals.redirect = "/register"
      next()
    }
  },

  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect
    if (redirectPath !== undefined) res.redirect(redirectPath)
    else next()
  },
}
