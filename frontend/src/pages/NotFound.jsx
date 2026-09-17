import { Link } from 'react-router-dom';
import { Wheat } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 text-center">
      <Wheat size={32} className="text-gold-dark mb-4" />
      <h1 className="text-3xl font-display text-forest">Page not found</h1>
      <p className="text-ink/55 mt-2 max-w-sm">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link to="/" className="btn-primary mt-6">
        Back to home
      </Link>
    </div>
  );
}
