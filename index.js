const server = require('./api/server')

server.listen(4000, () => {
    console.log("Server is running on http://localhost:4000")
})

