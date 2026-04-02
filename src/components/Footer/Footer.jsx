import "./Footer.css";
import logo from "../../assets/react.svg";

const Footer = () => {
  return (
    <footer>
      <div>
        <p>
          Made by{" "}
          <a href="https://github.com/Margaux-972" target="_blank">
            Margaux,
          </a>{" "}
          <a href="https://github.com/Eva-caruana" target="_blank">
            Eva,
          </a>{" "}
          <a href="https://github.com/kmarguiraut-sys" target="_blank">
            Keanu,
          </a>{" "}
          <a href="https://github.com/lassana-hub" target="_blank">
            Lassana
          </a>
        </p>
        <p>
          Made with React <img src={logo} alt="logo React" />
        </p>
      </div>
    </footer>
  );
};

export default Footer;
