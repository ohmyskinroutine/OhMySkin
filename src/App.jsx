import "./App.css";
import Cookies from "js-cookie";
import { useState } from "react";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Profile from "./pages/Profile/Profile";
import Brands from "./pages/brands/Brands";
import Search from "./pages/Search/Search";
import Results from "./pages/Results/Results";
import Payment from "./pages/Payment/Payment";
import Success from "./pages/Success/Success";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Categories from "./pages/Categories/Categories";
import BrandProducts from "./pages/Brands/BrandProduct";
import ProductDetails from "./pages/Products/ProductDetails";
import Questionnaire from "./pages/Questionnaire/Questionnaire";
// import Profile from "./pages/Profile/Profile";
// ⬆️⬆️⬆️ Keanu - j'ai commenter cette ligne car l'import avait déjà été faite
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoutes/ProtectedRoute";
// ⬆️⬆️⬆️ Keanu - j'ai importer cette ligne pour la connection d'utilisateur Stripe
import Favorites from "./pages/Favorites/Favorites";
// ⬆️⬆️⬆️ Keanu - j'ai importer cette ligne pour que les utilisateurs puissent acceder à leur favoris sur leur page profil

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
        <Route
          path="/cremes"
          element={<Categories title="Crèmes" url={creamUrl} user={user} />}
        />
        <Route
          path="/cremes/:code"
          element={<ProductDetails backPath="/cremes" user={user} />}
        />
        <Route
          path="/masques"
          element={<Categories title="Masques" url={masksUrl} user={user} />}
        />
        <Route
          path="/masques/:code"
          element={<ProductDetails backPath="/masques" user={user} />}
        />
        <Route
          path="/savons"
          element={<Categories title="Savons" url={soapsUrl} user={user} />}
        />
        <Route
          path="/savons/:code"
          element={<ProductDetails backPath="/savons" user={user} />}
        />
        <Route
          path="/exfoliants"
          element={
            <Categories title="Exfoliants" url={exfoliantsUrl} user={user} />
          }
        />
        <Route
          path="/exfoliants/:code"
          element={<ProductDetails backPath="/exfoliants" user={user} />}
        />
        <Route
          path="/cleansers"
          element={
            <Categories title="Cleansers" url={cleansersUrl} user={user} />
          }
        />
        <Route
          path="/cleansers/:code"
          element={<ProductDetails backPath="/cleansers" user={user} />}
        />
        <Route
          path="/solaires"
          element={
            <Categories
              title="Crèmes solaires"
              url={sunscreenUrl}
              user={user}
            />
          }
        />
        <Route
          path="/solaires/:code"
          element={<ProductDetails backPath="/solaires" user={user} />}
        />
        <Route path="/search" element={<Search />} />
        <Route path="/marques" element={<Brands />} />
        <Route path="/formulaire" element={<Questionnaire />} />

        <Route path="/routine" element={<Results user={user} />} />

        <Route
          path="/profile"
          element={<Profile user={user} setUser={setUser} />}
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute user={user}>
              <Payment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/success"
          element={
            <ProtectedRoute user={user}>
              <Success />
            </ProtectedRoute>
          }
        />
        <Route path="/marques/:brand" element={<BrandProducts />} />
        <Route
          path="*"
          element={
            <div className="container">Vous n'êtes pas censés etre ici</div>
          }
        />
        <Route path="/favorites" element={<Favorites user={user} />} />
        {/* ⬆️⬆️⬆️⬆️ À garder. Pour que l'utilisateur puisse accéder à ses favoris uniquement s'il est connecté */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
