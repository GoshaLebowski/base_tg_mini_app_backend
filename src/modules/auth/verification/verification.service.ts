import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { Request } from 'express'

import { PrismaService } from '@/src/core/prisma/prisma.service'
import { AccountService } from '@/src/modules/auth/account/account.service'
import { CreateUserInput } from '@/src/modules/auth/account/inputs/create-user.input'
import { UserModel } from '@/src/modules/auth/account/models/user.model'
import { TelegramVerificationInput } from '@/src/modules/auth/verification/inputs/telegram-verification.input'
import { TelegramData } from '@/src/shared/types/telegram-data.types'
import { getSessionMetaData } from '@/src/shared/utils/session-metadata.util'
import { saveSession } from '@/src/shared/utils/session.util'
import { checkTelegramInitData } from '@/src/shared/utils/telegram-verification.util'

@Injectable()
export class VerificationService {
    private readonly tgBotToken =
        this.configService.getOrThrow('TELEGRAM_BOT_TOKEN')

    constructor(
        private readonly prismaService: PrismaService,
        private readonly configService: ConfigService,
        private readonly accountService: AccountService
    ) {}

    public async verifyTg(
        req: Request,
        input: TelegramVerificationInput,
        userAgent: string
    ) {
        const { initData } = input

        console.log('initData:', JSON.stringify(initData))

        const telegramData: TelegramData = checkTelegramInitData(
            initData,
            this.tgBotToken
        )

        if (!telegramData.isValid) {
            throw new BadRequestException('Невалидные данные от Telegram')
        }

        if (!telegramData.user.id) {
            throw new BadRequestException('Telegram ID отсутствует')
        }

        const telegramId = telegramData.user.id.toString()

        const userData: CreateUserInput = {
            firstName: telegramData.user.first_name,
            lastName: telegramData.user.last_name || null,
            username: telegramData.user.username || null,
            avatar: telegramData.user.photo_url || null,
            telegramId
        }

        const existingUser = await this.prismaService.user.findUnique({
            where: { telegramId }
        })

        const user: UserModel =
            await this.accountService.createOrUpdate(userData)

        if (!user) {
            throw new BadRequestException(
                existingUser
                    ? 'Не удалось обновить пользователя'
                    : 'Не удалось создать пользователя'
            )
        }

        const metadata = getSessionMetaData(req, userAgent)
        return saveSession(req, user, metadata)
    }
}
