import { AlertTriangle, Inbox, RefreshCw } from 'lucide-react';
import Button from './Button.jsx';

export function Loader({ label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-14 text-ink/50">
      <div className="h-8 w-8 rounded-full border-4 border-forest/15 border-t-gold animate-spin" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
      <span className="h-11 w-11 rounded-full bg-terracotta/15 text-terracotta-dark flex items-center justify-center">
        <AlertTriangle size={20} />
      </span>
      <p className="text-sm text-ink/60 max-w-sm">{message}</p>
      {onRetry && (
        <Button variant="ghost" icon={RefreshCw} onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

export function EmptyState({ title = 'Nothing here yet', message, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
      <span className="h-11 w-11 rounded-full bg-forest/10 text-forest flex items-center justify-center">
        <Inbox size={20} />
      </span>
      <div>
        <p className="text-sm font-semibold text-forest">{title}</p>
        {message && <p className="text-sm text-ink/50 mt-1 max-w-sm">{message}</p>}
      </div>
      {action}
    </div>
  );
}
