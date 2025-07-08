import { Field, ID, ObjectType } from '@nestjs/graphql'
import type { User } from '@prisma/generated'

@ObjectType()
export class UserModel implements User {
    @Field(() => ID)
    id: string

    @Field(() => String)
    firstName: string

    @Field(() => String, { nullable: true })
    lastName: string

    @Field(() => String, { nullable: true })
    username: string

    @Field(() => String, { nullable: true })
    displayName: string

    @Field(() => String, { nullable: true })
    avatar: string

    @Field(() => String)
    telegramId: string

    @Field(() => Date)
    createdAt: Date

    @Field(() => Date)
    updatedAt: Date
}
