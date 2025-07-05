# Quick Start Guide

Get Cali running in under 5 minutes!

## 🚀 Instant Setup

1. **Install dependencies** (this may take a few minutes):
   ```bash
   npm run install:all
   ```

2. **Start the application**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001/health

## 🎯 Demo Mode

The app works immediately in demo mode without any API keys:

### Try These Features:
1. **📱 Home Page**: View the landing page and feature overview
2. **🔐 Authentication**: Click "Get Started" and create a demo account
3. **📸 Camera Capture**: Upload a food image or take a photo
4. **🔍 Food Recognition**: Get mock food recognition results
5. **📊 Nutrition Analysis**: View detailed nutrition breakdowns

### Demo Credentials:
- **Email**: Any email (e.g., demo@cali.com)
- **Password**: Any password
- The app will automatically log you in

## 🔧 API Endpoints to Test

Once running, test these endpoints:

### Health Check
```bash
curl http://localhost:3001/health
```

### Demo Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@cali.com","password":"demo123"}'
```

### Nutrition Data
```bash
curl -X POST http://localhost:3001/api/nutrition \
  -H "Content-Type: application/json" \
  -d '{"food":"chicken","quantity":100,"unit":"g"}'
```

## 🎨 What You'll See

### Landing Page
- Beautiful gradient design
- Feature cards showcasing app capabilities
- "Get Started" call-to-action button

### After Login
- Personalized dashboard
- Camera capture interface
- Quick stats and recent meals
- Mobile-responsive navigation

### Food Recognition Flow
1. Upload/capture meal photo
2. Review the captured image
3. Click "Analyze Meal"
4. View detected food items with confidence scores
5. Get nutrition details

## 📱 Mobile Testing

Test on mobile devices or use browser dev tools:
1. Open Chrome/Safari dev tools
2. Toggle device toolbar (mobile view)
3. Select iPhone/Android device
4. Test camera and touch interactions

## 🔋 Next Steps

Once you've tried the demo:

1. **Add API Keys**: Follow the README to add real API keys
2. **Customize**: Modify colors, features, or UI components
3. **Deploy**: Use Vercel for frontend, Railway for backend
4. **Extend**: Add new features like meal planning or social sharing

## 🐛 Troubleshooting

### Common Issues:

**Port already in use**:
```bash
# Kill process on port 3000 or 3001
npx kill-port 3000
npx kill-port 3001
```

**Dependencies failed to install**:
```bash
# Clear cache and retry
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Frontend won't start**:
```bash
cd frontend
npm install
npm run dev
```

**Backend won't start**:
```bash
cd backend
npm install
npm run dev
```

## 📞 Need Help?

- Check the main README.md for detailed documentation
- Open an issue on GitHub
- The app includes comprehensive error handling and logging

---

**Ready to build the future of meal tracking? Let's go! 🚀**