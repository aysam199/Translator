const handlers = require('./handlers')


const router = (request, response) => {
    const url = request.url;
    if (url === '/') {
        handlers.handleHomeRoute(request, response);
    }
    else if (url.indexOf('/public/') !== -1) {
        handlers.handlePublic(request, response);
    }
    /// translate
    else if (url === '/search') {
        handlers.handleSearch(request, response);
    }
    else {
        response.writeHead(404)
        response.end('there is no such url')
    }
}

module.exports = router;