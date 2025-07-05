require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const compression = require('compression')
const rateLimit = require('express-rate-limit')
const multer = require('multer')
const path = require('path')

// Import routes
const authRoutes = require('./routes/auth')
const mealRoutes = require('./routes/meals')
const nutritionRoutes = require('./routes/nutrition')
const userRoutes = require('./routes/users')
const mealPlanRoutes = require('./routes/mealPlan')

// Import middleware
const { authenticateToken } = require('./middleware/auth')
const { errorHandler } = require('./middleware/errorHandler')
const { logger } = require('./utils/logger')

const app = express()
const PORT = process.env.PORT || 3001

// Security middleware
app.use(helmet())
app.use(compression())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})
app.use('/api/', limiter)

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}
app.use(cors(corsOptions))

// Logging
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }))

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// File upload configuration
const storage = multer.memoryStorage()
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'))
    }
  }
})

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/meals', authenticateToken, mealRoutes)
app.use('/api/nutrition', nutritionRoutes)
app.use('/api/users', authenticateToken, userRoutes)
app.use('/api/meal-plans', authenticateToken, mealPlanRoutes)

// Food recognition endpoint
app.post('/api/analyze-meal', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' })
    }

    const { recognizeFood } = require('./services/foodRecognition')
    const result = await recognizeFood(req.file.buffer)
    
    res.json(result)
  } catch (error) {
    logger.error('Food recognition error:', error)
    res.status(500).json({ error: 'Failed to analyze meal' })
  }
})

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Error handling middleware
app.use(errorHandler)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully')
  process.exit(0)
})

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully')
  process.exit(0)
})