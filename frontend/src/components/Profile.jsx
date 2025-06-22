import { useAuth } from "../provider/AuthProvider";
import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import "../index.css";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  Pencil, User, Mail, Phone, ChevronRight,
  Briefcase, Bell, LogOut, Settings,
  
} from 'lucide-react';
import profile from '../assets/profile.jpg';
import Sidebar from "./Sidebar";

const Profile = () => {
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', number: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const userData = JSON.parse(userString);
        setUser(userData);
        setFormData({
          username: userData.username || '',
          email: userData.email || '',
          number: userData.number || ''
        });
      } catch (e) {
        console.error("Erreur lors de la récupération des données utilisateur:", e);
        toast.error("Erreur lors de la récupération des données utilisateur");
      }
    } else {
      toast.error("Utilisateur non connecté");
      navigate('/login');
    }
    setLoading(false);
  }, [navigate]);

  const profileActions = [
    {
      label: "Settings",
      description: "Account preferences",
      icon: Settings,
      color: "text-[#5E3A3A]",
    },
    {
      label: "Notifications",
      description: "Manage alerts",
      icon: Bell,
      color: "text-[#5E3A3A]",
    },
    {
      label: "Logout",
      description: "Sign out of your account",
      icon: LogOut,
      color: "text-red-600",
      danger: true,
    },
  ];

  const handleActionClick = (label) => {
    if (label === 'Logout') {
      logout();
      toast.success("Déconnexion réussie");
      navigate('/login');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await axios.put('http://localhost:3000/api/trans/edit-profile',
        {
          ...formData,
          userId: user.id
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
        
      if (response.status === 200) {
        const updatedUser = { ...user, ...formData };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        toast.success("Profil mis à jour avec succès");
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      const errorMessage = error.response?.data?.message || "Une erreur est survenue";
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user.username || '',
      email: user.email || '',
      number: user.number || ''
    });
    setErrors({});
    setIsEditing(false);
  };

  if (loading || !user) return <div className="text-center py-20 text-gray-600">Chargement...</div>;

  return (
    <>
    {/* <Sidebar/> */}
    <div className="min-h-screen bg-[#FAF9F6]">
      
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#5E3A3A]">Profile</h1>
              <p className="text-gray-600 mt-1">Manage your account information and preferences</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
              <div className="relative">
                <img
                  src={profile}
                  alt="Cover"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#D8A7B1] via-[#c49aa6] to-[#b8949e] opacity-80"></div>
                <div className="relative p-8">
                  <div className="flex items-start gap-6">
                    <div className="relative group">
                      <div className="w-28 h-28 rounded-2xl bg-[#5E3A3A] flex items-center justify-center text-white text-3xl font-bold shadow-2xl ring-4 ring-white/20">
                        {user.username?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                    </div>
                    <div className="flex-1 text-white">
                      <h2 className="text-3xl font-bold">{user.username}</h2>
                      <p className="text-white/80 text-lg">{user.role}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <h3 className="text-xl font-semibold text-[#5E3A3A] mb-6">Personal Information</h3>
                <div className="space-y-6">
                  {isEditing ? (
                    <>
                      <InputCard
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        Icon={User}
                      />
                      <InputCard
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        Icon={Mail}
                      />
                      <InputCard
                        label="Phone"
                        name="number"
                        value={formData.number}
                        onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                        Icon={Phone}
                      />
                    </>
                  ) : (
                    <>
                      <InfoCard label="Username" value={user.username} Icon={User} />
                      <InfoCard label="Email" value={user.email} Icon={Mail} />
                      <InfoCard label="Phone" value={user.number} Icon={Phone} />
                      <InfoCard label="Role" value={user.role} Icon={Briefcase} />
                    </>
                  )}
                </div>

                <div className="mt-6 flex gap-3">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-[#5E3A3A] text-white px-4 py-2 rounded-lg hover:bg-[#442828] transition"
                      >
                        {isSaving ? "Saving..." : "Save"}

                      </button>
                      <button
                        onClick={handleCancel}
                        className="text-gray-600 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-[#5E3A3A] text-white px-4 py-2  rounded-lg hover:bg-[#442828] transition"
                    >
                      <Pencil size={16} />
                      {/* Edit */}
                    </button>

                  )}
                </div>
              </div>
            </div>
          </div>

          {/*~~~~~~~~~~~~~~~ Sidebar ~~~~~~~~~~~~~~~~~~ */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <h3 className="text-lg font-semibold text-[#5E3A3A] mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {profileActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleActionClick(action.label)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 hover:shadow-md group ${
                      action.danger
                        ? 'hover:bg-red-50 border border-transparent hover:border-red-200'
                        : 'hover:bg-[#FAF9F6] border border-transparent hover:border-[#D8A7B1]/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-white transition-colors ${action.color}`}>
                        <action.icon size={18} />
                      </div>
                      <div className="text-left">
                        <p className={`font-medium ${action.danger ? 'text-red-600' : 'text-[#5E3A3A]'}`}>
                          {action.label}
                        </p>
                        <p className="text-sm text-gray-500">{action.description}</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className={`transition-transform group-hover:translate-x-1 ${action.danger ? 'text-red-400' : 'text-gray-400'}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  </>
  );
};

const InfoCard = ({ label, value, sub, Icon }) => (
  <div className="flex items-center gap-4 p-4 bg-[#FAF9F6] rounded-xl border border-gray-100">
    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
      <Icon size={20} className="text-[#5E3A3A]" />
    </div>
    <div className="flex-1">
      <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
      <p className="text-lg font-medium text-[#5E3A3A]">{value}</p>
      {sub && <p className="text-sm text-gray-500">{sub}</p>}
    </div>
  </div>

);

const InputCard = ({ label, value, onChange, Icon }) => (
  <div className="flex items-center gap-4 p-4 bg-[#FAF9F6] rounded-xl border border-gray-100">
    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
      <Icon size={20} className="text-[#5E3A3A]" />
    </div>
    <div className="flex-1">
      <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#D8A7B1] text-[#5E3A3A]"
      />
    </div>
  </div>

);

export default Profile;
