import React, { useRef, useState } from "react";

const MusicPlayers = ({ song }) => {
  const audioRef = useRef(null);
  const [playingSong, setPlayingSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState({});

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
    <div className="MusicPlayers w-3/5 h-screen p-5 border">
      <h2 className="w-full text-center text-2xl font-bold text-white">
        Music according to your mood🫡
      </h2>
      <div className="MusicList mt-4">
        {song.map((song) => (
          <div
            key={song._id}
            className="song p-2 border-b border-gray-600 flex items-center justify-between"
          >
            <div className="song-info w-2/6">
              <h3 className="text-lg font-semibold text-white">
                {song.title.substr(0, 30)} ...
              </h3>
              <audio ref={audioRef} className="hidden"></audio>
              <p className="text-gray-400">{song.artist}</p>
            </div>
            <button
              className={`text-2xl text-white rounded active:scale-95`}
              onClick={() => (isPlaying[song._id] ? stopSong() : playSong(song))}
            >
              {isPlaying[song._id] ? "⏸️" : "▶️"}
            </button>
            <div className="text-gray-400">{song.mood}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MusicPlayers;
