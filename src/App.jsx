import { useState } from "react";
import Cookies from "js-cookie";
import "./App.css";
import Home from "./pages/Home/Home";
import Masks from "./pages/Masks/Masks";
import Soaps from "./pages/Soaps/Soaps";
import Brands from "./pages/brands/Brands";
import Creams from "./pages/Creams/Creams";
import Results from "./pages/Results/Results";
import Header from "./components/Header/Header";
import Cleansers from "./pages/Cleansers/Cleansers";
import Sunscreen from "./pages/Sunscreen/Sunscreen";
import Exfoliant from "./pages/Exfoliants/Exfoliant";
import Exfoliants from "./pages/Exfoliants/Exfoliants";
import Questionnaire from "./pages/Questionnaire/Questionnaire";
import Search from "./pages/Search/Search";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [user, setUser] = useState(() => {
    const stored = Cookies.get("user");
    return stored ? JSON.parse(stored) : null;
  });

  return (
    <Router>
      <Header user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup setUser={setUser} />} />
        <Route path="/marques" element={<Brands />} />
        <Route path="/cremes" element={<Creams />} />
        <Route path="/cremes/:code" element={<Creams />} />
        <Route path="/masques" element={<Masks />} />
        <Route path="/masques/:code" element={<Masks />} />
        <Route path="/savons" element={<Soaps />} />
        <Route path="/savons/:code" element={<Soaps />} />
        <Route path="/formulaire" element={<Questionnaire />} />
        <Route path="/routine" element={<Results />} />
        <Route path="/exfoliants" element={<Exfoliants />} />
        <Route path="/exfoliants/:code" element={<Exfoliant />} />
        <Route path="/search" element={<Search />} />
        <Route path="/cleansers" element={<Cleansers />} />
        <Route path="/cleansers/:code" element={<Cleansers />} />
        <Route path="/solaires" element={<Sunscreen />} />
        <Route path="/solaires/:code" element={<Sunscreen />} />

        <Route
          path="*"
          element={
            <div className="container">Vous n'êtes pas censés etre ici</div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
