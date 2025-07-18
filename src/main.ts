import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { RedisStore } from 'connect-redis'
import * as cookieParser from 'cookie-parser'
import * as session from 'express-session'
import * as fs from 'fs'
import * as path from 'path'

import { RedisService } from '@/src/core/redis/redis.service'
import { ms, type StringValue } from '@/src/shared/utils/ms.util'
import { parseBoolean } from '@/src/shared/utils/parse-boolean.util'

import { CoreModule } from './core/core.module'

async function bootstrap() {
    const httpsOptions = {
        key: fs.readFileSync(
            path.resolve(__dirname, '../cert/127.0.0.1-key.pem')
        ),
        cert: fs.readFileSync(path.resolve(__dirname, '../cert/127.0.0.1.pem'))
    }

    const app = await NestFactory.create(CoreModule, {
        httpsOptions
    })

    const config = app.get(ConfigService)
    const redis = app.get(RedisService)

    app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')))

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true
        })
    )

    app.use(
        session({
            secret: config.getOrThrow<string>('SESSION_SECRET'),
            name: config.getOrThrow<string>('SESSION_NAME'),
            resave: false,
            saveUninitialized: false,
            cookie: {
                // domain: config.getOrThrow<string>('SESSION_DOMAIN'),
                maxAge: ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE')),
                httpOnly: parseBoolean(
                    config.getOrThrow<StringValue>('SESSION_HTTP_ONLY')
                ),
                secure: parseBoolean(
                    config.getOrThrow<StringValue>('SESSION_SECURE')
                ),
                sameSite: 'none'
            },
            store: new RedisStore({
                client: redis,
                prefix: config.getOrThrow<string>('SESSION_FOLDER')
            })
        })
    )

    app.enableCors({
        origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
        credentials: true,
        exposedHeaders: ['set-cookie']
    })

    await app.listen(config.getOrThrow<number>('APPLICATION_PORT'), '127.0.0.1')
}

bootstrap()
