# 🎬 Media Platform Backend

A secure, scalable media streaming platform with JWT authentication, analytics, and production-ready features.

## ✨ Features

- 🔐 **JWT Authentication** - Secure admin login/signup
- 📁 **Media Upload** - Video/audio upload to Cloudinary
- 🔗 **Secure Streaming** - Time-limited, signed URLs (10-min expiry)
- 📊 **Analytics** - View tracking with IP logging
- ⚡ **Redis Caching** - Fast analytics with 5-minute cache
- 🛡️ **Rate Limiting** - Abuse prevention (50 views/15min, 5 auth/15min)
- 🧪 **Automated Tests** - Jest test suite
- 🐳 **Docker Ready** - Containerized deployment
- 📈 **Production Ready** - Security, performance, monitoring

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Redis (optional, for caching)
- Cloudinary account

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd klantroef
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```

Server runs at: `http://localhost:8000`

## 🔧 Environment Variables

Create a `.env` file with these variables:

```env
PORT=8000
MONGODB_URI=mongodb://localhost:27017  # or your Atlas URI
DB_NAME=videotube

ACCESS_TOKEN_SECRET=your-secret-key
REFRESH_TOKEN_SECRET=your-refresh-secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

STREAM_SECRET=your-stream-signing-secret
BASE_URL=http://localhost:8000

REDIS_URL=redis://localhost:6379
CORS_ORIGIN=*
```

## 📡 API Endpoints

### Authentication
```
POST /api/v1/auth/signup    # Admin registration
POST /api/v1/auth/login     # Admin login
```

### Media Management
```
POST /api/v1/media                    # Upload media (auth required)
GET  /api/v1/media/:id/stream-url     # Get secure streaming URL (auth required)
POST /api/v1/media/:id/view           # Log media view (auth + rate limited)
GET  /api/v1/media/:id/analytics      # Get analytics (auth + cached)
GET  /api/v1/media/stream/:id         # Stream media (public, validates URL)
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm test -- --coverage
```

## 🐳 Docker Deployment

### Single Container
```bash
docker build -t media-platform .
docker run -p 8000:8000 --env-file .env media-platform
```

### Full Stack (with Redis & MongoDB)
```bash
docker-compose up -d
```

This starts:
- App server (port 8000)
- Redis cache (port 6379)
- MongoDB (port 27017)
- Nginx proxy (port 80)

## 🔒 Security Features

- **JWT Authentication** with access/refresh tokens
- **Rate Limiting** on critical endpoints
- **Signed URLs** for secure streaming
- **IP-based access control**
- **Input validation** and sanitization
- **Error handling** without data leaks

## ⚡ Performance Features

- **Redis caching** for analytics (5-min TTL)
- **Database indexing** for fast queries
- **CDN delivery** via Cloudinary
- **Efficient aggregation** pipelines

## 📊 Analytics Dashboard Data

```json
{
  "total_views": 174,
  "unique_ips": 122,
  "views_per_day": {
    "2024-01-15": 34,
    "2024-01-16": 56
  },
  "recent_views": [...],
  "media_info": {...}
}
```

## 🛠️ Tech Stack

- **Runtime:** Node.js 18
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Cache:** Redis
- **Storage:** Cloudinary
- **Auth:** JWT
- **Testing:** Jest + Supertest
- **Container:** Docker

## 📁 Project Structure

```
src/
├── controllers/     # Business logic
├── models/         # Database schemas
├── routes/         # API endpoints
├── middlewares/    # Auth, rate limiting, etc.
├── utils/          # Helper functions
└── db/            # Database connection

tests/              # Test suites
```

## 🔄 Development Workflow

1. **Development:** `npm run dev`
2. **Testing:** `npm test`
3. **Building:** `docker build`
4. **Deployment:** `docker-compose up`

## 🚦 Health Check

```bash
curl http://localhost:8000/health
```

## 📈 Monitoring

- Request logs with timestamps
- Error tracking with stack traces
- Performance metrics via Redis
- Database query monitoring

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Add tests for new features
4. Ensure all tests pass
5. Submit pull request

## 📄 License

MIT License - see LICENSE file

---

**Built with ❤️ for learning modern backend development**