import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

@InputType()
export class CreateUserInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    firstName: string

    @Field()
    @IsString()
    @IsNotEmpty()
    lastName: string

    @Field()
    @IsString()
    @IsNotEmpty()
    username: string

    @Field()
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    telegramId: string

    @Field()
    @IsString()
    @IsNotEmpty()
    avatar: string
}
