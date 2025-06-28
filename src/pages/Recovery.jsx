import React, { useEffect, useState } from "react";
import UploadModal from "../components/forRecouvrement/UploadModal";
import "../ui/recouvrement.css";
import { sendFsContraventions, getRecouvrementHistorique } from "../api";
import * as XLSX from "xlsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
// import { Oval } from "react-loader-spinner";

const Recovery = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resultats, setResultats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historique, setHistorique] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("🔒 Accès non autorisé");
      navigate("/");
      return;
    }

    getRecouvrementHistorique()
      .then(setHistorique)
      .catch((err) => toast.error("Erreur historique"));
  }, []);

  const handleUploadSubmit = async ({ mois, annee, jsonData }) => {
    setLoading(true);
    try {
      const response = await sendFsContraventions(mois, annee, jsonData);
      setResultats(response); // Affichage dans le tableau
      toast.success("✅ Traitement réussi !");
    } catch (error) {
      console.error("Erreur envoi fichier:", error);
      toast.error("❌ Une erreur est survenue lors du traitement.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(resultats);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Recouvrement");
    XLSX.writeFile(workbook, "recouvrement_final.xlsx");
  };

  const regrouperParChauffeur = (data) => {
    const grouped = {};
    data.forEach((item) => {
      const key = item.nom + "_" + item.prenom;
      if (!grouped[key]) {
        grouped[key] = {
          nom: item.nom,
          prenom: item.prenom,
          montantTotal: 0,
          nombreInfractions: 0,
          telephone: item.telephone || "",
          email: item.email || "",
        };
      }
      grouped[key].montantTotal += Number(item.montant);
      grouped[key].nombreInfractions += 1;
    });
    return Object.values(grouped);
  };

  const notifierChauffeur = async (chauffeur) => {
    try {
      const res = await fetch("http://localhost:3000/api/notify-driver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(chauffeur),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success(`Notification envoyée à ${chauffeur.prenom}`);
    } catch (err) {
      toast.error("Erreur de notification : " + err.message);
    }
  };

  return (
    <>
      <div className="recouvrement-page">
        <h1>Page Recouvrement</h1>

        <button className="upload-button" onClick={() => setIsModalOpen(true)}>
          Charger un fichier
        </button>

        <UploadModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleUploadSubmit}
        />

        <ToastContainer />

        {loading && (
          <div className="spinner-container">
            {/* <Oval height={50} width={50} color="#007bff" visible={true} />
          <p>Traitement en cours...</p> */}
          </div>
        )}

        {resultats.length > 0 && !loading && (
          <>
            <h2>Résultat du recouvrement</h2>
            <button className="download-button" onClick={handleDownloadExcel}>
              📥 Télécharger le fichier Excel
            </button>

            <table className="result-table">
              <thead>
                <tr>
                  {Object.keys(resultats[0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {resultats.map((row, i) => (
                  <tr key={i}>
                    {Object.values(row).map((val, j) => (
                      <td key={j}>{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
        <div>
          {resultats.length > 0 && (
            <>
              <h2>Récapitulatif par chauffeur</h2>
              <div className="recap-container">
                {regrouperParChauffeur(resultats).map((chauffeur, i) => (
                  <div className="recap-card" key={i}>
                    <h3>
                      {chauffeur.nom} {chauffeur.prenom}
                    </h3>
                    <p>Infractions : {chauffeur.nombreInfractions}</p>
                    <p>Montant total : {chauffeur.montantTotal} F</p>
                    <button
                      className="notify-button"
                      onClick={() => notifierChauffeur(chauffeur)}
                    >
                      📩 Notifier
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {historique.length > 0 && (
          <>
            <h2>Historique des traitements</h2>
            <table className="history-table">
              <thead>
                <tr>
                  <th>Mois</th>
                  <th>Année</th>
                  <th>Date de traitement</th>
                  <th>Fichier</th>
                </tr>
              </thead>
              <tbody>
                {historique.map((h, i) => (
                  <tr key={i}>
                    <td>{h.mois}</td>
                    <td>{h.annee}</td>
                    <td>{new Date(h.dateTraitement).toLocaleString()}</td>
                    <td>
                      <a
                        href={`/api/recouvrement/telecharger/${h.fileName}`}
                        download
                      >
                        Télécharger
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </>
  );
};

export default Recovery;

// import React, { useEffect, useState } from "react";
// import UploadModal from "../components/forRecouvrement/UploadModal";
// import "../ui/recouvrement.css";
// import {
//   sendFsContraventions,
//   getRecouvrementHistorique,
//   getDernierRecouvrement, // ➕ nouvelle API
// } from "../api";
// import * as XLSX from "xlsx";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useNavigate } from "react-router-dom";

// const Recovery = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [resultats, setResultats] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [historique, setHistorique] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       toast.error("🔒 Accès non autorisé");
//       navigate("/");
//       return;
//     }

//     // Récupérer l'historique
//     getRecouvrementHistorique()
//       .then(setHistorique)
//       .catch(() => toast.error("Erreur historique"));

//     // Récupérer le dernier fichier traité
//     getDernierRecouvrement()
//     .then(setResultats)
//     .catch(() => {
//       // pas d'erreur toast ici pour éviter d'afficher une alerte à chaque fois
//       console.log("Aucun dernier fichier trouvé");
//     });
//   }, []);

//   const handleUploadSubmit = async ({ mois, annee, jsonData }) => {
//     setLoading(true);
//     try {
//       const response = await sendFsContraventions(mois, annee, jsonData);
//       setResultats(response); // ➕ Met à jour le résultat
//       toast.success("✅ Traitement réussi !");
//     } catch (error) {
//       console.error("Erreur envoi fichier:", error);
//       toast.error("❌ Une erreur est survenue lors du traitement.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDownloadExcel = () => {
//     const worksheet = XLSX.utils.json_to_sheet(resultats);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Recouvrement");
//     XLSX.writeFile(workbook, "recouvrement_final.xlsx");
//   };

//   const regrouperParChauffeur = (data) => {
//     const grouped = {};
//     data.forEach((item) => {
//       const key = item.nom + "_" + item.prenom;
//       if (!grouped[key]) {
//         grouped[key] = {
//           nom: item.nom,
//           prenom: item.prenom,
//           montantTotal: 0,
//           nombreInfractions: 0,
//           telephone: item.telephone || "",
//           email: item.email || "",
//         };
//       }
//       grouped[key].montantTotal += Number(item.montant);
//       grouped[key].nombreInfractions += 1;
//     });
//     return Object.values(grouped);
//   };

//   const notifierChauffeur = async (chauffeur) => {
//     try {
//       const res = await fetch("http://localhost:3000/api/notify-driver", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(chauffeur),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message);

//       toast.success(`Notification envoyée à ${chauffeur.prenom}`);
//     } catch (err) {
//       toast.error("Erreur de notification : " + err.message);
//     }
//   };

//   return (
//     <>
//       <div className="recouvrement-page">
//         <h1>Page Recouvrement</h1>

//         <button className="upload-button" onClick={() => setIsModalOpen(true)}>
//           Charger un fichier
//         </button>

//         <UploadModal
//           isOpen={isModalOpen}
//           onClose={() => setIsModalOpen(false)}
//           onSubmit={handleUploadSubmit}
//         />

//         <ToastContainer />

//         {loading && (
//           <div className="spinner-container">
//             {/* Spinner ici si besoin */}
//           </div>
//         )}

//         {resultats.length > 0 && !loading && (
//           <>
//             <h2>Résultat du recouvrement</h2>
//             <button className="download-button" onClick={handleDownloadExcel}>
//               📥 Télécharger le fichier Excel
//             </button>

//             <table className="result-table">
//               <thead>
//                 <tr>
//                   {Object.keys(resultats[0]).map((key) => (
//                     <th key={key}>{key}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {resultats.map((row, i) => (
//                   <tr key={i}>
//                     {Object.values(row).map((val, j) => (
//                       <td key={j}>{val}</td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </>
//         )}

//         {resultats.length > 0 && (
//           <>
//             <h2>Récapitulatif par chauffeur</h2>
//             <div className="recap-container">
//               {regrouperParChauffeur(resultats).map((chauffeur, i) => (
//                 <div className="recap-card" key={i}>
//                   <h3>{chauffeur.nom} {chauffeur.prenom}</h3>
//                   <p>Infractions : {chauffeur.nombreInfractions}</p>
//                   <p>Montant total : {chauffeur.montantTotal} F</p>
//                   <button
//                     className="notify-button"
//                     onClick={() => notifierChauffeur(chauffeur)}
//                   >
//                     📩 Notifier
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </>
//         )}

//         {historique.length > 0 && (
//           <>
//             <h2>Historique des traitements</h2>
//             <table className="history-table">
//               <thead>
//                 <tr>
//                   <th>Mois</th>
//                   <th>Année</th>
//                   <th>Date de traitement</th>
//                   <th>Fichier</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {historique.map((h, i) => (
//                   <tr key={i}>
//                     <td>{h.mois}</td>
//                     <td>{h.annee}</td>
//                     <td>{new Date(h.dateTraitement).toLocaleString()}</td>
//                     <td>
//                       <a href={`/api/recouvrement/telecharger/${h.fileName}`} download>
//                         Télécharger
//                       </a>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </>
//         )}
//       </div>
//     </>
//   );
// };

// export default Recovery;
