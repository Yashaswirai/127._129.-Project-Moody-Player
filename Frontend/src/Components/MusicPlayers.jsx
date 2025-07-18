import React from "react";

const MusicPlayers = () => {
  const MusicList = [
    { id: 1, title: "Song 1", artist: "Artist 1", mood: "happy" },
    { id: 2, title: "Song 2", artist: "Artist 2", mood: "sad" },
    { id: 3, title: "Song 3", artist: "Artist 3", mood: "angry" },
    { id: 4, title: "Song 4", artist: "Artist 4", mood: "relaxed" },
    { id: 5, title: "Song 5", artist: "Artist 5", mood: "excited" },
    { id: 6, title: "Song 6", artist: "Artist 6", mood: "romantic" },
  ];
  return (
    <div className="MusicPlayers w-3/5 h-screen p-5 border">
      <h2 className="w-full text-center text-2xl font-bold text-white">
        Music according to your mood🫡
      </h2>
      <div className="MusicList mt-4">
        {MusicList.map((song) => (
          <div key={song.id} className="song p-2 border-b border-gray-600 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">{song.title}</h3>
              <p className="text-gray-400">{song.artist}</p>
            </div>
            <div className="btns flex gap-2">
                <button className="p-2 bg-blue-500 text-white rounded active:scale-95">
                    Play
                </button>
                <button className="p-2 bg-red-500 text-white rounded active:scale-95">
                    Stop
                </button>
            </div>
            <div className="text-gray-400">{song.mood}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MusicPlayers;
