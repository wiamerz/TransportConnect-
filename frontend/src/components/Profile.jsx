import { useAuth } from "../provider/AuthProvider";

const Profile = () => {
  const { token } = useAuth();
  console.log("Current token:", token);

  return (
    <div className="p-4 text-xl">Welcome to your profile!</div>
  );
};

export default Profile;
