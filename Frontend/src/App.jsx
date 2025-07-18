import { useState } from "react";
import FacialExpression from "./Components/FacialExpression";
import MusicPlayers from "./Components/MusicPlayers";
import UploadMusic from "./Components/UploadMusic";

const App = () => {
  const [song, setSong] = useState([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  return (
    <div className="relative w-screen">
      <div className="w-full h-screen bg-black flex justify-between">
        <FacialExpression setSong={setSong} />
        <MusicPlayers song={song} setIsUploadOpen={setIsUploadOpen} isUploadOpen={isUploadOpen} />
      </div>
      <UploadMusic isUploadOpen={isUploadOpen} setIsUploadOpen={setIsUploadOpen} />
    </div>
  );
};

export default App;
