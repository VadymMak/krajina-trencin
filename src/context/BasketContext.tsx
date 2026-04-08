'use client';

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';

export interface BasketItem {
  id: number;
  slug: string;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
  flag: string;
  country: string;
}

interface BasketState {
  items: BasketItem[];
  isOpen: boolean;
}

type Action =
  | { type: 'ADD_ITEM'; payload: Omit<BasketItem, 'quantity'> & { quantity?: number } }
  | { type: 'REMOVE_ITEM'; payload: { id: number } }
  | { type: 'UPDATE_QTY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_BASKET' }
  | { type: 'TOGGLE_DRAWER'; payload?: boolean }
  | { type: 'LOAD'; payload: BasketItem[] };

function reducer(state: BasketState, action: Action): BasketState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { quantity = 1, ...product } = action.payload;
      const existing = state.items.find((i) => i.id === product.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === product.id
              ? { ...i, quantity: Math.min(99, i.quantity + quantity) }
              : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...product, quantity }] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.id !== action.payload.id) };
    case 'UPDATE_QTY':
      if (action.payload.quantity <= 0) {
        return { ...state, items: state.items.filter((i) => i.id !== action.payload.id) };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload.id
            ? { ...i, quantity: Math.min(99, action.payload.quantity) }
            : i
        ),
      };
    case 'CLEAR_BASKET':
      return { ...state, items: [] };
    case 'TOGGLE_DRAWER':
      return {
        ...state,
        isOpen: action.payload !== undefined ? action.payload : !state.isOpen,
      };
    case 'LOAD':
      return { ...state, items: action.payload };
    default:
      return state;
  }
}

/* ── Contexts ──────────────────────────────────────────────────────────────── */

interface BasketValue extends BasketState {
  total: number;
  count: number;
}

interface BasketActions {
  addItem: (product: Omit<BasketItem, 'quantity'>, quantity?: number) => void;
  removeItem: (id: number) => void;
  updateQty: (id: number, quantity: number) => void;
  clearBasket: () => void;
  toggleDrawer: (open?: boolean) => void;
}

const StateCtx   = createContext<BasketValue | null>(null);
const ActionsCtx = createContext<BasketActions | null>(null);

const STORAGE_KEY = 'krajina_basket';

/* ── Provider ──────────────────────────────────────────────────────────────── */

export function BasketProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [], isOpen: false });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: 'LOAD', payload: JSON.parse(raw) });
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {}
  }, [state.items]);

  const total = state.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const count = state.items.reduce((s, i) => s + i.quantity, 0);

  const addItem      = useCallback((product: Omit<BasketItem, 'quantity'>, quantity = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { ...product, quantity } });
  }, [dispatch]);

  const removeItem   = useCallback((id: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  }, [dispatch]);

  const updateQty    = useCallback((id: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QTY', payload: { id, quantity } });
  }, [dispatch]);

  const clearBasket  = useCallback(() => {
    dispatch({ type: 'CLEAR_BASKET' });
  }, [dispatch]);

  const toggleDrawer = useCallback((open?: boolean) => {
    dispatch({ type: 'TOGGLE_DRAWER', payload: open });
  }, [dispatch]);

  const actions = useMemo<BasketActions>(() => ({
    addItem,
    removeItem,
    updateQty,
    clearBasket,
    toggleDrawer,
  }), [addItem, removeItem, updateQty, clearBasket, toggleDrawer]);

  return (
    <StateCtx.Provider value={{ ...state, total, count }}>
      <ActionsCtx.Provider value={actions}>
        {children}
      </ActionsCtx.Provider>
    </StateCtx.Provider>
  );
}

/* ── Hooks ─────────────────────────────────────────────────────────────────── */

export function useBasket(): BasketValue {
  const ctx = useContext(StateCtx);
  if (!ctx) throw new Error('useBasket must be used within BasketProvider');
  return ctx;
}

export function useBasketActions(): BasketActions {
  const ctx = useContext(ActionsCtx);
  if (!ctx) throw new Error('useBasketActions must be used within BasketProvider');
  return ctx;
}
