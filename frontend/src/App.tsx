import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { MainLayout } from './layouts/MainLayout';
import { Home } from './pages/Home';
import { Games } from './pages/Games';
import { GameDetail } from './pages/GameDetail';
import { Play } from './pages/Play';
import { SubmitGame } from './pages/SubmitGame';
import { GameReview } from './pages/GameReview';
import { Profile } from './pages/Profile';

function App() {
  return (
    <AppProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/games" element={<Games />} />
            <Route path="/game-detail/:id" element={<GameDetail />} />
            <Route path="/play/:id" element={<Play />} />
            <Route path="/submit-game" element={<SubmitGame />} />
            <Route path="/game-review" element={<GameReview />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </MainLayout>
      </Router>
    </AppProvider>
  );
}

export default App;
