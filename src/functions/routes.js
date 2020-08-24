const nextRoutes = require('next-routes')
const routes = (module.exports = nextRoutes())

routes
    .add('team', '/team/:id')
    .add('player', '/player/:id')
    .add('game', '/game/:id')
    .add('search')
    .add('user')
