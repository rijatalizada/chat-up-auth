import { TypeOrmModuleOptions } from "@nestjs/typeorm"

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5434,
    username: 'postgres',
    password: "1234",
    database: 'nest',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true,
    // migrationsRun: true
  }