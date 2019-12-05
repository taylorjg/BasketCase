const express = require('express')
const searchServiceImpl = require('./elasticsearch/searchServiceImpl')

const search = async (req, res) => {

  const searchOptions = {
    pageSize: Number(req.body.pageSize),
    currentPage: Number(req.body.currentPage),
    sortBy: Number(req.body.sortBy),
    searchText: req.body.searchText || '',
    filters: req.body.filters || []
  }

  try {
    const myResponse = await searchServiceImpl.search(searchOptions)
    sendJsonResponse(res, 200, myResponse)
  } catch (error) {
    sendStatusResponse(res, 500, error.message)
  }
}

const sendJsonResponse = (res, status, content) => res.status(status).json(content)
const sendStatusResponse = (res, status, content) => res.status(status).send(content)

const router = express.Router()
router.post('/search', search)

module.exports = router
