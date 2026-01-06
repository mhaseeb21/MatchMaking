import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import BrowseProfiles from "./pages/BrowseProfiles";
import RequirementFeed from "./pages/RequirementFeed";
import CreateRequirement from "./pages/CreateRequirement";
import MyRequirements from "./pages/MyRequirements";
import SendProposalModal from "./components/proposals/SendProposalModal";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/browse" element={<BrowseProfiles />} />
        <Route path="/requirements" element={<RequirementFeed />} />
        <Route path="/requirements/create" element={<CreateRequirement />} />
        <Route path="/requirements/my" element={<MyRequirements />} />
        <Route path="/proposals" element={<SendProposalModal />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
