import React from 'react';
import Stats from '../components/forHome/Stats';
import Rank from '../components/forHome/Rank';
import Dashboard from '../components/forHome/DashComponent';
import VehicleRisk from '../components/forHome/VehiculesRisk';
import ContraventionsParType from '../components/ContraventionsParType';
import '../ui/Home.css'; 

const Home = () => {
  return (
    <div className="home-container content">
      <div className="home-layout">
        <div className="home-left">
          <Stats />
        </div>
        <div className="home-right">
        <VehicleRisk/>
        <ContraventionsParType/>
          <Rank />
        </div>
      </div>
    </div>
  );
};

export default Home;
