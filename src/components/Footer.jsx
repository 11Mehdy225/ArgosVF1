import React from "react";
import "../App.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="Footer-gle">
      <footer className="footer">
        <p>© {new Date().getFullYear()} Argos – Tous droits réservés.</p>
        <div className="footer-links">
          <Link to="/mentionsLegales">Mentions légales</Link>
          <Link to="/politiqueConfidentialite">Politique de confidentialité</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </footer>
    </footer>
  );
};

export default Footer;
