import React from "react";

const DashComponent = () => {
  const style = {
    backgroundColor: "#d0d0d0",
    border: "1px solid #aaa",
    padding: "20px",
    textAlign: "center",
  };

  const titleStyle = {
    fontSize: "2em",
    fontWeight: "bold",
    textDecoration: "underline",
  };

  return (
    <div style={style}>
      <h1 style={titleStyle}>Dashboard</h1>
    </div>
  );
};

export default DashComponent;
