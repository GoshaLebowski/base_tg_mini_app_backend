import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'

import { TelegramVerificationInput } from '@/src/modules/auth/verification/inputs/telegram-verification.input'
import { AuthModel } from '@/src/modules/auth/verification/models/auth.model'
import { UserAgent } from '@/src/shared/decorators/user-agent.decorators'
import { GqlContext } from '@/src/shared/types/gql-context.types'

import { VerificationService } from './verification.service'

@Resolver('Verification')
export class VerificationResolver {
    public constructor(
        private readonly verificationService: VerificationService
    ) {}

    @Mutation(() => AuthModel, { name: 'verifyTgAccount' })
    public async verify(
        @Context() { req }: GqlContext,
        @Args('data') input: TelegramVerificationInput,
        @UserAgent() userAgent: string
    ) {
        return this.verificationService.verifyTg(req, input, userAgent)
    }
}
