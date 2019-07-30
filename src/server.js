import fastify from 'fastify'
import cors from 'fastify-cors'
import TX from './models/TX'

const app = fastify({ logger: false })

app.register(cors, {origin: true })

app.get('/', (request, reply) => {
    reply
    .send( [
        {
            query: '/tx/:version',
            purpose: 'get single tx by version. Example: /tx/1001'
        },
        {
            query: '/txs',
            purpose: 'get list of txs. Example: /txs?sort=DSC&limit=10&skip=100'
        }
    ])
})

app.get('/address/:id', async (request, reply) => {
    if (!request.params.id) {
        reply.send(null)
    } else {
        const address = request.params.id
        try {
            const txs = await TX.find({$or: [{sender: address}, {receiver: address}]}).sort({version: -1})
            const sum_received_value = txs.filter(tx => tx.receiver === address).reduce((sum, tx) => sum + tx.amount, 0)
            const sum_sent_value = txs.filter(tx => tx.sender === address).reduce((sum, tx) => sum + tx.amount, 0)
            const balance = sum_received_value - sum_sent_value

            reply.send({balance, txs})
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
    const limit = Number(request.query.limit) || 10
    const skip = Number(request.query.skip) || 0

    try {
        const txs = await TX.find({}, {_id: 0}).sort(sort === 'DSC' ? {version: -1} : {version: 1}).limit(limit).skip(skip).lean()
        reply.send(txs)
    } catch (error) {
        reply.send(error)
    }
    
})



const start = async () => {
    try {
        await app.listen(3000, '0.0.0.0')

        console.log(`Server is running on http://localhost:3001`)
    } catch (err) {
        app.log.error(err)
        process.exit(1)
    }
}
start()