// import { createContext, useContext, useEffect, useState } from "react";

// const DriversContext = createContext();

// export const DriversProvider = ({ children }) => {
//   const [drivers, setDrivers] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     async function fetchDrivers() {
//       try {
//         const response = await fetch("/api/drivers");
//         const data = await response.json();
//         setDrivers(data);
//       } catch (err) {
//         console.error("Erreur de chargement des chauffeurs :", err);
//         setError(err);
//       } finally {
//         setIsLoading(false);
//       }
//     }

//     fetchDrivers();
//   }, []);

//   return (
//     <DriversContext.Provider value={{ drivers, isLoading, error }}>
//       {children}
//     </DriversContext.Provider>
//   );
// };

// export const useDrivers = () => useContext(DriversContext);


import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getDrivers } from "../api"; // Import depuis le fichier api.js

const DriversContext = createContext();

export const DriversProvider = ({ children }) => {
  const [drivers, setDrivers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDrivers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getDrivers(); 
      setDrivers(data);
      setError(null);
    } catch (err) {
      console.error("Erreur de chargement des chauffeurs :", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  return (
    <DriversContext.Provider value={{ drivers, isLoading, error, refresh: fetchDrivers }}>
      {children}
    </DriversContext.Provider>
  );
};

export const useDrivers = () => useContext(DriversContext);
