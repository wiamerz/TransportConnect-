import React, { useState } from 'react';
import { useAuth } from '../provider/AuthProvider';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Register = () => {
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    number: '',
    role: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const phoneRegex = /^\+?[0-9]{10,15}$/;

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.username.trim()) {
      newErrors.username = 'Ce champ est obligatoire';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Ce champ est obligatoire';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
      isValid = false;
    }

    if (!formData.number.trim()) {
      newErrors.number = 'Ce champ est obligatoire';
      isValid = false;
    } else if (!phoneRegex.test(formData.number)) {
      newErrors.number = 'Numéro de téléphone invalide';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Ce champ est obligatoire';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Au moins 6 caractères requis';
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Ce champ est obligatoire';
      isValid = false;
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
      isValid = false;
    }

    if (!formData.role) {
      newErrors.role = 'Veuillez choisir un rôle';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleSelect = (role) => {
    setFormData((prev) => ({ ...prev, role }));
    setErrors((prev) => ({ ...prev, role: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (validateForm()) {
      setLoading(true);

      try {
        const response = await axios.post('http://localhost:3000/api/trans/register', formData, {
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.status === 201) {
          toast.success('Inscription réussie ! Vérifiez votre email.', { duration: 3000 });

          setTimeout(() => {
            navigate('/login', {
              state: { email: formData.email },
              search: `?email=${encodeURIComponent(formData.email)}`
            });
          }, 1000);
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Erreur lors de l\'inscription';
        toast.error(errorMessage);
        setErrors({ ...errors, general: errorMessage });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-[#5E3A3A] text-center mb-6">
          Get started with StayFreight
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Nom complet"
            className="w-full mb-2 px-4 py-3 bg-[#F5EDED] border border-[#D8A7B1] rounded-md placeholder:text-[#5E3A3A] focus:outline-none"
          />
          {errors.username && <p className="text-sm text-red-500 mb-2">{errors.username}</p>}

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full mb-2 px-4 py-3 bg-[#F5EDED] border border-[#D8A7B1] rounded-md placeholder:text-[#5E3A3A] focus:outline-none"
          />
          {errors.email && <p className="text-sm text-red-500 mb-2">{errors.email}</p>}

          <input
            type="text"
            name="number"
            value={formData.number}
            onChange={handleChange}
            placeholder="Téléphone"
            className="w-full mb-2 px-4 py-3 bg-[#F5EDED] border border-[#D8A7B1] rounded-md placeholder:text-[#5E3A3A] focus:outline-none"
          />
          {errors.number && <p className="text-sm text-red-500 mb-2">{errors.number}</p>}

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Mot de passe"
            className="w-full mb-2 px-4 py-3 bg-[#F5EDED] border border-[#D8A7B1] rounded-md placeholder:text-[#5E3A3A] focus:outline-none"
          />
          {errors.password && <p className="text-sm text-red-500 mb-2">{errors.password}</p>}

          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirmer mot de passe"
            className="w-full mb-2 px-4 py-3 bg-[#F5EDED] border border-[#D8A7B1] rounded-md placeholder:text-[#5E3A3A] focus:outline-none"
          />
          {errors.confirmPassword && <p className="text-sm text-red-500 mb-2">{errors.confirmPassword}</p>}

          <div className="flex justify-between mb-2">
            {['conducteur', 'expediteur', 'admin'].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleRoleSelect(item)}
                className={`w-full mx-1 py-2 rounded-md border text-sm transition ${
                  formData.role === item
                    ? 'bg-[#D8A7B1] text-white border-[#D8A7B1]'
                    : 'bg-white text-[#5E3A3A] border-[#D8A7B1] hover:bg-[#f9e3e8]'
                }`}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>
          {errors.role && <p className="text-sm text-red-500 mb-4">{errors.role}</p>}

          {errors.general && <p className="text-sm text-red-500 mb-4">{errors.general}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#D8A7B1] text-white rounded-md hover:bg-[#5E3A3A] transition font-semibold"
          >
            {loading ? 'Création en cours...' : 'Sign up'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-[#5E3A3A]">
          Vous avez déjà un compte ?{' '}
          <a href="/login" className="text-[#D8A7B1] underline hover:text-[#5E3A3A]">
            Se connecter
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
