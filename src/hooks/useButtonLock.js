import { useEffect, useRef, useState } from "react";

function useButtonLock(delay = 3000) {
  const [isLocked, setIsLocked] = useState(false);

  // Ref pour stocker le timeout (nettoyage)
  const timeoutRef = useRef(null);

  // Fonction qui va entourer l'action (email, reset, comms)
  const runWithLock = async (callback) => {
    // Si déjà bloqué, on empêche toute exécution
    if (isLocked) return;

    setIsLocked(true);

    try {
      // On exécute la fonction passée ( axios)
      await callback();
    } finally {
      // Une fois terminé, on attend "delay" ms avant de débloquer
      timeoutRef.current = setTimeout(() => {
        setIsLocked(false);
      }, delay);
    }
  };

  // Nettoyage si le composant est démonté (évite erreurs mémoire)
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // On expose uniquement ce dont on a besoin
  return {
    isLocked, // pour désactiver le bouton
    runWithLock, // pour encadrer l'action
  };
}

export default useButtonLock;
