import { BadRequestException, Injectable } from '@nestjs/common'

import { PrismaService } from '@/src/core/prisma/prisma.service'
import { CreateUserInput } from '@/src/modules/auth/account/inputs/create-user.input'

@Injectable()
export class AccountService {
    public constructor(private readonly prismaService: PrismaService) {}

    public async me(id: string) {
        return this.prismaService.user.findUnique({
            where: {
                id
            }
        })
    }

    public async createOrUpdate(input: CreateUserInput) {
        const { username, telegramId, avatar, firstName, lastName } = input

        if (!telegramId || !firstName) {
            throw new BadRequestException(
                'Telegram ID и имя обязательны для заполнения.'
            )
        }

        const displayName = username ?? firstName

        const user = await this.prismaService.user.upsert({
            where: {
                telegramId
            },
            update: {
                avatar,
                lastName: lastName ?? null,
                username: username ?? null,
                displayName: displayName
            },
            create: {
                firstName,
                lastName: lastName ?? null,
                username: username ?? null,
                displayName: displayName,
                telegramId,
                avatar: avatar ?? null
            }
        })

        if (!user) {
            throw new BadRequestException(
                'Не удалось создать или обновить пользователя'
            )
        }

        return user
    }
}
