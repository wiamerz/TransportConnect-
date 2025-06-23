import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, User, Phone, Mail, Navigation, Menu, X, Plus, Pencil, Trash } from 'lucide-react';
import Sidebar from './Sidebar';
import toast from 'react-hot-toast';

function Annonces() {
 const [currentUser, setCurrentUser] = useState(null);
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [annonceId, setAnnonceId] = useState(null);
  const [userRole, setUserRole] = useState(null); 
  const [demandeModalOpen, setDemandeModalOpen] = useState(false);
  const [selectedAnnonce, setSelectedAnnonce] = useState(null);
  const [demandeForm, setDemandeForm] = useState({
    colis: [{
      title: '',
      dimensions: { length: '', width: '', height: '' },
      weight: '',
      type: ''
    }],
    date: ''
  });
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateModelOpen, setUpdateModelOpen] = useState(false);
  const [currentAnnoceId, setCurrentAnnoceId] = useState(null);
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


  useEffect(() => {
  const fetchCurrentUser = async () => {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    if (token) {
      try {
       
        const response = await fetch('http://localhost:3000/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const userData = await response.json();
        setCurrentUser(userData);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      }
    }
  };

  fetchCurrentUser();
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

  const modelUpdate = (annonce) => {
    setCurrentAnnoceId(annonce._id);
    setFormAnnonce({
      startPoint: annonce.startPoint,
      intermidiateSteps: annonce.intermidiateSteps ? annonce.intermidiateSteps.join(', ') : '',
      capacity: annonce.capacity.toString(),
      date: new Date(annonce.date).toISOString().slice(0, 16)
    });
    setUpdateModelOpen(true);
  };

  const handleUpdateAnnonce = async () => {
    if (!validateForm()) {
      toast.error("Veuillez remplir tous les champs requis");
      return;
    }

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      if (!token) {
        toast.error("Vous devez être connecté pour modifier une annonce");
        return;
      }

      const response = await fetch(`http://localhost:3000/api/annonces/${currentAnnoceId}`, {
        method: 'PUT',
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
        throw new Error(errorData.error || "Impossible de modifier l'annonce");
      }

      const result = await response.json();
      toast.success("Annonce modifiée avec succès!");
      
      setFormAnnonce({
        startPoint: '',
        intermidiateSteps: '',
        capacity: '',
        date: ''
      });
      setUpdateModelOpen(false);
      setCurrentAnnoceId(null);
      
      fetchAnnonces();
      
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error.message || "Erreur lors de la modification de l'annonce");
    }
  };

  const handleDeleteAnnonce = async (annoceId) => {
    // if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) {
    //   return;
    // }

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      if (!token) {
        toast.error("Vous devez être connecté pour supprimer une annonce");
        return;
      }

      const response = await fetch(`http://localhost:3000/api/annonces/${annoceId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Impossible de supprimer l'annonce");
      }

      const result = await response.json();
      toast.success("Annonce supprimée avec succès!");
      
      fetchAnnonces();
      
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error.message || "Erreur lors de la suppression de l'annonce");
    }
  };





  const handleDemandeSubmit = async () => {
  setIsSubmitting(true);
  setError('');

  // Validation (existing code remains the same)
  if (!demandeForm.date) {
    setError('La date est requise');
    setIsSubmitting(false);
    return;
  }

  try {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    if (!token || !currentUser) {
      throw new Error("Vous devez être connecté pour créer une demande");
    }

    const response = await fetch('http://localhost:3000/api/demandes/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        annonceId,
        utilisateurId: currentUser._id,      
        typeUtilisateur: "expediteur",      
        date: demandeForm.date,
        colis: demandeForm.colis.map(colis => ({
          ...colis,
          weight: parseFloat(colis.weight),
          dimensions: {
            length: parseFloat(colis.dimensions.length),
            width: parseFloat(colis.dimensions.width),
            height: parseFloat(colis.dimensions.height)
          }
        }))
      })
    });

    // Rest of the function remains the same
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erreur lors de la création de la demande");
    }

    toast.success("Demande créée avec succès!");
    setDemandeModalOpen(false);
    // Reset form...
  } catch (error) {
    console.error('Erreur:', error);
    toast.error(error.message);
  } finally {
    setIsSubmitting(false);
  }
};

const handleColisChange = (index, field, value) => {
  const updatedColis = [...demandeForm.colis];
  updatedColis[index][field] = value;
  setDemandeForm({ ...demandeForm, colis: updatedColis });
};

const handleDimensionsChange = (index, dimension, value) => {
  const updatedColis = [...demandeForm.colis];
  updatedColis[index].dimensions[dimension] = value;
  setDemandeForm({ ...demandeForm, colis: updatedColis });
};

const addColis = () => {
  setDemandeForm({
    ...demandeForm,
    colis: [
      ...demandeForm.colis,
      {
        title: '',
        dimensions: { length: '', width: '', height: '' },
        weight: '',
        type: ''
      }
    ]
  });
};

const removeColis = (index) => {
  const updatedColis = demandeForm.colis.filter((_, i) => i !== index);
  setDemandeForm({ ...demandeForm, colis: updatedColis });
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

          {/* Add Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50 p-4">
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

          {/* Update Modal */}
          {updateModelOpen && (
            <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl md:text-2xl font-bold" style={{ color: 'var(--color-pinko)' }}>
                    Modifier l'annonce
                  </h2>
                  <button
                    onClick={() => {
                      setUpdateModelOpen(false);
                      setCurrentAnnoceId(null);
                      setFormAnnonce({
                        startPoint: '',
                        intermidiateSteps: '',
                        capacity: '',
                        date: ''
                      });
                    }}
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

                  <div className="flex space-x-3">
                    <button
                      onClick={handleUpdateAnnonce}
                      className="flex-1 py-3 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: 'var(--color-pinko)' }}
                    >
                      Modifier
                    </button>
                    {/* <button
                      onClick={() => handleDeleteAnnonce(currentAnnoceId)}
                      className="flex-1 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                    >
                      cancel
                    </button> */}
                  </div>
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
                            {annonce.conducteur?.username || 'Utilisateur'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-xs bg-white/20 px-2 py-1 rounded-full">
                            Créé le {formatDateCreation(annonce.dateCreation)}
                          </div>
                          <button 
                            onClick={() => modelUpdate(annonce)}
                            className="p-1 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                            title="Modifier l'annonce"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                          <button 
                            onClick={() => handleDeleteAnnonce(annonce._id)}
                            className="p-1 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                            title="Supprimer l'annonce"
                          >
                            <Trash className="w-3 h-3" />
                          </button>
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
                            <span className="truncate">{annonce.conducteur?.email || 'Email non disponible'}</span>
                          </div>
                          {annonce.conducteur?.number && (
                            <div className="flex items-center space-x-2 text-xs md:text-sm text-gray-600">
                              <Phone className="w-3 h-3" />
                              <span>{annonce.conducteur.number}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Only show "Faire une demande" if current user is not the conducteur */}
                      {currentUser && currentUser._id !== annonce.conducteur?._id && (
                        <button
                          onClick={() => {
                            setAnnonceId(annonce._id);
                            setDemandeModalOpen(true);
                          }}
                          className="w-full mt-4 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                          style={{ backgroundColor: 'var(--color-pinko)' }}
                        >
                          Faire une demande
                        </button>
                      )}

                    {/* Demande Modal */}
                      {demandeModalOpen && (
                        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50 p-4">
                          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-4">
                              <h2 className="text-xl md:text-2xl font-bold" style={{ color: 'var(--color-pinko)' }}>
                                Créer une demande
                              </h2>
                              <button
                                onClick={() => setDemandeModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                <X className="w-6 h-6" />
                              </button>
                            </div>
                            
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date de livraison</label>
                                <input 
                                  type="datetime-local"
                                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm md:text-base"
                                  style={{ '--tw-ring-color': 'var(--color-pinko)' }}
                                  value={demandeForm.date}
                                  onChange={(e) => setDemandeForm({...demandeForm, date: e.target.value})}
                                />
                              </div>

                              {demandeForm.colis.map((colis, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4">
                                  <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-medium">Colis {index + 1}</h3>
                                    {index > 0 && (
                                      <button 
                                        onClick={() => removeColis(index)}
                                        className="text-red-500 hover:text-red-700 text-sm"
                                      >
                                        Supprimer
                                      </button>
                                    )}
                                  </div>

                                  <div className="space-y-3">
                                    <div>
                                      <input 
                                        type="text"
                                        placeholder="Titre du colis"
                                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                        value={colis.title}
                                        onChange={(e) => handleColisChange(index, 'title', e.target.value)}
                                      />
                                    </div>

                                    <div className="grid grid-cols-3 gap-2">
                                      <div>
                                        <input 
                                          type="number"
                                          placeholder="Longueur (cm)"
                                          className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                          value={colis.dimensions.length}
                                          onChange={(e) => handleDimensionsChange(index, 'length', e.target.value)}
                                        />
                                      </div>
                                      <div>
                                        <input 
                                          type="number"
                                          placeholder="Largeur (cm)"
                                          className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                          value={colis.dimensions.width}
                                          onChange={(e) => handleDimensionsChange(index, 'width', e.target.value)}
                                        />
                                      </div>
                                      <div>
                                        <input 
                                          type="number"
                                          placeholder="Hauteur (cm)"
                                          className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                          value={colis.dimensions.height}
                                          onChange={(e) => handleDimensionsChange(index, 'height', e.target.value)}
                                        />
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                      <div>
                                        <input 
                                          type="number"
                                          placeholder="Poids (kg)"
                                          className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                          value={colis.weight}
                                          onChange={(e) => handleColisChange(index, 'weight', e.target.value)}
                                        />
                                      </div>
                                      <div>
                                        <select
                                          className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                          value={colis.type}
                                          onChange={(e) => handleColisChange(index, 'type', e.target.value)}
                                        >
                                          <option value="">Type de colis</option>
                                          <option value="fragile">Fragile</option>
                                          <option value="normal">Normal</option>
                                          <option value="lourd">Lourd</option>
                                          <option value="grand">Grand volume</option>
                                        </select>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}

                              <button
                                onClick={addColis}
                                className="flex items-center justify-center w-full py-2 text-sm border border-dashed border-gray-300 rounded-lg hover:bg-gray-50"
                              >
                                <Plus className="w-4 h-4 mr-1" />
                                Ajouter un colis
                              </button>

                              {error && (
                                <div className="text-red-500 text-sm text-center">{error}</div>
                              )}

                              <button
                                onClick={handleDemandeSubmit}
                                disabled={isSubmitting}
                                className="w-full py-3 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-70"
                                style={{ backgroundColor: 'var(--color-pinko)' }}
                              >
                                {isSubmitting ? 'Envoi en cours...' : 'Créer la demande'}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
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
