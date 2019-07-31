export default {
    routePrefix: '/api',
    exposeRoute: true,
    swagger: {
        info: {
            title: 'Librascan API',
            description: 'Building a blazing fast explorer for Libra Tesnet',
            version: '1.0.0'
        },
        externalDocs: {
            url: 'http://144.217.7.220:3001/',
            description: 'Find more info here'
        },
        host: '144.217.7.220:3001/',
        schemes: ['http'],
        consumes: ['application/json'],
        produces: ['application/json']
    }
}