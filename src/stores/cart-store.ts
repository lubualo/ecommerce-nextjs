import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Cart, CartItem, Product } from '@/types/product';

interface CartStore extends Cart {
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: number) => number;
  isInCart: (productId: number) => boolean;
}

const calculateTotals = (items: CartItem[]): { totalItems: number; totalPrice: number } => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => {
    return sum + (item.product.price * item.quantity);
  }, 0);
  
  return { totalItems, totalPrice };
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,

      addItem: (product: Product, quantity = 1) => {
        const state = get();
        const itemId = `product-${product.id}`;
        
        // Check if item already exists
        const existingItemIndex = state.items.findIndex(item => item.id === itemId);
        
        if (existingItemIndex >= 0) {
          // Update existing item quantity
          const updatedItems = [...state.items];
          updatedItems[existingItemIndex].quantity += quantity;
          const { totalItems, totalPrice } = calculateTotals(updatedItems);
          
          set({ items: updatedItems, totalItems, totalPrice });
        } else {
          // Add new item
          const newItem: CartItem = {
            id: itemId,
            product,
            quantity,
            addedAt: new Date().toISOString(),
          };
          
          const updatedItems = [...state.items, newItem];
          const { totalItems, totalPrice } = calculateTotals(updatedItems);
          
          set({ items: updatedItems, totalItems, totalPrice });
        }
      },

      removeItem: (itemId: string) => {
        const state = get();
        const updatedItems = state.items.filter(item => item.id !== itemId);
        const { totalItems, totalPrice } = calculateTotals(updatedItems);
        
        set({ items: updatedItems, totalItems, totalPrice });
      },

      updateQuantity: (itemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }

        const state = get();
        const updatedItems = state.items.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        );
        const { totalItems, totalPrice } = calculateTotals(updatedItems);
        
        set({ items: updatedItems, totalItems, totalPrice });
      },

      clearCart: () => {
        set({ items: [], totalItems: 0, totalPrice: 0 });
      },

      getItemQuantity: (productId: number) => {
        const state = get();
        const itemId = `product-${productId}`;
        const item = state.items.find(item => item.id === itemId);
        return item?.quantity || 0;
      },

      isInCart: (productId: number) => {
        const state = get();
        const itemId = `product-${productId}`;
        return state.items.some(item => item.id === itemId);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
