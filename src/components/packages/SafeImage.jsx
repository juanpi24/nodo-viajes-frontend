import { useState } from 'react';
import { ImageOff } from 'lucide-react';

export const SafeImage = ({
  src,
  alt,
  className = '',
  iconSize = 'w-10 h-10',
  fallbackText = 'Sin imagen',
  lazy = true, // Carga diferida activada por defecto
}) => {
  const sourceKey = src == null ? '' : String(src);
  const [imageState, setImageState] = useState({
    src: sourceKey,
    status: sourceKey ? 'loading' : 'error',
  });
  const status =
    imageState.src === sourceKey
      ? imageState.status
      : sourceKey
        ? 'loading'
        : 'error';

  if (status === 'error') {
    return (
      <div className="w-full h-full min-h-48 bg-gray-100 dark:bg-surface-900/60 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 select-none p-4">
        <ImageOff className={`${iconSize} mb-2 opacity-75`} />
        {fallbackText && (
          <span className="text-xs font-medium text-center">
            {fallbackText}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {status === 'loading' && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-surface-700 animate-pulse" />
      )}

      <img
        src={src}
        alt={alt}
        loading={lazy ? 'lazy' : 'eager'}
        decoding="async"
        onLoad={() => setImageState({ src: sourceKey, status: 'loaded' })}
        onError={() => setImageState({ src: sourceKey, status: 'error' })}
        className={`w-full h-full object-cover transition-opacity duration-300 ${className} ${
          status === 'loaded' ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};
