import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import compression from 'compression'

import { config } from './config'
import logger from './utils/logger'
import { connectDB } from './config/mongo'
import { connectRedis } from './config/redis'
import contentRoutes from './api/routes/content'
import authRoutes from './api/routes/auth'
import healthRoutes from './api/routes/health'
import adminRoutes from './api/routes/admin'
import { scheduleJobs } from './jobs/cache-refresh'
import { errorHandler, notFoundHandler } from './middleware/errorHandler'

const main = async () => {
  try {
    const app = express()

    // --- Middleware ---
    app.use(helmet())
    app.use(cors())
    app.use(compression())
    app.use(express.json())
    app.use(morgan('dev'))

    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      standardHeaders: true,
      legacyHeaders: false,
    })
    app.use(limiter)

    // --- Database & Cache Connections ---
    await connectDB()
    await connectRedis()

    // --- Routes ---
    app.use('/content', contentRoutes)
    app.use('/auth', authRoutes)
    app.use('/health', healthRoutes)
    app.use('/admin', adminRoutes)

    // --- Error Handling ---
    app.use(notFoundHandler)
    app.use(errorHandler)

    // --- Start Server ---
    app.listen(config.PORT, () => {
      logger.info(`Server running at http://localhost:${config.PORT}`)
      scheduleJobs()
    })
  } catch (err) {
    logger.error('❌ Failed to start server:', err)
    process.exit(1)
  }
}

main()
