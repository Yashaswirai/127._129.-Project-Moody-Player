import FacialExpression from "./Components/FacialExpression"
import MusicPlayers from "./Components/MusicPlayers"

const App = () => {
  return (
    <div className="w-full h-screen bg-black flex justify-between">
      <FacialExpression/>
      <MusicPlayers/>
    </div>
  )
}

export default App