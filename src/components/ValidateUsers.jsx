import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ValidateUsers = () => {
  const [users, setUsers] = useState([]);

  const fetchPendingUsers = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/pending-users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      toast.error("Erreur lors du chargement des utilisateurs");
    }
  };

  const validateUser = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/validate-user/${id}`, {
        method: "POST",
      });
      const data = await res.json();
      toast.success(data.message);
      fetchPendingUsers(); // refresh
    } catch (err) {
      toast.error("Erreur lors de la validation");
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Utilisateurs à valider</h2>
      {users.length === 0 ? (
        <p>Aucun utilisateur en attente.</p>
      ) : (
        <ul>
          {users.map((u) => (
            <li key={u._id} style={{ marginBottom: "10px" }}>
              {u.username} ({u.email}) - <strong>{u.role}</strong>
              <button onClick={() => validateUser(u._id)} style={{ marginLeft: "10px" }}>
                Valider
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ValidateUsers;
