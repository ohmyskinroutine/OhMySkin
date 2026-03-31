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
import SkinBackground from "./components/SkinBackground/SkinBackground";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <SkinBackground />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/marques" element={<Brands />} />
        <Route path="/cremes" element={<Creams />} />
        <Route path="/cremes/:code" element={<Creams />} />
        <Route path="/masques" element={<Masks />} />
        <Route path="/masques/:code" element={<Masks />} />
        <Route path="/savons" element={<Soaps />} />
        <Route path="/savons/:code" element={<Soaps />} />
        {/* <Route path="/exfoliants" element={<Scrubs />} /> */}
        {/* <Route path="/exfoliants/:code" element={<Scrubs />} /> */}
        <Route path="/marques" element={<Brands />} />
        <Route path="/formulaire" element={<Questionnaire />} />
        <Route path="/routine" element={<Results />} />
        <Route path="/exfoliants" element={<Exfoliants />} />
        <Route path="/exfoliants/:code" element={<Exfoliant />} />
        <Route path="/cleansers" element={<Cleansers />} />
        <Route path="/solaires" element={<Sunscreen />} />
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
