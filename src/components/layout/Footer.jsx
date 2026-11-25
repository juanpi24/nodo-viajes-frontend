export const Footer = () => {
  return (
    <footer className="bg-white dark:bg-surface-800 border-t border-surface-100 dark:border-surface-700 py-6 mt-auto transition-colors">
      <div className="container mx-auto px-4 text-center text-text-muted text-sm">
        <p>
          © {new Date().getFullYear()} ViajesAR - Trabajo Práctico Integrador
          Fullstack.
        </p>
        <p className="mt-1">
          Desarrollado con React, Node.js, Express y MongoDB 2026. Juan Pablo
          Millicay
        </p>
      </div>
    </footer>
  );
};
