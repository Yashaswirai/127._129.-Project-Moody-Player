# 🎵 Moody Player

A smart music player that uses facial expression recognition to detect your mood and automatically plays music that matches your emotional state.

## 🌟 Features

- **Real-time Facial Expression Detection**: Uses your webcam to analyze facial expressions and detect emotions
- **Mood-based Music Recommendation**: Automatically fetches and plays songs based on your detected mood
- **Music Upload & Management**: Upload your own music files and categorize them by mood
- **AI-Powered Mood Categorization**: Uploaded music gets automatically categorized to appropriate moods using Gemini API
- **Responsive Music Player**: Clean, intuitive interface for playing, pausing, and managing your music
- **Multiple Mood Categories**: Supports Happy, Sad, Energetic, Calm, Romantic, Angry, and Nostalgic moods

## 🏗️ Architecture

The project consists of two main components:

### Frontend (React + Vite)
- **Technology Stack**: React 19, Vite, TailwindCSS, Face-API.js
- **Key Components**:
  - `FacialExpression`: Handles webcam access and emotion detection
  - `MusicPlayers`: Manages music playback and display
  - `UploadMusic`: Handles music file uploads with mood categorization

### Backend (Node.js + Express)
- **Technology Stack**: Node.js, Express, MongoDB, Mongoose
- **Key Features**:
  - RESTful API for song management
  - File upload handling with Multer
  - Cloud storage integration with ImageKit
  - MongoDB database for song metadata

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB database
- ImageKit account for file storage
- Webcam for facial expression detection

### Environment Variables

Create `.env` files in both Frontend and Backend directories:

#### Backend `.env`
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

#### Frontend `.env`
```env
VITE_API_URL=http://localhost:3000/api
```

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd moody-player
   ```

2. **Install Backend Dependencies**
   ```bash
   cd Backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd Frontend
   npm install
   ```

4. **Start the Backend Server**
   ```bash
   cd Backend
   npm start
   ```

5. **Start the Frontend Development Server**
   ```bash
   cd Frontend
   npm run dev
   ```

6. **Access the Application**
   - Open your browser and navigate to `http://localhost:5173`
   - Allow webcam access when prompted

## 📁 Project Structure

```
moody-player/
├── Backend/
│   ├── src/
│   │   ├── models/
│   │   │   └── song.model.js          # MongoDB song schema
│   │   ├── routes/
│   │   │   └── song.route.js          # API routes for songs
│   │   ├── Services/
│   │   │   └── Storage.Service.js     # ImageKit integration
│   │   ├── db/
│   │   │   └── db.js                  # Database connection
│   │   └── app.js                     # Express app configuration
│   ├── uploads/                       # Temporary upload directory
│   ├── Server.js                      # Server entry point
│   └── package.json
├── Frontend/
│   ├── src/
│   │   ├── Components/
│   │   │   ├── FacialExpression.jsx   # Emotion detection component
│   │   │   ├── MusicPlayers.jsx       # Music player component
│   │   │   └── UploadMusic.jsx        # Music upload component
│   │   ├── utils/
│   │   │   └── API.js                 # Axios configuration
│   │   ├── App.jsx                    # Main app component
│   │   └── main.jsx                   # React entry point
│   ├── public/
│   │   └── models/                    # Face-API.js ML models
│   └── package.json
└── README.md
```

## 🎯 How It Works

1. **Emotion Detection**: The application accesses your webcam and uses Face-API.js to detect facial expressions in real-time
2. **Mood Mapping**: Detected expressions are mapped to mood categories (happy, sad, energetic, etc.)
3. **Music Fetching**: Based on the detected mood, the app queries the backend for songs matching that mood
4. **Music Playback**: Retrieved songs are displayed in the music player interface where you can play, pause, and browse tracks
5. **Music Upload**: Users can upload their own music files which get automatically categorized by mood using Gemini API for intelligent classification

## 🛠️ API Endpoints

### Songs
- `POST /api/song` - Upload a new song with mood categorization
- `GET /api/song?mood={mood}` - Fetch songs by mood category

## 🎨 Supported Moods

- **Happy** - Upbeat, joyful music
- **Sad** - Melancholic, emotional tracks
- **Energetic** - High-energy, motivational songs
- **Calm** - Peaceful, relaxing music
- **Romantic** - Love songs and romantic ballads
- **Angry** - Intense, aggressive tracks
- **Nostalgic** - Throwback and sentimental music

## 🔧 Technologies Used

### Frontend
- React 19
- Vite
- TailwindCSS
- Face-API.js
- Axios
- React Hook Form

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Multer
- ImageKit
- CORS

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you encounter any issues or have questions, please open an issue on the GitHub repository.
