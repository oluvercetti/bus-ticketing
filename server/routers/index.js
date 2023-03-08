

const userRouter = require('./user')
const adminRouter = require('./admin')
const tripRouter = require('./trip')
const locationRouter = require('./location')
const ticketRouter = require('./ticket')

const allRouters = [userRouter, adminRouter, tripRouter, locationRouter, ticketRouter]

module.exports = allRouters