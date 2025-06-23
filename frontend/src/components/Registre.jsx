import React, { useEffect, useState } from 'react';
import { useAuth } from '../provider/AuthProvider';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = yup.object().shape({
  username: yup.string().required('Ce champ est obligatoire'),
  email: yup.string().required('Ce champ est obligatoire').email('Format d\'email invalide'),
  number: yup.string().required('Ce champ est obligatoire').matches(/^\+?[0-9]{10,15}$/, 'Numéro de téléphone invalide'),
  password: yup.string().required('Ce champ est obligatoire').min(6, 'Au moins 6 caractères requis'),
  confirmPassword: yup.string().required('Ce champ est obligatoire').oneOf([yup.ref('password'), null], 'Les mots de passe ne correspondent pas'),
  role: yup.string().required('Veuillez choisir un rôle'),
});

const Register = () => {
  const { setToken } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const selectedRole = watch('role');


  useEffect(() => {
    register('role');
  }, [register]);

  const onSubmit = async (data) => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/api/trans/register', data, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 201) {
        toast.success('Inscription réussie ! Vérifiez votre email.');
        navigate('/login', {
          state: { email: data.email },
          search: `?email=${encodeURIComponent(data.email)}`
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erreur lors de l\'inscription';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-[#5E3A3A] text-center mb-6">
          Get started with StayFreight
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <input 
          {...register('username')} 
          placeholder="Nom complet" 
          className="input-style" />
          {errors.username && <p className="text-sm text-red-500 mb-2">{errors.username.message}</p>}

          <input 
          {...register('email')} 
          placeholder="Email" 
          className="input-style" />
          {errors.email && <p className="text-sm text-red-500 mb-2">{errors.email.message}</p>}

          <input 
          {...register('number')} 
          placeholder="Téléphone" 
          className="input-style" />
          {errors.number && <p className="text-sm text-red-500 mb-2">{errors.number.message}</p>}

          <input 
          type="password" {...register('password')} 
          placeholder="Mot de passe" 
          className="input-style" />
          {errors.password && <p className="text-sm text-red-500 mb-2">{errors.password.message}</p>}

          <input 
          type="password" {...register('confirmPassword')} 
          placeholder="Confirmer mot de passe" 
          className="input-style" />
          {errors.confirmPassword && <p className="text-sm text-red-500 mb-2">{errors.confirmPassword.message}</p>}

          <div className="flex justify-between mb-2">
            {['conducteur', 'expediteur'].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setValue('role', item)}
                className={`w-full mx-1 py-2 rounded-md border text-sm transition ${
                  selectedRole === item
                    ? 'bg-[#D8A7B1] text-white border-[#D8A7B1]'
                    : 'bg-white text-[#5E3A3A] border-[#D8A7B1] hover:bg-[#f9e3e8]'
                }`}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>
          {errors.role && <p className="text-sm text-red-500 mb-4">{errors.role.message}</p>}

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
          <a href="/login" className="text-[#D8A7B1] underline hover:text-[#5E3A3A]">Se connecter</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
