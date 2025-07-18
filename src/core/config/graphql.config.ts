import type { ApolloDriverConfig } from '@nestjs/apollo'
import { ConfigService } from '@nestjs/config'
import * as process from 'node:process'
import { join } from 'path'

import { isDev } from '../../shared/utils/is-dev.util'

export function getGraphQLConfig(
    configService: ConfigService
): ApolloDriverConfig {
    return {
        playground: isDev(configService),
        path: configService.getOrThrow<string>('GRAPHQL_PREFIX'),
        autoSchemaFile: join(process.cwd(), 'src/core/graphql/schema.gql'),
        sortSchema: true,
        context: ({ req, res }) => ({ req, res }),
        installSubscriptionHandlers: true
    }
}
