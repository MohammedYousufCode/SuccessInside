import { Link } from 'react-router-dom';
import { CheckCircle, TrendingUp, Calendar, Award } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export default function Landing() {
  const { user } = useAuth();
  
  // If already logged in, go straight to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Mountain Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/bg-mountains.jpg"
          alt="Mountain background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/70 via-purple-600/60 to-pink-600/70 backdrop-blur-[2px]" />
      </div>

      {/* Content */}
      <div className="relative z-10">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/10 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <img src="/logo.png" alt="Success Inside" className="w-8 h-8" />
              <span className="text-white text-2xl font-bold">
                Success Inside
              </span>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/login"
                className="text-white hover:text-gray-200 px-4 py-2 rounded-lg transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-6">
            <img src="/logo.png" alt="Success Inside" className="w-20 h-20 mx-auto mb-4" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Turn Daily Actions into Lifelong Success,
            <br />
            <span className="text-yellow-300">Your Habits Shape Your Future — Start Today</span>
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Stay consistent, stay motivated. Track habits, build momentum, and become who you want to be
            Simple habit tracking. Powerful results.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/signup"
              className="bg-white text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition shadow-lg"
            >
              Start Tracking – It’s Free
            </Link>
            <Link
              to="/login"
              className="bg-white/20 backdrop-blur text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/30 transition"
            >
              Get Started Instantly
            </Link>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto mt-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">No fees.<br />No limits.</div>
              <div className="text-white/80 mt-2">Just results.</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">Your progress,<br />everywhere.</div>
              <div className="text-white/80 mt-2">Smart insights<br />Real-time.</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">Track in<br />style</div>
              <div className="text-white/80 mt-2">Light or<br />dark.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            - Build streaks that motivate you

          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Daily Tracking</h3>
              <p className="text-gray-600">
              Visualize your progress with smart charts
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Streak Tracking</h3>
              <p className="text-gray-600">
                Build momentum with automatic streak counters.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Analytics</h3>
              <p className="text-gray-600">
                12-week heatmap and detailed progress charts.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="text-center p-6">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Achievements</h3>
              <p className="text-gray-600">
                Earn badges as you build lasting habits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Life?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands building better habits every day
          </p>
          <Link
            to="/signup"
            className="bg-white text-purple-600 px-10 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition shadow-lg inline-block"
          >
            Get Started - It's Free! 🚀
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <img src="/logo.png" alt="Success Inside" className="w-6 h-6" />
              <span className="text-xl font-bold">Success Inside</span>
            </div>
            <div className="text-gray-400 text-center md:text-right">
              <p>© 2026 Success Inside. Built with ❤️</p>
              <p className="text-sm mt-1">Your journey to better habits starts here</p>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}
