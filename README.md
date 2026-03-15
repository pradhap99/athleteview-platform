# AthleteView Platform

**AI-powered sports streaming platform** — wearable SmartPatch cameras with biometrics, real-time AI video processing, 3D reconstruction, and broadcasting API.

![Architecture](docs/architecture/system-overview.png)

## 🏏 What is AthleteView?

AthleteView combines a **15g peel-and-stick camera patch (SmartPatch)** worn by athletes with an **AI streaming platform** that processes multi-camera feeds in real-time for immersive sports broadcasting.

### SmartPatch Hardware
- 70×45×4mm, 15g flexible body-worn camera
- Sony IMX577 sensor (12.3MP, 1080p@30fps with EIS)
- Full vitals suite: HR (PPG), SpO2, body temperature, sweat analysis
- SRT streaming over Wi-Fi 6 / 5G
- Medical-grade silicone adhesive

### AI Platform
- Real-time video enhancement (super-resolution, HDR, denoising)
- Multi-camera athlete tracking and identification
- 3D pose estimation and scene reconstruction
- Automatic highlight detection and clip generation
- Live biometric overlay for broadcasts
- API for broadcaster integration (Hotstar, JioCinema, FanCode)

## 📁 Repository Structure

```
athleteview-platform/
├── gateway/              # Node.js API gateway (Express + WebSocket)
│   └── src/
│       ├── routes/       # REST API endpoints
│       ├── middleware/   # Auth, rate limiting, logging
│       └── websocket/    # Real-time biometric feeds
├── ai-service/           # Python FastAPI AI processing service
│   └── src/
│       ├── models/       # AI model definitions
│       ├── pipelines/    # Video processing pipelines
│       ├── inference/    # Model serving (Triton/ONNX)
│       └── utils/        # Shared utilities
├── streaming/            # Video ingest, transcode, delivery
│   └── src/
│       ├── ingest/       # SRT/RTMP stream reception
│       ├── transcode/    # FFmpeg transcoding pipeline
│       └── delivery/     # HLS/DASH/WebRTC delivery
├── biometrics/           # Biometric data processing service
│   └── src/
│       ├── sensors/      # Sensor data parsers
│       ├── analysis/     # Real-time vitals analysis
│       └── alerts/       # Health threshold alerts
├── shared/               # Shared schemas and utilities
│   ├── proto/            # Protobuf definitions
│   ├── schemas/          # JSON schemas
│   └── utils/            # Common utilities
├── infra/                # Infrastructure as code
│   ├── k8s/              # Kubernetes manifests
│   ├── docker/           # Dockerfiles
│   └── terraform/        # Cloud infrastructure
├── docs/                 # Documentation
│   ├── api/              # API documentation
│   ├── architecture/     # System design docs
│   └── deployment/       # Deployment guides
└── scripts/              # Development & deployment scripts
```

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Python 3.11+
- Node.js 20+
- FFmpeg 6.0+
- NVIDIA GPU + CUDA 12.0+ (for AI inference)

### Development Setup

```bash
# Clone the repository
git clone https://github.com/pradhap99/athleteview-platform.git
cd athleteview-platform

# Copy environment variables
cp .env.example .env

# Start all services
docker-compose -f docker-compose.dev.yml up -d

# Or run individual services:
cd gateway && npm install && npm run dev
cd ai-service && pip install -r requirements.txt && uvicorn src.main:app --reload
cd streaming && pip install -r requirements.txt && python src/main.py
cd biometrics && pip install -r requirements.txt && uvicorn src.main:app --reload
```

### API Endpoints

| Service | URL | Description |
|---------|-----|-------------|
| Gateway API | `http://localhost:3000` | Main API gateway |
| AI Service | `http://localhost:8001` | AI processing API |
| Streaming | `http://localhost:8002` | Stream management |
| Biometrics | `http://localhost:8003` | Biometric data API |
| WebSocket | `ws://localhost:3000/ws` | Real-time feeds |

## 🏗️ Architecture

```
SmartPatch → SRT Ingest → Kafka → AI Pipeline → CDN → Viewers
                ↓              ↓
         Biometric Data    Video Enhancement
                ↓              ↓
         TimescaleDB      3D Reconstruction
                ↓              ↓
         WebSocket Feed   Highlight Detection
                ↓              ↓
         Broadcaster API   Clip Generation
```

## 📊 Tech Stack

| Layer | Technology |
|-------|-----------|
| API Gateway | Node.js, Express, Socket.io |
| AI Service | Python, FastAPI, PyTorch, ONNX Runtime |
| Video Processing | FFmpeg, GStreamer, NVIDIA DeepStream |
| AI Inference | Triton Inference Server, TensorRT |
| Streaming | SRT, WebRTC, HLS/DASH |
| Message Queue | Apache Kafka |
| Database | PostgreSQL + TimescaleDB |
| Cache | Redis |
| Object Storage | MinIO (dev) / S3 (prod) |
| Container | Docker, Kubernetes |
| CI/CD | GitHub Actions |
| Monitoring | Prometheus, Grafana |

## 📄 License

Proprietary — All rights reserved. See [LICENSE](LICENSE) for details.

## 👤 Author

**Pradhap M** — Founder, AthleteView
- GitHub: [@pradhap99](https://github.com/pradhap99)
