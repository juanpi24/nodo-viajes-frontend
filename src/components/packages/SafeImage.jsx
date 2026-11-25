import { useState } from 'react';
import { ImageOff } from 'lucide-react';

export const SafeImage = ({
  src,
  alt,
  className = '', // Ahora este className va al contenedor principal
  iconSize = 'w-10 h-10',
  fallbackText = 'Sin imagen',
  lazy = true,
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
      <div className={`flex flex-col items-center justify-center bg-gray-100 dark:bg-surface-900/60 text-gray-400 dark:text-gray-500 select-none overflow-hidden p-2 ${className}`}>
        <ImageOff className={`${iconSize} opacity-75 ${fallbackText ? 'mb-1' : ''}`} />
        {fallbackText && (
          <span className="text-[10px] sm:text-xs font-medium text-center leading-tight">
            {fallbackText}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
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
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          status === 'loaded' ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};