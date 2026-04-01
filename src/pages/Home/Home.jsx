import "./Home.css";

const CLOUD_NAME = "dxehv4yky";

const images = [
  { id: "La-Roche-Posay_tcaekj", label: "Crème visage" },
  { id: "-Le-Petit-Olivier_vtbh9j", label: "Masque" },
  { id: "guerlain_ywn2ap", label: "Démaquillant" },
  { id: "rfurtherer_c7hoze", label: "Huile" },
  { id: "AvantSkincare_dhyld8", label: "Sérum" },
  { id: "paulas-choice_tb7uni", label: "Huile" },
  { id: "cattier_wmeh6l", label: "Huile" },
  { id: "k-beauty-erborian_1024x1024_xsigor", label: "Huile" },
  { id: "Uriage_kx1fuw", label: "Huile" },
  { id: "facetheory_wzohq5", label: "Huile" },
];
const getUrl = (publicId) =>
  `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${publicId}`;

const Home = () => {
  return (
    <main className="home">
      <section className="gallery-section">
        <h2 className="gallery-title">Nos produits</h2>
        <div className="gallery-scroll">
          {images.map((img) => (
            <div className="gallery-card" key={img.id}>
              <img src={getUrl(img.id)} alt={img.label} />
              {/* <p>{img.label}</p> */}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;
