import { useNavigate } from 'react-router-dom';
import { FileText, Image as ImageIcon, FileUser, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const cards = [
  {
    icon: FileText,
    title: 'Upload PDF',
    description: 'Chat with any PDF document instantly using AI-powered insights.',
    color: 'from-indigo-500 to-blue-500',
  },
  {
    icon: ImageIcon,
    title: 'Upload Image',
    description: 'Extract and discuss information from images with ease.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: FileUser,
    title: 'Upload Resume',
    description: 'Get instant analysis and feedback on your resume.',
    color: 'from-emerald-500 to-teal-500',
  },
];

const Landing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (user) {
      navigate('/upload');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white tracking-tight">
          Chat with your documents,
          <br />
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            privately and instantly.
          </span>
        </h1>
        <p className="mt-6 text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          DocMind AI lets you upload a PDF, image, or resume and get instant,
          intelligent answers — powered by RAG. Nothing is stored permanently.
        </p>
      </section>

      {/* Cards Section */}
      <section className="max-w-5xl mx-auto px-6 pb-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map(({ icon: Icon, title, description, color }) => (
          <div
            key={title}
            onClick={handleCardClick}
            className="group cursor-pointer bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:-translate-y-1"
          >
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
            >
              <Icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {description}
            </p>
            <span className="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 group-hover:gap-2 gap-1 transition-all">
              Get Started <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Landing;