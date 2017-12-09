const jsonResponse = (request, response, dict) => {
    response.json(dict)
}

module.exports = {
    jsonResponse: jsonResponse,
}