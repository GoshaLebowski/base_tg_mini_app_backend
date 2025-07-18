import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class TelegramVerificationInput {
    @Field()
    @IsString()
    initData: string
}
