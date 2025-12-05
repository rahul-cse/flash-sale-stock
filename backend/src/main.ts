import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'
import * as bodyParser from 'body-parser'

async function bootstrap(){
const app = await NestFactory.create(AppModule)
app.enableCors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true
});
app.use(bodyParser.json())
const port = process.env.PORT || 4000
await app.listen(port)
console.log('Backend listening on', port)
}
bootstrap()