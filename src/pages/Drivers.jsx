// import React, { useEffect, useState } from "react";
// import DriversList from "../components/forDrivers/DriversList";
// import DriversCard from "../components/forDrivers/DriversCards";

// const Drivers = () => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [drivers, setDrivers] = useState([]);
//   const [selectedDriver, setSelectedDriver] = useState(null);

//   useEffect(() => {
//     async function fetchDrivers() {
//       setIsLoading(true);
//       try {
//         const response = await fetch("/api/drivers");
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const data = await response.json();
//         setDrivers(data);
//       } catch (e) {
//         setError(e);
//       } finally {
//         setIsLoading(false);
//       }
//     }
//     fetchDrivers();
//   }, []);

//   if (isLoading) {
//     return <p>Chargement des pilotes...</p>;
//   }

//   if (error) {
//     return <p>Erreur : {error.message}</p>;
//   }

//   const handleDriverClick = (driver) => {
//     setSelectedDriver(driver);
//   };

//   const closeCard = () => {
//     setSelectedDriver(null);
//   };

//   return (
//     <div>
//       <ul>
//         <div>
//           <DriversList drivers={drivers} onDriverClick={handleDriverClick} />
//           {selectedDriver && (
//             <DriversCard driver={selectedDriver} onClose={closeCard} />
//           )}
//           {/* <DriversList drivers={drivers} onDriverClick={setSelectedDriver} />
//       {selectedDriver && <DriversCard driver ={selectedDriver} onClose={() => setSelectedDriver(null)} />} */}
//         </div>
//       </ul>
//     </div>
//   );
// };

// export default Drivers;

import React, { useState } from "react";
import DriversList from "../components/forDrivers/DriversList";
import DriversCard from "../components/forDrivers/DriversCards";
import { useDrivers } from "../context/DriversContext";

const Drivers = () => {
  const { drivers, isLoading, error , refresh } = useDrivers();
  const [selectedDriver, setSelectedDriver] = useState(null);

  const handleDriverDeleted = () => {
    setSelectedDriver(null);
    refresh(); 
  };

  if (isLoading) return <p>Chargement des chauffeurs...</p>;
  if (error) return <p>Erreur : {error.message}</p>;

  return (
    <div>
      <DriversList drivers={drivers} onDriverClick={setSelectedDriver} />
      {selectedDriver && (
        <DriversCard
          driver={selectedDriver}
          isOpen={!!selectedDriver}
          onClose={() => setSelectedDriver(null)}
          onDeleted={handleDriverDeleted}
        />
      )}
    </div>
  );
};

export default Drivers;
