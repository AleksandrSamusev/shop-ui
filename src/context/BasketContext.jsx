import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { authService } from "../services/authService";

const STORAGE_KEY_PREFIX = "veloce_basket";
const BASKET_EXPIRY_MS = 24 * 60 * 60 * 1000;

const BasketContext = createContext(null);

export const BasketProvider = ({ children }) => {
  const [basket, setBasket] = useState([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const prevKeyRef = useRef(null);

  // 🛡️ 1. IDENTITY RESOLUTION: Determine the locker key
  const getActiveKey = useCallback(() => {
    const user = authService.getCurrentUser();
    return user?.id ? `${STORAGE_KEY_PREFIX}_user_${user.id}` : `${STORAGE_KEY_PREFIX}_guest`;
  }, []);

  // 🚀 2. THE FORCE HYDRATOR: The "Check" for Sarah's items
  const hydrate = useCallback(() => {
    const key = getActiveKey();
    
    // 🛡️ PREVENT OVERWRITE: If we are switching keys, stop the auto-save first
    setIsHydrated(false);

    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const { items, timestamp } = JSON.parse(saved);
        const now = new Date().getTime();

        if (now - timestamp < BASKET_EXPIRY_MS) {
          setBasket(items || []);
          console.log(`[Basket] Hydrated ${items.length} items from ${key}`);
          return;
        }
      }
      setBasket([]);
    } catch (e) {
      setBasket([]);
    } finally {
      setIsHydrated(true);
      prevKeyRef.current = key;
    }
  }, [getActiveKey]);

  // 🛡️ 3. INITIAL & RE-MOUNT HANDSHAKE
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // 🔄 4. THE PERSISTENT SYNC: Only saves once hydration is confirmed
  useEffect(() => {
    if (!isHydrated) return;

    const currentKey = getActiveKey();
    
    // 🛑 CRITICAL GUARD: Only save if the current key matches the one we hydrated
    if (prevKeyRef.current !== currentKey) return;

    const dataToSave = {
      items: basket,
      timestamp: new Date().getTime(),
    };
    
    localStorage.setItem(currentKey, JSON.stringify(dataToSave));
  }, [basket, getActiveKey, isHydrated]);

  const addToBasket = (product) => {
    setBasket((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) return prev.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const clearBasket = () => {
    const key = getActiveKey();
    setBasket([]);
    localStorage.removeItem(key);
  };

  const basketCount = basket.reduce((t, i) => t + i.quantity, 0);
  const basketTotal = basket.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <BasketContext.Provider value={{ basket, addToBasket, clearBasket, basketCount, basketTotal }}>
      {children}
    </BasketContext.Provider>
  );
};

export const useBasket = () => useContext(BasketContext) || {};