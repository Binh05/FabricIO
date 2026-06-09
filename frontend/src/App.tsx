import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { MainLayout } from "./components/layouts/MainLayout";
import { Home } from "./pages/Home";
import { Games } from "./pages/Games";
import { GameDetail } from "./pages/GameDetail";
import { Play } from "./pages/Play";
import { SubmitGame } from "./pages/SubmitGame";
import { Profile } from "./pages/Profile";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { Toaster } from "./components/ui/sonner";
import { GameProvider } from "./context/GameContext";

function App() {
  return (
    <GameProvider>
      <AppProvider>
        <Toaster />
        <div className="bg-background text-foreground min-h-screen">
          <AppRouter />
        </div>
      </AppProvider>
    </GameProvider>
  );
}

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="*"
          element={
            <MainLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/games" element={<Games />} />
                <Route path="/game-detail/:id" element={<GameDetail />} />
                <Route path="/play/:id" element={<Play />} />
                <Route path="/submit-game" element={<SubmitGame />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
