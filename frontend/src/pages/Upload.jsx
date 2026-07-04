import { useAuth } from '../context/AuthContext';

const Upload = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Welcome, {user?.name}
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Upload functionality coming soon.
      </p>
      <button
        onClick={logout}
        className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
      >
        Logout
      </button>
    </div>
  );
};

export default Upload;