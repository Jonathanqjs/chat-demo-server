import { TypeOrmModuleOptions } from "@nestjs/typeorm"
import * as path from 'path'
export const publicKey = `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC9YzBno6dvtoKWLeJV2teUbC6gNs8HqcVEk6Z2JxbCMM3+EZYJ0m7sg+1Xfka7CDVhlJd2ebSEwmxuNRfMySUyesgV5YZNpoOTqZ28pdUqHroDx5+GIPuC7VNOr9gAmCBpv5+XXn+RtwywcwSHOHDTq3xGBYdzrnUgHBhm6XuS5QIDAQAB`
export const privateKey = `MIICeAIBADANBgkqhkiG9w0BAQEFAASCAmIwggJeAgEAAoGBAL1jMGejp2+2gpYt4lXa15RsLqA2zwepxUSTpnYnFsIwzf4RlgnSbuyD7Vd+RrsINWGUl3Z5tITCbG41F8zJJTJ6yBXlhk2mg5Opnbyl1SoeugPHn4Yg+4LtU06v2ACYIGm/n5def5G3DLBzBIc4cNOrfEYFh3OudSAcGGbpe5LlAgMBAAECgYBT4m86OH6dOJW2tzQdGwWJtDEivaQNnODHcy6z/rRR5xQWiOuQBikjkXu62S+y//vE8O/1hgqzEvq8BcA48I8MfX95YzAFgOq6RjvFneO0iJvu5zVDoWxgXRnPmRUNXJ6HpbVw2gKvOafZrsIeiZdIYp20wp/5wxq3HQkcfm01gQJBAOj56ptuIKb9Oo4rc2kWeXZDNQ4k1ZYAwGD/VBqtR5t0e+dECtnt1Tbp5e0W0TAj0LLDOla5oye4TTg9pkot8akCQQDQGoRNpRkzKtAxBHjqihtmvYFoD2Ov+/qW0jn74rzIN3rOnJxuqrN3gFmCnUULh7qseOs5yTmoYw+1ZMZpYtTdAkEAloKWWVG9UIR6JszVY4e8cnWaugd74MudfUyWpiFaCIkpXs/rfr0SqMZU32WFQWdx9XsAnnSRfiCn6nSRkIy7+QJBALxfNGGAT9ZEK94i+Tz8tJ8EbS3/uDHlukhplXkPHelyZuS9WNDIDdnfQab8qzIrs2tJrUtKfbmRqfd9eCiPALUCQQCcG7kOp+yJcENePsiTKOWMt8n2G4qAmMaZzrF99IXqJxSPd3Xde85PGu5fKcOfC6`

export const typeOrmConfig:TypeOrmModuleOptions = {
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "mychat",
  password: "HBtXtb8tSmHYsEEM",
  database: "mychat",
  entities: [path.resolve(__dirname, '..')+ "/entity/**/*.entity{.ts,.js}"],
  synchronize: true
}

export const redisConfig = {
  host: 'localhost', // Redis 主机
  port: 6379, // Redis 端口
}