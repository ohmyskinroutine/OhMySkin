import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Home from "./pages/Home/Home";
import Brands from "./pages/brands/Brands";
import Soap from "./pages/Soaps/Soaps";

import Sunscreen from "./pages/Sunscreen/Sunscreen";
import Cleansers from "./pages/Cleansers/Cleansers";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/marques" element={<Brands />} />
        <Route path="/soap" element={<Soap />} />
        <Route path="/cremes" element={<Creams />} />
        <Route path="/cremes/:code" element={<Creams />} />
        {/* <Route path="/masques" element={<Masks />} />
        <Route path="/masques/:code" element={<Masks />} />
        <Route path="/savons" element={<Soaps />} />
        <Route path="/savons/:code" element={<Soaps />} />
        <Route path="/exfoliants" element={<Scrubs />} />
        <Route path="/exfoliants/:code" element={<Scrubs />} />
        <Route path="/marques" element={<Brands />} />
        <Route path="/formulaire" element={<Questionnaire />} /> */}
        {/* <Route path="/routine" element={<Result />}  */}

        <Route path="/sunscreen" element={<Sunscreen />} />
        <Route path="/sunscreen/:code" element={<Sunscreen />} />
        <Route path="/cleansers" element={<Cleansers />} />
        <Route path="/cleansers/:code" element={<Cleansers />} />

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
