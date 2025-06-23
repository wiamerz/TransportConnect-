import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, Users, Mail, Phone, User, Package, Truck } from 'lucide-react';
import Sidebar from './Sidebar';

const DashboardConducteur = () => {
  const [user, setUser] = useState(null);
  const [annonces, setAnnonces] = useState([]);
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const userData = JSON.parse(userString);
        setUser(userData);
        
        if (userData.role === 'conducteur') {
          fetchAnnonces();
        } else if (userData.role === 'expediteur') {
          fetchDemandes();
        }
      } catch (e) {
        console.error("Erreur parsing user:", e);
        setLoading(false);
      }
    }
  }, []);

  const fetchAnnonces = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/annonces/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      
      const annoncesArray = Array.isArray(data) ? data : data.annonces || [];
      setAnnonces(annoncesArray.slice(-5).reverse());
    } catch (err) {
      console.error("Erreur de chargement des annonces:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDemandes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/demandes/shipper/my-demands`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      
      const demandesArray = Array.isArray(data) ? data : data.demandes || [];
      setDemandes(demandesArray.slice(-5).reverse());
    } catch (err) {
      console.error("Erreur de chargement des demandes:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'en attente':
        return 'text-yellow-600 bg-yellow-100';
      case 'acceptée':
        return 'text-green-600 bg-green-100';
      case 'refusée':
        return 'text-red-600 bg-red-100';
      case 'livrée':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getRoleDescription = (role) => {
    if (role === 'conducteur') {
      return "En tant que conducteur, vous pouvez publier des trajets, gérer les demandes de transport et suivre votre activité.";
    } else if (role === 'expediteur') {
      return "En tant qu'expéditeur, vous pouvez rechercher des trajets, envoyer des demandes de transport et suivre vos colis.";
    }
    return "";
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex">
      <Sidebar />
      <div className="flex-1 p-6 space-y-8">
        {/* Infos utilisateur */}
        {user && (
          <div className="bg-white rounded-xl shadow p-6">
            <h1 className="text-2xl font-bold text-ghos mb-2">
              Bonjour {user.username} 👋
            </h1>
            <p className="text-gray-700 mb-1">
              Vous êtes connecté en tant que <span className="font-semibold">{user.role}</span> sur notre plateforme.
            </p>
            <p className="text-gray-600">Email : {user.email}</p>
            {user.number && <p className="text-gray-600">Téléphone : {user.number}</p>}
            <p className="text-gray-600 mt-2">
              {getRoleDescription(user.role)}
            </p>
          </div>
        )}

        {/* Contenu selon le rôle */}
        {user?.role === 'conducteur' && (
          <div>
            <h2 className="text-xl font-bold text-ghos mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Vos dernières annonces
            </h2>
            
            {loading ? (
              <p className="text-gray-500">Chargement...</p>
            ) : annonces.length === 0 ? (
              <div className="bg-white rounded-xl shadow p-6 text-center">
                <Truck className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">Vous n'avez publié aucune annonce récemment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {annonces.map((annonce) => (
                  <div key={annonce._id} className="bg-white rounded-xl shadow p-4 hover:shadow-md transition-shadow">
                    <div className="text-[#5E3A3A] font-semibold mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {annonce.startPoint}
                    </div>
                    
                    {annonce.intermidiateSteps && annonce.intermidiateSteps.length > 0 && (
                      <div className="text-sm text-gray-600 mb-2">
                        Étapes : {annonce.intermidiateSteps.join(', ')}
                      </div>
                    )}
                    
                    <div className="text-sm text-gray-600 flex items-center gap-2 mb-2">
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
        )}

        {user?.role === 'expediteur' && (
          <div>
            <h2 className="text-xl font-bold text-[#D4A574] mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Vos dernières demandes
            </h2>
            
            {loading ? (
              <p className="text-gray-500">Chargement...</p>
            ) : demandes.length === 0 ? (
              <div className="bg-white rounded-xl shadow p-6 text-center">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">Vous n'avez envoyé aucune demande récemment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {demandes.map((demande) => (
                  <div key={demande._id} className="bg-white rounded-xl shadow p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-[#5E3A3A] font-semibold flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {demande.annonceId?.startPoint || 'Trajet'}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(demande.statut)}`}>
                        {demande.statut}
                      </span>
                    </div>
                    
                    {demande.annonceId?.intermidiateSteps && demande.annonceId.intermidiateSteps.length > 0 && (
                      <div className="text-sm text-gray-600 mb-2">
                        Étapes : {demande.annonceId.intermidiateSteps.join(', ')}
                      </div>
                    )}
                    
                    <div className="text-sm text-gray-600 flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(demande.date).toLocaleString('fr-FR')}
                    </div>
                    
                    <div className="text-sm text-gray-600 flex items-center gap-2 mb-2">
                      <Package className="w-4 h-4" />
                      {demande.colis?.length || 0} colis
                    </div>
                    
                    {demande.annonceId?.conducteur && (
                      <div className="text-sm text-gray-600 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Conducteur : {demande.annonceId.conducteur.username}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardConducteur;