import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, User, Phone, Mail, Navigation, Menu, X, Plus } from 'lucide-react';
import Sidebar from './Sidebar';
import toast from 'react-hot-toast';

function Annonces() {
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formAnnonce, setFormAnnonce] = useState({
    startPoint: '',
    intermidiateSteps: '',
    capacity: '',
    date: ''
  });

  useEffect(() => {
    fetchAnnonces();
  }, []);

  const fetchAnnonces = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:3000/api/annonces/');
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des annonces');
      }
      
      const data = await response.json();
      setAnnonces(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching annonces:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formAnnonce.startPoint.trim()) {
      errors.startPoint = "Ce champ est requis";
    }
    if (!formAnnonce.capacity || formAnnonce.capacity < 1) {
      errors.capacity = "Ce champ est requis";
    }
    if (!formAnnonce.date) {
      errors.date = "Ce champ est requis";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormAnnonce(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };


const handleAddAnnonce = async () => {
  if (!validateForm()) {
    toast.error("Veuillez remplir tous les champs requis");
    return;
  }

  try {
   
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    
    if (!token) {
      toast.error("Vous devez être connecté pour créer une annonce");
      return;
    }

    const response = await fetch('http://localhost:3000/api/annonces/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({
        startPoint: formAnnonce.startPoint,
        intermidiateSteps: formAnnonce.intermidiateSteps.split(',').map(step => step.trim()).filter(step => step),
        capacity: parseInt(formAnnonce.capacity),
        date: formAnnonce.date
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Impossible d'ajouter l'annonce");
    }

    const result = await response.json();
    toast.success("Annonce ajoutée avec succès!");
    
   
    setFormAnnonce({
      startPoint: '',
      intermidiateSteps: '',
      capacity: '',
      date: ''
    });
    setIsModalOpen(false);
    
    
    fetchAnnonces();
    
  } catch (error) {
    console.error('Erreur:', error);
    toast.error(error.message || "Erreur lors de l'ajout de l'annonce");
  }
};

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateCreation = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Loading Page
  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--color-pinko-10)' }}>
        <div className="flex">
          <Sidebar />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent mx-auto mb-4" 
                   style={{ borderColor: 'var(--color-pinko)' }}></div>
              <p style={{ color: 'var(--color-pinko)' }}>Chargement des annonces...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error page
  if (error) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--color-pinko-10)' }}>
        <div className="flex">
          <Sidebar />
          <div className="flex-1 p-4 md:p-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <div className="text-red-600 text-xl mb-2"> Erreur</div>
              <p className="text-red-800 mb-4">{error}</p>
              <button 
                onClick={fetchAnnonces}
                className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
                style={{ backgroundColor: 'var(--color-pinko)' }}
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-pinko-10)' }}>
      <div className="flex">
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="bg-white shadow-lg">
            <div className="px-4 md:px-6 py-6 md:py-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
                    {/* <Menu className="w-6 h-6" style={{ color: 'var(--color-pinko)' }} /> */}
                  </button>
                  <div>
                    <h1 className="text-2xl md:text-4xl font-bold mb-2" style={{ color: 'var(--color-pinko)' }}>
                      Toutes les Annonces
                    </h1>
                    <p className="text-gray-600 text-sm md:text-base">
                      Découvrez tous les trajets disponibles
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between md:justify-end space-x-4 md:space-x-6">
                  <div className="text-center md:text-right">
                    <div className="text-xl md:text-2xl font-bold" style={{ color: 'var(--color-ghos)' }}>
                      {annonces.length}
                    </div>
                    <div className="text-xs md:text-sm text-gray-500">
                      annonce{annonces.length > 1 ? 's' : ''} disponible{annonces.length > 1 ? 's' : ''}
                    </div>
                  </div>

                  {/* Add Button */}
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center w-12 h-12 rounded-full text-white hover:opacity-90 shadow-lg transition-opacity"
                    style={{ backgroundColor: 'var(--color-pinko)' }}
                  >
                    <Plus className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Add carte */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl md:text-2xl font-bold" style={{ color: 'var(--color-pinko)' }}>
                    Ajouter une annonce
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <input 
                      type="text" 
                      placeholder="Point de départ"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm md:text-base"
                      style={{ '--tw-ring-color': 'var(--color-pinko)' }}
                      value={formAnnonce.startPoint}
                      onChange={(e) => handleInputChange('startPoint', e.target.value)}
                    />
                    {formErrors.startPoint && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.startPoint}</p>
                    )}
                  </div>

                  <div>
                    <input 
                      type="text" 
                      placeholder="Étapes intermédiaires (séparées par des virgules)"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm md:text-base"
                      style={{ '--tw-ring-color': 'var(--color-pinko)' }}
                      value={formAnnonce.intermidiateSteps}
                      onChange={(e) => handleInputChange('intermidiateSteps', e.target.value)}
                    />
                  </div>

                  <div>
                    <input 
                      type="number" 
                      placeholder="Capacité (nombre de places)"
                      min="1"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm md:text-base"
                      style={{ '--tw-ring-color': 'var(--color-pinko)' }}
                      value={formAnnonce.capacity}
                      onChange={(e) => handleInputChange('capacity', e.target.value)}
                    />
                    {formErrors.capacity && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.capacity}</p>
                    )}
                  </div>

                  <div>
                    <input 
                      type="datetime-local"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm md:text-base"
                      style={{ '--tw-ring-color': 'var(--color-pinko)' }}
                      value={formAnnonce.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                    />
                    {formErrors.date && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.date}</p>
                    )}
                  </div>

                  <button
                    onClick={handleAddAnnonce}
                    className="w-full py-3 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: 'var(--color-pinko)' }}
                  >
                    Ajouter l'annonce
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-4 md:p-6">
            {annonces.length === 0 ? (
              <div className="text-center py-12 md:py-20">
                <div className="text-4xl md:text-6xl mb-4">🚗</div>
                <h3 className="text-lg md:text-xl font-semibold mb-2" style={{ color: 'var(--color-pinko)' }}>
                  Aucune annonce disponible
                </h3>
                <p className="text-gray-500 text-sm md:text-base">
                  Il n'y a pas d'annonces de trajet pour le moment.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {annonces.map((annonce) => (
                  <div
                    key={annonce._id}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    {/* Card Header */}
                    <div className="text-white p-4 md:p-6 rounded-t-xl" 
                         style={{ background: `linear-gradient(135deg, var(--color-pinko) 0%, var(--color-ghos) 100%)` }}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 md:w-5 md:h-5" />
                          <span className="font-semibold text-sm md:text-base">
                            {annonce.conducteur.username}
                          </span>
                        </div>
                        <div className="text-xs bg-white/20 px-2 py-1 rounded-full">
                          Créé le {formatDateCreation(annonce.dateCreation)}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-2">
                        <MapPin className="w-4 h-4" />
                        <span className="font-medium text-xs md:text-sm">Point de départ</span>
                      </div>
                      <div className="text-base md:text-lg font-bold truncate">
                        {annonce.startPoint}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 md:p-6">
                      {/* Intermediate Steps */}
                      {annonce.intermidiateSteps && annonce.intermidiateSteps.length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <Navigation className="w-4 h-4" style={{ color: 'var(--color-ghos)' }} />
                            <span className="text-xs md:text-sm font-medium" style={{ color: 'var(--color-pinko)' }}>
                              Étapes intermédiaires
                            </span>
                          </div>
                          <div className="space-y-1">
                            {annonce.intermidiateSteps.map((step, index) => (
                              <div 
                                key={index}
                                className="text-xs md:text-sm text-gray-600 pl-4 md:pl-6 border-l-2"
                                style={{ borderColor: 'var(--color-ghos)' }}
                              >
                                {step}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Trip Details */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-2 md:p-3 rounded-lg" 
                             style={{ backgroundColor: 'var(--color-pinko-10)' }}>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" style={{ color: 'var(--color-ghos)' }} />
                            <span className="text-xs md:text-sm font-medium">Date</span>
                          </div>
                          <span className="text-xs md:text-sm font-medium" style={{ color: 'var(--color-pinko)' }}>
                            {formatDate(annonce.date)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-2 md:p-3 rounded-lg" 
                             style={{ backgroundColor: 'var(--color-pinko-10)' }}>
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4" style={{ color: 'var(--color-ghos)' }} />
                            <span className="text-xs md:text-sm font-medium">Places</span>
                          </div>
                          <span className="text-xs md:text-sm font-bold" style={{ color: 'var(--color-pinko)' }}>
                            {annonce.capacity} place{annonce.capacity > 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="text-xs text-gray-500 mb-2">Contact du conducteur</div>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2 text-xs md:text-sm text-gray-600">
                            <Mail className="w-3 h-3" />
                            <span className="truncate">{annonce.conducteur.email}</span>
                          </div>
                          {annonce.conducteur.number && (
                            <div className="flex items-center space-x-2 text-xs md:text-sm text-gray-600">
                              <Phone className="w-3 h-3" />
                              <span>{annonce.conducteur.number}</span>
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
        </div>
      </div>
    </div>
  );
}

export default Annonces;