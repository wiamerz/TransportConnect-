import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, Users, Mail, Phone, User } from 'lucide-react';
import Sidebar from './Sidebar';

const DashboardConducteur = () => {
  const [user, setUser] = useState(null);
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);

  

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const userData = JSON.parse(userString);
        setUser(userData);
        fetchAnnonces(userData._id);
      } catch (e) {
        console.error("Erreur parsing user:", e);
      }
    }
  }, []);

  const fetchAnnonces = async (userId) => {
    try {
      const res = await fetch(`http://localhost:3000/api/annonces/`);
      const data = await res.json();

      // sécuriser si data.annonces ou data directement
      const annoncesArray = Array.isArray(data) ? data : data.annonces;
      setAnnonces(annoncesArray.slice(-5).reverse());
    } catch (err) {
      console.error("Erreur de chargement des annonces:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex">
      <Sidebar />
      <div className="flex-1 p-6 space-y-8">
        {/* Infos conducteur */}
        {user && (
          <div className="bg-white rounded-xl shadow p-6">
            <h1 className="text-2xl   font-bold text-pinko mb-2">Bonjour {user.username} 👋</h1>
            <p className="text-gray-700 mb-1">
              Vous êtes connecté en tant que <span className="font-semibold">{user.role}</span> sur notre plateforme.
            </p>
            <p className="text-gray-600">Email : {user.email}</p>
            {user.number && <p className="text-gray-600">Téléphone : {user.number}</p>}
            <p className="text-gray-600 mt-2">
              En tant que conducteur, vous pouvez publier des trajets, gérer les demandes de transport et suivre votre activité.
            </p>
          </div>
        )}

        {/* Dernières annonces */}
        <div>
          <h2 className="text-xl font-bold  text-pinko mb-4">Vos dernières annonces</h2>

          {loading ? (
            <p className="text-gray-500">Chargement...</p>
          ) : annonces.length === 0 ? (
            <p className="text-gray-500">Vous n'avez publié aucune annonce récemment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {annonces.map((annonce) => (
                <div key={annonce._id} className="bg-white rounded-xl shadow p-4">
                  <div className="text-[#5E3A3A] font-semibold mb-1 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {annonce.startPoint}
                  </div>

                  {annonce.intermidiateSteps && annonce.intermidiateSteps.length > 0 && (
                    <div className="text-sm text-gray-600 mb-1">
                      Étapes : {annonce.intermidiateSteps.join(', ')}
                    </div>
                  )}

                  <div className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(annonce.date).toLocaleString('fr-FR')}
                  </div>

                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {annonce.capacity} place{annonce.capacity > 1 ? 's' : ''}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardConducteur;
