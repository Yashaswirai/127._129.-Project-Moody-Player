import React, { useRef, useState } from "react";

const MusicPlayers = ({ song, setIsUploadOpen, isUploadOpen }) => {
  const audioRef = useRef(null);
  const [playingSong, setPlayingSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState({});

  // Helper function to get mood-specific colors
  const getMoodColor = (mood) => {
    const moodColors = {
      happy: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
      sad: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
      energetic: 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
      calm: 'bg-green-500/20 text-green-300 border border-green-500/30',
      romantic: 'bg-pink-500/20 text-pink-300 border border-pink-500/30',
      angry: 'bg-red-500/20 text-red-300 border border-red-500/30',
      nostalgic: 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
    };
    return moodColors[mood] || 'bg-gray-500/20 text-gray-300 border border-gray-500/30';
  };

  // Helper function to get mood-specific emojis
  const getMoodEmoji = (mood) => {
    const moodEmojis = {
      happy: '😊',
      sad: '😢',
      energetic: '⚡',
      calm: '😌',
      romantic: '💕',
      angry: '😠',
      nostalgic: '🌅',
      neutrsal: '😐'
    };
    return moodEmojis[mood] || '🎵';
  };

  const playSong = (song) => {
    if (playingSong) {
      playingSong.pause();
    }
    audioRef.current = new Audio(song.url);
    audioRef.current.play();
    setIsPlaying({ [song._id]: true });
    setPlayingSong(audioRef.current);
  };
  const stopSong = () => {
    if (playingSong) {
      playingSong.pause();
      setPlayingSong(null);
      setIsPlaying({});
    }
  };
  return (
    <div className="h-full p-4 lg:p-8 flex flex-col relative animate-fadeIn">
      {/* Header with Add Song Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 lg:mb-8 gap-4">
        <div>
          <h2 className="text-xl lg:text-3xl font-bold text-white mb-2">
            Your Mood Playlist
          </h2>
          <p className="text-gray-300 text-xs lg:text-sm">
            Music curated based on your detected emotions
          </p>
        </div>

        <button
          className={`btn-hover px-4 lg:px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg ${
            isUploadOpen
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/25'
              : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-blue-500/25'
          }`}
          onClick={() => setIsUploadOpen((prev) => !prev)}
        >
          <div className="flex items-center space-x-2">
            {isUploadOpen ? (
              <>
                <svg className="w-4 lg:w-5 h-4 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="text-sm lg:text-base">Close</span>
              </>
            ) : (
              <>
                <svg className="w-4 lg:w-5 h-4 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-sm lg:text-base">Add Song</span>
              </>
            )}
          </div>
        </button>
      </div>

      {/* Music List Container */}
      <div className="flex-1 glass rounded-2xl p-3 lg:p-6 overflow-hidden">
        <div className="h-full custom-scrollbar overflow-y-auto">
          {song.length > 0 ? (
            <div className="space-y-2 lg:space-y-3">
              {song.map((songItem, index) => (
                <div
                  key={songItem._id}
                  className="group glass-dark rounded-xl p-3 lg:p-4 hover:bg-white/10 transition-all duration-300 animate-slideIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between">
                    {/* Song Info */}
                    <div className="flex-1 min-w-0 mr-2 lg:mr-4">
                      <h3 className="text-sm lg:text-lg font-semibold text-white truncate group-hover:text-purple-300 transition-colors">
                        {songItem.title.length > (window.innerWidth < 768 ? 20 : 35) ? `${songItem.title.substr(0, window.innerWidth < 768 ? 20 : 35)}...` : songItem.title}
                      </h3>
                      <p className="text-gray-400 text-xs lg:text-sm mt-1">{songItem.artist}</p>
                      <audio ref={audioRef} className="hidden"></audio>
                    </div>

                    {/* Mood Badge */}
                    <div className="mx-2 lg:mx-4 hidden sm:block">
                      <span className={`inline-flex items-center px-2 lg:px-3 py-1 rounded-full text-xs font-medium ${
                        getMoodColor(songItem.mood)
                      }`}>
                        <span className="mr-1">{getMoodEmoji(songItem.mood)}</span>
                        <span className="hidden lg:inline">{songItem.mood.charAt(0).toUpperCase() + songItem.mood.slice(1)}</span>
                      </span>
                    </div>

                    {/* Music Visualizer (when playing) */}
                    {isPlaying[songItem._id] && (
                      <div className="flex items-center space-x-1 mr-2 lg:mr-4">
                        <div className="w-1 bg-green-400 rounded-full music-bar-1"></div>
                        <div className="w-1 bg-green-400 rounded-full music-bar-2"></div>
                        <div className="w-1 bg-green-400 rounded-full music-bar-3"></div>
                        <div className="w-1 bg-green-400 rounded-full music-bar-1"></div>
                      </div>
                    )}

                    {/* Play Button */}
                    <button
                      className={`ripple w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 hover-lift ${
                        isPlaying[songItem._id]
                          ? 'bg-red-500 hover:bg-red-600 glow-red'
                          : 'bg-green-500 hover:bg-green-600 glow-green'
                      }`}
                      onClick={() =>
                        isPlaying[songItem._id] ? stopSong() : playSong(songItem)
                      }
                    >
                      {isPlaying[songItem._id] ? (
                        <svg className="w-4 lg:w-6 h-4 lg:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                        </svg>
                      ) : (
                        <svg className="w-4 lg:w-6 h-4 lg:h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No Music Yet</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Capture your facial expression to discover music that matches your mood
                </p>
                <div className="inline-flex items-center space-x-2 glass-dark rounded-full px-4 py-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  <span className="text-gray-300 text-sm">Waiting for mood detection...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MusicPlayers;
