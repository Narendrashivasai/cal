# Cali - AI-Powered Meal Tracking App

A comprehensive full-stack mobile-first web application for meal recognition and calorie tracking using AI-powered food recognition and nutrition analysis.

## 🚀 Features

### Core Functionality
- **📸 Camera-based Meal Recognition**: Capture or upload photos of meals for AI analysis
- **🔍 Food Detection**: Identify individual food items using Google Vision API or Clarifai
- **📊 Nutrition Analysis**: Calculate calories, macronutrients, and micronutrients
- **📱 Mobile-First Design**: Responsive UI optimized for smartphones and tablets
- **🤖 AI Meal Planning**: Generate personalized meal plans using OpenAI GPT
- **👤 User Authentication**: Secure login and user management
- **📈 Progress Tracking**: Monitor daily calorie intake and nutrition goals

### Technical Features
- **Next.js 14** with App Router for modern React development
- **TypeScript** for type safety
- **Tailwind CSS** for responsive design
- **Express.js** backend with comprehensive API
- **Multiple AI APIs** for robust food recognition
- **JWT Authentication** for secure API access
- **Real-time Image Processing** with Sharp
- **Comprehensive Error Handling** and logging

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (React 18)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **UI Components**: Headless UI, Heroicons
- **State Management**: React Hooks, Context API
- **HTTP Client**: Axios
- **File Upload**: React Dropzone
- **Notifications**: React Hot Toast
- **Camera**: React Camera Pro

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Authentication**: JWT
- **Image Processing**: Sharp
- **File Upload**: Multer
- **HTTP Client**: Axios
- **Logging**: Winston
- **Security**: Helmet, CORS, Rate Limiting
- **Environment**: dotenv

### External APIs
- **Food Recognition**: Google Vision API, Clarifai
- **Nutrition Data**: USDA FoodData Central, Edamam
- **AI Meal Planning**: OpenAI GPT-4
- **Authentication**: Firebase Auth (optional)

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cali-meal-tracker
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   
   **Frontend** (`frontend/.env.local`):
   ```bash
   cp frontend/.env.local.example frontend/.env.local
   ```
   
   **Backend** (`backend/.env`):
   ```bash
   cp backend/.env.example backend/.env
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

## 🔧 Configuration

### API Keys Setup

To fully utilize all features, you'll need to obtain API keys from these services:

#### Google Vision API (Recommended)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable the Vision API
4. Create credentials (API Key)
5. Add to `backend/.env`: `GOOGLE_VISION_API_KEY=your-api-key`

#### Clarifai (Alternative)
1. Sign up at [Clarifai](https://clarifai.com/)
2. Create an application
3. Copy your API key
4. Add to `backend/.env`: `CLARIFAI_API_KEY=your-api-key`

#### USDA FoodData Central (Free)
1. Visit [USDA FoodData Central](https://fdc.nal.usda.gov/api-guide.html)
2. Sign up for a free API key
3. Add to `backend/.env`: `USDA_API_KEY=your-api-key`

#### Edamam Nutrition API (Optional)
1. Sign up at [Edamam](https://developer.edamam.com/)
2. Get your App ID and App Key
3. Add to `backend/.env`:
   ```
   EDAMAM_APP_ID=your-app-id
   EDAMAM_APP_KEY=your-app-key
   ```

#### OpenAI API (For AI meal planning)
1. Get API key from [OpenAI](https://platform.openai.com/)
2. Add to `backend/.env`: `OPENAI_API_KEY=your-api-key`

### Database Setup (Optional)

The app works with mock data by default. For production, set up MongoDB:

1. **Local MongoDB**:
   ```bash
   # Install MongoDB locally or use Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

2. **MongoDB Atlas** (Cloud):
   - Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create cluster and get connection string
   - Add to `backend/.env`: `MONGODB_URI=your-connection-string`

## 🚀 Deployment

### Frontend (Vercel)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Connect your GitHub repository
   - Set environment variables in Vercel dashboard
   - Deploy automatically

### Backend (Railway/Render)

#### Railway
1. **Connect to Railway**
   - Sign up at [Railway](https://railway.app/)
   - Connect GitHub repository
   - Select backend folder

2. **Set environment variables**
   - Add all variables from `.env.example`
   - Deploy automatically

#### Render
1. **Deploy on Render**
   - Sign up at [Render](https://render.com/)
   - Create new web service
   - Connect GitHub repository
   - Set build command: `cd backend && npm install`
   - Set start command: `cd backend && npm start`

## 🎯 Usage

### Demo Mode
The app works in demo mode without API keys:
- Uses mock data for food recognition
- Provides sample nutrition information
- Demonstrates all core features

### With API Keys
1. **Food Recognition**: Upload or capture meal photos
2. **Nutrition Analysis**: Get real nutritional data
3. **Meal Planning**: Generate AI-powered meal suggestions
4. **Progress Tracking**: Monitor your daily intake

## 📱 Mobile Features

- **Camera Access**: Take photos directly in the app
- **Touch-Friendly**: Optimized for mobile interactions
- **Responsive Design**: Works on all screen sizes
- **PWA Ready**: Can be installed as an app

## 🧪 Testing

```bash
# Run all tests
npm test

# Run frontend tests
npm run test:frontend

# Run backend tests
npm run test:backend

# Run tests in watch mode
npm run test:frontend -- --watch
```

## 🔒 Security

- **JWT Authentication**: Secure API access
- **Rate Limiting**: Prevent API abuse
- **Input Validation**: Sanitize all inputs
- **CORS Configuration**: Secure cross-origin requests
- **Environment Variables**: Secure API key storage

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📋 Project Structure

```
cali-meal-tracker/
├── frontend/                 # Next.js frontend
│   ├── app/                 # App router pages
│   ├── components/          # React components
│   ├── hooks/               # Custom hooks
│   ├── services/            # API services
│   ├── types/               # TypeScript types
│   └── utils/               # Utility functions
├── backend/                 # Express.js backend
│   ├── routes/              # API routes
│   ├── services/            # Business logic
│   ├── middleware/          # Express middleware
│   ├── utils/               # Utility functions
│   └── models/              # Database models
└── README.md
```

## 📞 API Documentation

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Meals
- `GET /api/meals` - Get user meals
- `POST /api/meals` - Create new meal
- `GET /api/meals/:id` - Get meal details
- `PUT /api/meals/:id` - Update meal
- `DELETE /api/meals/:id` - Delete meal

### Nutrition
- `POST /api/nutrition` - Get nutrition data
- `GET /api/nutrition/search` - Search foods
- `GET /api/nutrition/:id` - Get food details

### Food Recognition
- `POST /api/analyze-meal` - Analyze meal image

## 🌟 Future Enhancements

- **Barcode Scanning**: Add barcode recognition
- **Voice Input**: Voice-based meal logging
- **Health Integration**: Sync with fitness apps
- **Social Features**: Share meals and progress
- **Offline Mode**: Work without internet
- **Advanced Analytics**: Detailed nutrition insights

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Google Vision API for food recognition
- USDA for nutrition data
- OpenAI for AI meal planning
- All open-source contributors

---

**Built with ❤️ by the Cali Team**

For support, please open an issue or contact us at support@cali-app.com
