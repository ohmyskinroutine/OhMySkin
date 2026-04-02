import { useState } from "react";
import Cookies from "js-cookie";
import "./App.css";
import Home from "./pages/Home/Home";
import Brands from "./pages/brands/Brands";
import Search from "./pages/Search/Search";
import Results from "./pages/Results/Results";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Categories from "./pages/Categories/Categories";
import ProductDetails from "./pages/Products/ProductDetails";
import Questionnaire from "./pages/Questionnaire/Questionnaire";
import Search from "./pages/Search/Search";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer/Footer";
import Payment from "./pages/Payment/Payment";
// I've imported this (payment) import in the project - Keanu
import Success from "./pages/Success/Success";
// I've imported this import (success) in the project - Keanu

function App() {
  const [user, setUser] = useState(() => {
    const stored = Cookies.get("user");
    return stored ? JSON.parse(stored) : null;
  });
  // Liens catégories
  const creamUrl =
    "https://world.openbeautyfacts.org/api/v2/search?categories_tags=en:face-creams&fields=code,product_name,categories_tags,ingredients_text,quantity,image_url,brands&json=1&page_size=50";
  const masksUrl =
    "https://world.openbeautyfacts.org/api/v2/search?categories_tags=en:face-masks&fields=code,product_name,categories_tags,ingredients_text,quantity,image_url,brands&json=1&page_size=50";
  const soapsUrl =
    "https://world.openbeautyfacts.org/api/v2/search?categories_tags=en:soaps&fields=code,product_name,categories_tags,ingredients_text,quantity,image_url,brands&json=1&page_size=50";
  const exfoliantsUrl =
    "https://world.openbeautyfacts.org/api/v2/search?categories_tags=en:face-scrubs&fields=code,product_name,categories_tags,ingredients_text,quantity,image_url,brands&json=1&page_size=50";
  const cleansersUrl =
    "https://world.openbeautyfacts.org/api/v2/search?categories_tags=en:cleansers&fields=code,product_name,categories_tags,ingredients_text,quantity,image_url,brands&json=1&page_size=50";
  const sunscreenUrl =
    "https://world.openbeautyfacts.org/api/v2/search?categories_tags=en:sunscreens&fields=code,product_name,categories_tags,ingredients_text,quantity,image_url,brands&json=1&page_size=50";

  return (
    <Router>    
      <Header user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup setUser={setUser} />} />
        <Route path="/marques" element={<Brands />} />
            <Route
          path="/cremes"
          element={<Categories title="Crèmes" url={creamUrl} />}
        />
        <Route
          path="/cremes/:code"
          element={<ProductDetails backPath="/cremes" />}
        />
        <Route
          path="/masques"
          element={<Categories title="Masques" url={masksUrl} />}
        />
        <Route
          path="/masques/:code"
          element={<ProductDetails backPath="/masques" />}
        />
        <Route
          path="/savons"
          element={<Categories title="Savons" url={soapsUrl} />}
        />
        <Route
          path="/savons/:code"
          element={<ProductDetails backPath="/savons" />}
        />
        <Route
          path="/exfoliants"
          element={<Categories title="Exfoliants" url={exfoliantsUrl} />}
        />
        <Route
          path="/exfoliants/:code"
          element={<ProductDetails backPath="/exfoliants" />}
        />
        <Route
          path="/cleansers"
          element={<Categories title="Cleansers" url={cleansersUrl} />}
        />
        <Route
          path="/cleansers/:code"
          element={<ProductDetails backPath="/cleansers" />}
        />
        <Route
          path="/solaires"
          element={<Categories title="Crèmes solaires" url={sunscreenUrl} />}
        />
        <Route
          path="/solaires/:code"
          element={<ProductDetails backPath="/solaires" />}
        />
        <Route path="/search" element={<Search />} />
        <Route path="/marques" element={<Brands />} />
        <Route path="/search" element={<Search />} />
        <Route path="/formulaire" element={<Questionnaire />} />
        <Route path="/routine" element={<Results />} />
        <Route path="/payment" element={<Payment />} />
        {/* I've added this Route (payment) in the project - Keanu */}
        <Route path="/success" element={<Success />} />
        {/* I've added this Route (success) in the project - Keanu */}
        <Route
          path="*"
          element={
            <div className="container">Vous n'êtes pas censés etre ici</div>
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
