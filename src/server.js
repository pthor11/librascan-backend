import fastify from 'fastify'
import cors from 'fastify-cors'
import TX from './models/TX'
import fastifySwagger from 'fastify-swagger'
import swaggerOption from './swagger'

const app = fastify({ logger: false })

app.register(cors, { origin: true })
app.register(fastifySwagger, swaggerOption)

app.get('/address/:id', async (request, reply) => {
    if (!request.params.id) {
        reply.send(null)
    } else {
        const address = request.params.id
        try {
            const txs = await TX.find({ $or: [{ sender: address }, { receiver: address }] }).sort({ version: -1 })
            const sum_received_value = txs.filter(tx => tx.receiver === address).reduce((sum, tx) => sum + tx.amount, 0)
            const sum_sent_value = txs.filter(tx => tx.sender === address).reduce((sum, tx) => sum + tx.amount, 0)
            const balance = sum_received_value - sum_sent_value

            reply.send({ balance, txs })
        } catch (error) {
            reply.send(error)
        }
    }
})

app.get('/tx/:version', async (request, reply) => {
    try {
        const tx = await TX.findOne({ version: request.params.version }).lean()
        reply.send(tx)
    } catch (error) {
        reply.send(error)
    }
})

app.get('/txs', async (request, reply) => {
    const sort = request.query.sort || 'DSC'
    const limit = Number(request.query.limit) || 40

    try {
        const txs = await TX.find({}, { _id: 0 }).sort(sort === 'DSC' ? { version: -1 } : { version: 1 }).limit(limit).lean()
        reply.send(txs)
    } catch (error) {
        console.log(error)
        reply.send(error)
    }

})

app.get('/txs/newfrom/:version', async (request, reply) => {
    const version = request.params.version
    const limit = Number(request.query.limit) || 20
    try {
        const txs = await TX.find({$and: [{version: {$gt: version}}, {version: {$lte: version + limit}}]}, {_id: 0}).sort({version: -1}).lean()
        reply.send(txs)
    } catch (error) {
        reply.send(error)
    }
})

app.get('/txs/oldfrom/:version', async (request, reply) => {
    const version = request.params.version
    const limit = Number(request.query.limit) || 20
    try {
        const txs = await TX.find({$and: [{version: {$gte: version - limit}}, {version: {$lt: version}}]}, {_id: 0}).sort({version: -1}).lean()
        reply.send(txs)
    } catch (error) {
        reply.send(error)
    }
})


const start = async () => {
    try {
        await app.listen(3001, '0.0.0.0')
        app.swagger()
        app.log.info(`server listening on ${app.server.address().port}`)
    } catch (err) {
        app.log.error(err)
        process.exit(1)
    }
}
start()