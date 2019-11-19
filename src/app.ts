import * as Express from 'express'
import * as Logger from 'morgan'
import { hang, HttpError } from 'express-toolbox'
import { getConnectionOptions, createConnection } from 'typeorm'

export const app = Express()

hang(app).until(async () => {
    const opt = await getConnectionOptions()
    await createConnection(Object.assign({}, opt, { synchronize: false, logging: false }))
})

const errorHandler: Express.ErrorRequestHandler = function (err: Error, req, res, next) {
    if (err instanceof HttpError) {
        res.status(err.status).send(err.message)
    } else {
        res.status(500).send(err.message)
    }
}

app.use(Logger('dev'))
    .use(Express.json())
    .use(Express.urlencoded({ extended: false }))
    .use('/api', require('./api'))
    .use(errorHandler)
