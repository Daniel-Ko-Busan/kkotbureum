interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'error' | 'warning';
  className?: string;
}

export default function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variants = {
    default: 'bg-bg-secondary text-text-secondary',
    primary: 'bg-blue-50 text-primary',
    success: 'bg-green-50 text-success',
    error: 'bg-red-50 text-error',
    warning: 'bg-yellow-50 text-warning',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
