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
    <div className="h-full p-3 sm:p-4 md:p-6 lg:p-8 flex flex-col relative animate-fadeIn">
      {/* Header with Add Song Button */}
      <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between mb-3 sm:mb-4 md:mb-6 lg:mb-8 gap-2 sm:gap-3 md:gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">
            Your Mood Playlist
          </h2>
          <p className="text-gray-300 text-xs sm:text-sm md:text-base">
            Music curated based on your detected emotions
          </p>
        </div>

        <button
          className={`btn-hover px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm md:text-base transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg w-full xs:w-auto ${
            isUploadOpen
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/25'
              : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-blue-500/25'
          }`}
          onClick={() => setIsUploadOpen((prev) => !prev)}
        >
          <div className="flex items-center justify-center space-x-1 sm:space-x-2">
            {isUploadOpen ? (
              <>
                <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Close</span>
              </>
            ) : (
              <>
                <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Song</span>
              </>
            )}
          </div>
        </button>
      </div>

      {/* Music List Container */}
      <div className="flex-1 glass rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-4 lg:p-6 overflow-hidden min-h-0">
        <div className="h-full custom-scrollbar overflow-y-auto">
          {song.length > 0 ? (
            <div className="space-y-2 sm:space-y-3">
              {song.map((songItem, index) => (
                <div
                  key={songItem._id}
                  className="group glass-dark rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 hover:bg-white/10 transition-all duration-300 animate-slideIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between gap-2">
                    {/* Song Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-white truncate group-hover:text-purple-300 transition-colors">
                        {songItem.title}
                      </h3>
                      <p className="text-gray-400 text-xs sm:text-sm mt-0.5 sm:mt-1 truncate">{songItem.artist}</p>
                      <audio ref={audioRef} className="hidden"></audio>
                    </div>

                    {/* Mood Badge - Hidden on mobile, visible on sm+ */}
                    <div className="mx-1 sm:mx-2 md:mx-4 hidden sm:block flex-shrink-0">
                      <span className={`inline-flex items-center px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium ${
                        getMoodColor(songItem.mood)
                      }`}>
                        <span className="mr-0.5 sm:mr-1">{getMoodEmoji(songItem.mood)}</span>
                        <span className="hidden md:inline">{songItem.mood.charAt(0).toUpperCase() + songItem.mood.slice(1)}</span>
                      </span>
                    </div>

                    {/* Music Visualizer (when playing) */}
                    {isPlaying[songItem._id] && (
                      <div className="flex items-center space-x-0.5 sm:space-x-1 mr-1 sm:mr-2 md:mr-4 flex-shrink-0">
                        <div className="w-0.5 sm:w-1 bg-green-400 rounded-full music-bar-1"></div>
                        <div className="w-0.5 sm:w-1 bg-green-400 rounded-full music-bar-2"></div>
                        <div className="w-0.5 sm:w-1 bg-green-400 rounded-full music-bar-3"></div>
                        <div className="w-0.5 sm:w-1 bg-green-400 rounded-full music-bar-1"></div>
                      </div>
                    )}

                    {/* Play Button */}
                    <button
                      className={`ripple w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 hover-lift flex-shrink-0 ${
                        isPlaying[songItem._id]
                          ? 'bg-red-500 hover:bg-red-600 glow-red'
                          : 'bg-green-500 hover:bg-green-600 glow-green'
                      }`}
                      onClick={() =>
                        isPlaying[songItem._id] ? stopSong() : playSong(songItem)
                      }
                    >
                      {isPlaying[songItem._id] ? (
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                        </svg>
                      ) : (
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* Mood Badge for mobile - Visible only on mobile */}
                  <div className="mt-2 sm:hidden">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      getMoodColor(songItem.mood)
                    }`}>
                      <span className="mr-1">{getMoodEmoji(songItem.mood)}</span>
                      <span>{songItem.mood.charAt(0).toUpperCase() + songItem.mood.slice(1)}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center p-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">No Music Yet</h3>
                <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 max-w-xs mx-auto">
                  Capture your facial expression to discover music that matches your mood
                </p>
                <div className="inline-flex items-center space-x-1 sm:space-x-2 glass-dark rounded-full px-3 sm:px-4 py-1.5 sm:py-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  <span className="text-gray-300 text-xs sm:text-sm">Waiting for mood detection...</span>
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
