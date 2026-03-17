import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import WeatherApp from './components/WeatherApp';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<WeatherApp />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
