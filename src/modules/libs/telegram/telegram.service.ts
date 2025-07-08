import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Ctx, Start, Update } from 'nestjs-telegraf'
import { Telegraf } from 'telegraf'

import { PrismaService } from '@/src/core/prisma/prisma.service'
import { AccountService } from '@/src/modules/auth/account/account.service'
import { CreateUserInput } from '@/src/modules/auth/account/inputs/create-user.input'

@Update()
@Injectable()
export class TelegramService extends Telegraf {
    private readonly _token: string

    public constructor(
        private readonly prismaService: PrismaService,
        private readonly accountService: AccountService,
        private readonly configService: ConfigService,
    ) {
        super(configService.getOrThrow<string>('TELEGRAM_BOT_TOKEN'))
        this._token = configService.getOrThrow<string>('TELEGRAM_BOT_TOKEN')
    }

    @Start()
    public async onStart(@Ctx() ctx: any) {
        const message = ctx.message || ctx.update.message
        const from = message?.from
        const chat = message?.chat || ctx.chat

        const chatId = chat?.id?.toString()
        const username = from?.username
        const firstName = from?.first_name
        const lastName = from?.last_name

        console.log(username, firstName, lastName, chatId)

        const user = await this.prismaService.user.findUnique({
            where: {
                telegramId: chatId
            }
        })

        const data: CreateUserInput = {
            firstName,
            lastName,
            username,
            telegramId: chatId,
            avatar: null
        }

        if (!user) {
            await this.accountService.createOrUpdate(data)
            await ctx.replyWithHTML('Аккунт успешно создан')
        } else {
            await ctx.reply('Профиль')
        }
    }
}
