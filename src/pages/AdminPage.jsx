import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "../ui/adminpage.css"; 

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [justValidatedId, setJustValidatedId] = useState(null);


  const fetchUsers = () => {
    fetch("http://localhost:3000/api/users")
      .then((res) => res.json())
      .then(setUsers)
      .catch(() => toast.error("Erreur de chargement des utilisateurs"));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const validateUser = async (userId) => {
    try {
      const res = await fetch("http://localhost:3000/api/validate-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Utilisateur validé !");
      setJustValidatedId(userId);  // déclenche l'animation
      fetchUsers(); 
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, validated: true } : u
        )
      );
    } catch (err) {
      toast.error(`Erreur : ${err.message}`);
    }
  };
  

  return (
    <div className="admin-container">
      <h2>Validation des utilisateurs</h2>
      {users.length === 0 ? (
        <p>Aucun utilisateur en attente.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Statut</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} 
              className={user._id === justValidatedId ? "row-validated" : ""}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.validated ? "✅ Validé" : "⏳ En attente"}</td>
                <td>
                  {!user.validated && (
                    <button
                      className="validate-button"
                      onClick={() => validateUser(user._id)}
                    >
                      Valider
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPage;
