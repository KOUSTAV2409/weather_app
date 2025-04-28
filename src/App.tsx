
import WeatherApp from "./Components/WeatherApp"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"


const App = () => {
  return (
    <>
    
    <WeatherApp/>
    <Analytics/>
    <SpeedInsights/>
    </>
  )
}

export default App