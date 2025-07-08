import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'

import { SessionService } from '@/src/modules/auth/session/session.service'
import { Authorization } from '@/src/shared/decorators/auth.decorator'
import type { GqlContext } from '@/src/shared/types/gql-context.types'

import { SessionModel } from './models/session.model'

@Resolver('Session')
export class SessionResolver {
    public constructor(private readonly sessionService: SessionService) {}

    @Authorization()
    @Query(() => [SessionModel], { name: 'findSessionsByUser' })
    public async findByUser(@Context() { req }: GqlContext) {
        return this.sessionService.findByUser(req)
    }

    @Authorization()
    @Query(() => SessionModel, { name: 'findCurrentSession' })
    public async findCurrent(@Context() { req }: GqlContext) {
        return this.sessionService.findCurrent(req)
    }

    @Mutation(() => Boolean, { name: 'clearSessionCookie' })
    public async clearSession(@Context() { req }: GqlContext) {
        return this.sessionService.clearSession(req)
    }

    @Authorization()
    @Mutation(() => Boolean, { name: 'removeSession' })
    public async remove(
        @Args('id') id: string
    ) {
        return this.sessionService.remove(id)
    }
}
