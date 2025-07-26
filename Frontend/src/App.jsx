import { useState } from "react";
import FacialExpression from "./Components/FacialExpression";
import MusicPlayers from "./Components/MusicPlayers";
import UploadMusic from "./Components/UploadMusic";

const App = () => {
  const [song, setSong] = useState([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Main content */}
      <div className="relative z-10 w-full min-h-screen flex flex-col md:flex-row">
        {/* Left panel - Facial Expression */}
        <div className="w-full md:w-2/5 lg:w-2/5 h-[50vh] md:h-screen border-b md:border-b-0 md:border-r border-white/10">
          <FacialExpression setSong={setSong} />
        </div>

        {/* Right panel - Music Player */}
        <div className="w-full md:w-3/5 lg:w-3/5 h-[50vh] md:h-screen">
          <MusicPlayers song={song} setIsUploadOpen={setIsUploadOpen} isUploadOpen={isUploadOpen} />
        </div>
      </div>

      {/* Upload Modal */}
      <UploadMusic isUploadOpen={isUploadOpen} setIsUploadOpen={setIsUploadOpen} />
    </div>
  );
};

export default App;
