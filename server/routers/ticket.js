const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const Ticket = require('../models/ticket')



module.exports = router