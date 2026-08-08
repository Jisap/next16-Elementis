"use client"

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from "react"

// Contexto que expondrá el valor "isMobile" a toda la aplicación.
// Se tipa como boolean | null:
//   - null  => todavía no se ha determinado (por ejemplo, durante el render en servidor
//              o antes de que el useEffect se ejecute en el cliente).
//   - true  => el ancho de la ventana es menor a 768px (se considera móvil).
//   - false => el ancho de la ventana es 768px o mayor (escritorio/tablet grande).
const WindowSizeContext = createContext<boolean | null>(null);

// Proveedor del contexto. Debe envolver la parte de la app que necesite
// saber si el usuario está en móvil (normalmente en el layout raíz).
export const WindowSizeProvider = ({ children }: Readonly<{ children: ReactNode }>) => {

  const [isMobile, setIsMobile] = useState<boolean | null>(null);          // Estado que se actualizará dinámicamente al redimensionar la ventana.

  useEffect(() => {
    const handleResize = () => {                                           // Handler que recalcula si estamos en "modo móvil" según el ancho actual. 
      setIsMobile(window.innerWidth < 768);
    }

    handleResize();                                                        // Se ejecuta una vez al montar, para fijar el valor inicial en cuanto el código corre en el cliente (donde "window" ya existe).

    window.addEventListener("resize", handleResize)                        // Se escucha el evento "resize" para mantener el valor sincronizado cada vez que el usuario cambia el tamaño de la ventana.

    return () => window.removeEventListener("resize", handleResize)        // Función de limpieza: se ejecuta al desmontar el componente, evitando que el listener quede activo innecesariamente (memory leak).
  }, []);

  // Se expone el valor actual de isMobile
  // a todos los componentes hijos.
  return (
    <WindowSizeContext.Provider value={isMobile}>
      {children}
    </WindowSizeContext.Provider>
  )
}

// Hook de conveniencia para consumir el contexto desde cualquier
// componente descendiente, sin tener que importar useContext y
// WindowSizeContext cada vez.
export const useIsMobile = () => useContext(WindowSizeContext)