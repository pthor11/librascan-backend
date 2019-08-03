import fastify from 'fastify'
import cors from 'fastify-cors'
import TX from './models/TX'
import fastifySwagger from 'fastify-swagger'
import swaggerOption from './swagger'

const app = fastify({ logger: true })

app.register(cors, { origin: true })
app.register(fastifySwagger, swaggerOption)

app.get('/address/:id', { schema: { params: { id: { type: 'string' } }, querystring: { limit: { type: 'integer' }, skip: { type: 'integer' } } } }, async (request, reply) => {
    const address = request.params.id
    const limit = request.query.limit || 20
    const skip = request.query.skip || 0
    try {
        const sum_received_value = (await TX.aggregate([
            { $match: { receiver: address } },
            { $group: { _id: null, sum_received_value: { $sum: '$amount' } } }
        ]))[0] ? (await TX.aggregate([
            { $match: { receiver: address } },
            { $group: { _id: null, sum_received_value: { $sum: '$amount' } } }
        ]))[0].sum_received_value : 0
        // console.log({ sum_received_value });

        const sum_sent_value = (await TX.aggregate([
            { $match: { sender: address } },
            { $group: { _id: null, sum_sent_value: { $sum: '$amount' } } }
        ]))[0] ? (await TX.aggregate([
            { $match: { sender: address } },
            { $group: { _id: null, sum_sent_value: { $sum: '$amount' } } }
        ]))[0].sum_sent_value : 0

        const totalCount = await TX.countDocuments({ $or: [{ sender: address }, { receiver: address }] })
        // console.log({totalCount})

        // console.log({ sum_sent_value });

        const balance = sum_received_value - sum_sent_value

        const txs = await TX.find({ $or: [{ sender: address }, { receiver: address }] }, { _id: 0, version: 1 }).sort({ version: -1 }).skip(skip).limit(limit)

        reply.send({ balance, totalCount, txs })
    } catch (error) {
        reply.send(error)
    }
})

app.get('/tx/:version', { schema: { params: { version: { type: 'integer' } } } }, async (request, reply) => {
    try {
        const tx = await TX.findOne({ version: request.params.version }).lean()
        reply.send(tx)
    } catch (error) {
        reply.send(error)
    }
})

app.get('/txs', { schema: { querystring: { sort: { type: 'string' }, limit: { type: 'integer' }, skip: { type: 'integer' } } } }, async (request, reply) => {
    const sort = request.query.sort || 'dsc'
    const limit = Number(request.query.limit) || 20
    const skip = Number(request.query.limit) || 0

    try {
        const txs = await TX.find({}, { _id: 0 }).sort(sort === 'dsc' ? { version: -1 } : { version: 1 }).limit(limit).skip(skip).lean()
        reply.send(txs)
    } catch (error) {
        console.log(error)
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