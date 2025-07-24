import { useState } from "react";
import FacialExpression from "./Components/FacialExpression";
import MusicPlayers from "./Components/MusicPlayers";
import UploadMusic from "./Components/UploadMusic";

const App = () => {
  const [song, setSong] = useState([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  return (
    <div className="relative w-screen min-h-screen overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Main content */}
      <div className="relative z-10 w-full h-screen flex flex-col lg:flex-row">
        {/* Left panel - Facial Expression */}
        <div className="w-full lg:w-2/5 h-1/2 lg:h-full border-b lg:border-b-0 lg:border-r border-white/10">
          <FacialExpression setSong={setSong} />
        </div>

        {/* Right panel - Music Player */}
        <div className="w-full lg:w-3/5 h-1/2 lg:h-full">
          <MusicPlayers song={song} setIsUploadOpen={setIsUploadOpen} isUploadOpen={isUploadOpen} />
        </div>
      </div>

      {/* Upload Modal */}
      <UploadMusic isUploadOpen={isUploadOpen} setIsUploadOpen={setIsUploadOpen} />
    </div>
  );
};

export default App;
