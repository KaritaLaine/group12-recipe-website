"use strict"

import { User } from "../models/user.js"

const getUserParams = (body) => {
  return {
    userName: body.userName,
    email: body.email,
    password: body.password,
  }
}

export const usersController = {
  index: async (req, res, next) => {
    try {
      const users = await User.find({})
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

  register: (req, res) => {
    res.render("users/register")
  },

  create: async (req, res, next) => {
    try {
      let userParams = getUserParams(req.body)
      const user = await User.create(userParams)
      res.locals.redirect = "/login"
      res.locals.user = user
      next()
    } catch (error) {
      console.log(`Error creating user: ${error.message}`)
      next(error)
    }
  },

  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect
    if (redirectPath !== undefined) res.redirect(redirectPath)
    else next()
  },
}
