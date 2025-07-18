import { useState } from "react"
import FacialExpression from "./Components/FacialExpression"
import MusicPlayers from "./Components/MusicPlayers"

const App = () => {
  const [song, setSong] = useState([])
  return (
    <div className="w-full h-screen bg-black flex justify-between">
      <FacialExpression setSong={setSong} />
      <MusicPlayers song={song} />
    </div>
  )
}

export default App