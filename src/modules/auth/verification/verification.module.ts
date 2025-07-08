import { Module } from '@nestjs/common'

import { AccountService } from '@/src/modules/auth/account/account.service'

import { VerificationResolver } from './verification.resolver'
import { VerificationService } from './verification.service'

@Module({
    providers: [VerificationResolver, VerificationService, AccountService]
})
export class VerificationModule {}
