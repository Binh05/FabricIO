import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Games } from "./pages/Games";
import { Play } from "./pages/Play";
import { UploadGame } from "./pages/UploadGame";
import { Profile } from "./pages/Profile";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { Toaster } from "./components/ui/sonner";
import { GameProvider } from "./context/GameContext";
import MainLayoutRoute from "./components/layouts/MainLayoutRoute";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <Toaster />
        <div className="bg-background text-foreground min-h-screen">
          <AppRouter />
        </div>
      </GameProvider>
    </AuthProvider>
  );
}

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* public */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        {/* layout */}
        <Route element={<MainLayoutRoute />}>
          <Route index element={<Games />} />
          <Route path="/games" element={<Games />} />
          <Route path="/play/:id" element={<Play />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/upload-game" element={<UploadGame />} />
            <Route path="/submit-game" element={<Navigate to="/upload-game" replace />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
