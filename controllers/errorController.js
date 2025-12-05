import httpStatus from "http-status-codes"

const pageNotFound = (req, res) => {
  const errorCode = httpStatus.NOT_FOUND
  res.status(errorCode)
  res.render("error")
}

const internalServerError = (err, req, res, next) => {
  const errorCode = httpStatus.INTERNAL_SERVER_ERROR
  console.log(`Error 500: ${err.message}`)
  res.status(errorCode)
  res.send(`Error ${errorCode}: Sorry, our app is experiencing a problem!`)
}

export const errorController = {
  pageNotFound,
  internalServerError,
}
