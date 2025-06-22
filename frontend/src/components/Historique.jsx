import React, { useState, useEffect } from 'react';
import { Clock, Truck, Package, CheckCircle, AlertCircle } from 'lucide-react';
import Sidebar from './Sidebar';

function Historique() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error("Vous devez être connecté pour voir votre historique");
      }
      
      const response = await fetch('http://localhost:3000/api/historique/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expirée. Veuillez vous reconnecter.');
        } else if (response.status === 403) {
          throw new Error('Accès non autorisé.');
        } else {
          throw new Error('Erreur lors du chargement de l\'historique');
        }
      }
      
      const data = await response.json();
      setHistory(data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching historique:', err);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'trajet_cree':
        return <Truck className="w-5 h-5" style={{ color: '#D8A7B1' }} />;
      case 'demande_envoyee':
        return <Package className="w-5 h-5" style={{ color: '#5E3A3A' }} />;
      case 'trajet_accepte':
        return <CheckCircle className="w-5 h-5" style={{ color: '#D8A7B1' }} />;
      case 'livraison_terminee':
        return <CheckCircle className="w-5 h-5" style={{ color: '#5E3A3A' }} />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getActionLabel = (action) => {
    switch (action) {
      case 'trajet_cree':
        return 'Trajet créé';
      case 'demande_envoyee':
        return 'Demande envoyée';
      case 'trajet_accepte':
        return 'Trajet accepté';
      case 'livraison_terminee':
        return 'Livraison terminée';
      default:
        return action;
    }
  };

  const getActionDescription = (item) => {
    switch (item.action) {
      case 'trajet_cree':
        return `Vous avez créé un nouveau trajet en tant que conducteur`;
      case 'demande_envoyee':
        return `Vous avez envoyé une demande de livraison`;
      case 'trajet_accepte':
        return `Votre ${item.typeUtilisateur === 'conducteur' ? 'trajet a été accepté' : 'demande a été acceptée'}`;
      case 'livraison_terminee':
        return `Livraison terminée avec succès`;
      default:
        return item.action;
    }
  };

  const getUserTypeLabel = (type) => {
    return type === 'conducteur' ? 'Conducteur' : 'Expéditeur';
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Date invalide';
      }
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Date invalide';
    }
  };

  const filteredHistory = history.filter(item => {
    if (filter === 'all') return true;
    return item.typeUtilisateur === filter;
  });

  const handleRetry = () => {
    fetchHistory();
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#FAF9F6' }}>
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#D8A7B1' }}></div>
                <span className="ml-3 text-gray-600">Chargement de votre historique...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#FAF9F6' }}>
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2" style={{ color: '#5E3A3A' }}>Erreur</h2>
                <p className="text-gray-600 mb-4">{error}</p>
                <button 
                  onClick={handleRetry}
                  className="text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#D8A7B1' }}
                >
                  Réessayer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#FAF9F6' }}>
      <Sidebar />
      <div className="flex-1 min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#5E3A3A' }}>Historique</h1>
            <p className="text-gray-600">Consultez l'historique de vos activités</p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'all'
                    ? 'text-white border'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={filter === 'all' ? { 
                  backgroundColor: '#D8A7B1', 
                  borderColor: '#5E3A3A' 
                } : {}}
              >
                Toutes les activités
              </button>
              <button
                onClick={() => setFilter('conducteur')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'conducteur'
                    ? 'text-white border'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={filter === 'conducteur' ? { 
                  backgroundColor: '#D8A7B1', 
                  borderColor: '#5E3A3A' 
                } : {}}
              >
                En tant que conducteur
              </button>
              <button
                onClick={() => setFilter('expediteur')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'expediteur'
                    ? 'text-white border'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={filter === 'expediteur' ? { 
                  backgroundColor: '#D8A7B1', 
                  borderColor: '#5E3A3A' 
                } : {}}
              >
                En tant qu'expéditeur
              </button>
            </div>
          </div>

          {/* History List */}
          <div className="bg-white rounded-lg shadow-sm">
            {filteredHistory.length === 0 ? (
              <div className="p-8 text-center">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2" style={{ color: '#5E3A3A' }}>Aucun historique</h3>
                <p className="text-gray-600">
                  {filter === 'all' 
                    ? "Vous n'avez encore aucune activité." 
                    : `Aucune activité en tant que ${filter}.`}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredHistory.map((item) => (
                  <div key={item._id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 mt-1">
                          {getActionIcon(item.action)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-lg font-medium" style={{ color: '#5E3A3A' }}>
                              {getActionLabel(item.action)}
                            </h3>
                            <span 
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                item.typeUtilisateur === 'conducteur'
                                  ? 'text-white'
                                  : 'text-white'
                              }`}
                              style={{ 
                                backgroundColor: item.typeUtilisateur === 'conducteur' 
                                  ? '#D8A7B1' 
                                  : '#5E3A3A' 
                              }}
                            >
                              {getUserTypeLabel(item.typeUtilisateur)}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-2">
                            {getActionDescription(item)}
                          </p>
                          <div className="text-sm text-gray-500">
                            {formatDate(item.dateAction || item.date)}
                          </div>
                          {(item.annonceId || item.demandeId) && (
                            <div className="mt-2 text-xs text-gray-400">
                              {item.annonceId && `Annonce: ${item.annonceId}`}
                              {item.annonceId && item.demandeId && ' • '}
                              {item.demandeId && `Demande: ${item.demandeId}`}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {filteredHistory.length > 0 && (
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {filteredHistory.length} activité{filteredHistory.length > 1 ? 's' : ''} trouvée{filteredHistory.length > 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Historique;