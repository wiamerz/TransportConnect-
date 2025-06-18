import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../provider/AuthProvider'; 
import { toast } from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const { setToken } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  const [apiError, setApiError] = useState('');

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: '', password: '' };

    if (!formData.email.trim()) {
      newErrors.email = 'Ce champ est obligatoire';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email format invalide';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Ce champ est obligatoire';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await axios.post('http://localhost:3000/api/trans/login', formData, {
          headers: { 'Content-Type': 'application/json' }
        });

        if (response.data.token) {
          const { token, user } = response.data;
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          setToken(token);

          toast.success('Connexion réussie', { duration: 2000 });

          setTimeout(() => {
            navigate('/home');
          }, 3000);
        }
      } catch (error) {
        setApiError(error.response?.data?.message || 'Erreur lors de la connexion');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-[#5E3A3A] text-center mb-6">
          Welcome back to StayFreight
        </h2>

        <form onSubmit={handleSubmit}>
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
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full mb-2 px-4 py-3 bg-[#F5EDED] border border-[#D8A7B1] rounded-md placeholder:text-[#5E3A3A] focus:outline-none"
          />
          {errors.password && <p className="text-sm text-red-500 mb-2">{errors.password}</p>}

          {apiError && <p className="text-sm text-red-600 mb-4">{apiError}</p>}

          <button type="submit" className="w-full py-3 bg-[#5E3A3A] text-white rounded-md hover:bg-[#D8A7B1] transition font-semibold">
            Log in
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-[#5E3A3A]">
          Don’t have an account?{' '}
          <a href="/registre" className="text-[#D8A7B1] underline hover:text-[#5E3A3A]">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
