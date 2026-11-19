import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Home } from "./pages/Home";
import { BrowseGames } from "./pages/BrowseGames";
import { UploadGame } from "./pages/UploadGame";
import { Profile } from "./pages/Profile";
import PublicProfile from "./pages/PublicProfile";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { Toaster } from "./components/ui/sonner";
import { GameProvider } from "./context/GameContext";
import MainLayoutRoute from "./components/layouts/MainLayoutRoute";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { CommentProvider } from "./context/CommentContext";
import PlayPageWrapper from "@/pages/PlayPageWrapper.tsx";

function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <CommentProvider>
          <Toaster richColors />
          <div className="bg-background text-foreground min-h-screen">
            <AppRouter />
          </div>
        </CommentProvider>
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
          <Route index element={<Home />} />
          <Route path="/games" element={<BrowseGames />} />
          <Route path="/play/:id" element={<PlayPageWrapper />} />
          <Route path="/u/:username" element={<PublicProfile />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/upload-game" element={<UploadGame />} />
            <Route
              path="/submit-game"
              element={<Navigate to="/upload-game" replace />}
            />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
