import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TelegrafModule } from 'nestjs-telegraf'

import { getTelegrafConfig } from '@/src/core/config/telegraf.config'

import { TelegramService } from './telegram.service'
import { AccountService } from '@/src/modules/auth/account/account.service'

@Global()
@Module({
    imports: [
        TelegrafModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: getTelegrafConfig,
            inject: [ConfigService]
        })
    ],
    providers: [TelegramService, AccountService],
    exports: [TelegramService]
})
export class TelegramModule {
}
