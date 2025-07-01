# Mini_CRM_platform
# 📊Mini CRM Platform

Lightweight CRM platform with customer segmentation, personalized campaign delivery, and AI-driven insights.

## 🚀 Features

- **Data Ingestion APIs**: Customer and order secure REST APIs.
- **Campaign Creation UI**: Dynamic rule builder with audience preview.
- **Campaign Delivery & Logging**: Simulated message delivery with logging.
- **Authentication**: Google OAuth 2.0 integration.
- **AI Integration**: Natural language to segment rules conversion.

## 🛠️Tech Stack

- **Frontend**: React.js / Next.js
- **Backend**: Node.js (Express)
- **Database**: MongoDB
- **Message Broker**: Redis Streams
- **AI Services**: OpenAI GPT-4 API

## 🧱 Architecture
G -->|Delivery Receipt| H[Delivery Receipt API]
H -->|Update Status| D
B -->|AI Request| I[OpenAI API]
I -->|AI Response| B
