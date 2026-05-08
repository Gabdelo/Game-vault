import { useState, useEffect, useRef } from "react";
import { searchUsers } from "../services/friendsService";
import type { UserProfile } from "../types/profiles";


export const useSearchUsers = (username: string, currentUserId: string) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Referencia para cancelar la petición anterior
  const abortController = useRef<AbortController | null>(null);

  useEffect(() => {
    // Si está vacío, no hacer búsqueda
    if (!username.trim()) {
      setUsers([]);
      return;
    }

    const timeout = setTimeout(async () => {
      // Cancelamos la petición anterior
      abortController.current?.abort();
      const controller = new AbortController();
      abortController.current = controller;

      try {
        setLoading(true);
        setError(null);
        const data = await searchUsers(username, currentUserId);
        setUsers(data);
      } catch (err) {
        // Ignorar errores de abort - son esperados cuando se cancelan peticiones
        if (err instanceof Error && err.name !== "AbortError") {
          console.error("Error fetching users:", err);
          setError(
            err instanceof Error ? err.message : "Error al buscar usuarios"
          );
        }
      } finally {
        setLoading(false);
      }
    }, 400); // Debounce de 400ms para evitar hacer una petición por cada letra

    return () => clearTimeout(timeout);
  }, [username, currentUserId]);

  return { users, loading, error };
};
