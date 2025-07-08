import { Query, Resolver } from '@nestjs/graphql'

import { UserModel } from '@/src/modules/auth/account/models/user.model'
import { Authorization } from '@/src/shared/decorators/auth.decorator'
import { Authorized } from '@/src/shared/decorators/authorized.decorator'

import { AccountService } from './account.service'

@Resolver('Account')
export class AccountResolver {
    constructor(private readonly accountService: AccountService) {}

    @Authorization()
    @Query(() => UserModel, { name: 'findProfile' })
    public async me(@Authorized('id') id: string) {
        return this.accountService.me(id)
    }
}
