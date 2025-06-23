import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../provider/AuthProvider';
import { toast } from 'react-hot-toast';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// yup schema
const schema = yup.object().shape({
  email: yup .string() .required('Ce champ est obligatoire') .email('Email format invalide'),
  password: yup.string().required('Ce champ est obligatoire').min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors },} = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setApiError('');

    try {
      const response = await axios.post('http://localhost:3000/api/trans/login', data, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.data.token) {
        const { token, user } = response.data;

        localStorage.setItem('user', JSON.stringify(user));
        login(token);

        toast.success('Connexion réussie', { duration: 2000 });
        navigate('/ConducteurDashbord');
      }
    } catch (error) {
      setApiError(error.response?.data?.message || 'Erreur lors de la connexion');
      toast.error('Erreur lors de la connexion');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-[#5E3A3A] text-center mb-6">
          Welcome back to StayFreight
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="email"
            {...register('email')}
            placeholder="Email"
            disabled={isLoading}
            className="w-full mb-2 px-4 py-3 bg-[#F5EDED] border border-[#D8A7B1] rounded-md placeholder:text-pinko focus:outline-none disabled:opacity-50"
          />
          {errors.email && <p className="text-sm text-red-500 mb-2">{errors.email.message}</p>}

          <input
            type="password"
            {...register('password')}
            placeholder="Password"
            disabled={isLoading}
            className="w-full mb-2 px-4 py-3 bg-[#F5EDED] border border-[#D8A7B1] rounded-md placeholder:text-pinko focus:outline-none disabled:opacity-50"
          />
          {errors.password && (
            <p className="text-sm text-red-500 mb-2">{errors.password.message}</p>
          )}

          {apiError && <p className="text-sm text-red-600 mb-4">{apiError}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#D8A7B1] text-white rounded-md hover:bg-pinko transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Connexion...' : 'Log in'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-pinko">
          Don't have an account?{' '}
          <a href="/registre" className="text-[#D8A7B1] underline hover:text-pinko">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
