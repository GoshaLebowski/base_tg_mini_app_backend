import {
    ConflictException,
    Injectable,
    NotFoundException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { Request } from 'express'

import { PrismaService } from '@/src/core/prisma/prisma.service'
import { RedisService } from '@/src/core/redis/redis.service'

@Injectable()
export class SessionService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly redisService: RedisService,
        private readonly configService: ConfigService
    ) {}

    public async findByUser(req: Request) {
        const userId = req.session.userId

        if (!userId) {
            throw new NotFoundException('Пользователь не обнаружен в сессии')
        }

        const keys = await this.redisService.keys('*')

        const userSessions = []

        for (const key of keys) {
            const sessionData = await this.redisService.get(key)

            if (sessionData) {
                const session = JSON.parse(sessionData)

                if (session.userId === userId) {
                    userSessions.push({
                        ...session,
                        id: key.split(':')[1]
                    })
                }
            }
        }

        userSessions.sort((a, b) => b.createdAt - a.createdAt)

        return userSessions.filter(session => session.id !== req.session.id)
    }

    public async findCurrent(req: Request) {
        const sessionId = req.session.id

        const sessionData = await this.redisService.get(
            `${this.configService.getOrThrow<string>('SESSION_FOLDER')}${sessionId}`
        )

        const session = JSON.parse(sessionData)

        return {
            ...session,
            id: sessionId
        }
    }

    public async clearSession(req: Request) {
        req.res.clearCookie(
            this.configService.getOrThrow<string>('SESSION_NAME')
        )
        return true
    }

    public async remove(id: string) {
        await this.redisService.del(
            `${this.configService.getOrThrow<string>('SESSION_FOLDER')}${id}`
        )
        return true
    }
}
