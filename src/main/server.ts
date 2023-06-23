import app from './config/app'
import env from './config/env'
import prisma from './database/client'

prisma.$connect().then(() => {
  app.listen(env.port, () => { console.log(`Server running at http://localhost:${env.port}`) })
}).catch(() => {
  console.log('Server ERROR: could not connect to the database')
})
