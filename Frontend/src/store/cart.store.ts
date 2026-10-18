import { create } from 'zustand';
import { Product } from '@/types/product.types';
import { Customer } from '@/types/customer.types';
import { Prescription } from '@/types/optical.types';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  unitPrice: number;
  discount?: number;
}

interface CartState {
  cart: CartItem[];
  wizardStep: number;
  wizardCustomer: Partial<Customer> | null;
  wizardPrescription: Prescription | null;

  addToCart: (product: Product, quantity?: number, selectedColor?: string, selectedSize?: string) => void;
  removeFromCart: (productId: string | number, selectedColor?: string, selectedSize?: string) => void;
  updateQuantity: (productId: string | number, quantity: number, selectedColor?: string, selectedSize?: string) => void;
  clearCart: () => void;

  setWizardStep: (step: number) => void;
  setWizardCustomer: (customer: Partial<Customer> | null) => void;
  setWizardPrescription: (prescription: Prescription | null) => void;
  resetWizard: () => void;

  getCartSubtotal: () => number;
  getCartTotalCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: [],
  wizardStep: 0,
  wizardCustomer: null,
  wizardPrescription: null,

  addToCart: (product, quantity = 1, selectedColor = '', selectedSize = '') =>
    set((state) => {
      const existingIndex = state.cart.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize
      );

      const price = Number(product.selling_price || product.base_price || 0);

      if (existingIndex > -1) {
        const updatedCart = [...state.cart];
        const existing = updatedCart[existingIndex];
        if (existing) {
          existing.quantity += quantity;
        }
        return { cart: updatedCart };
      }

      return {
        cart: [
          ...state.cart,
          {
            product,
            quantity,
            selectedColor,
            selectedSize,
            unitPrice: price,
            discount: 0,
          },
        ],
      };
    }),

  removeFromCart: (productId, selectedColor = '', selectedSize = '') =>
    set((state) => ({
      cart: state.cart.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedColor === selectedColor &&
            item.selectedSize === selectedSize
          )
      ),
    })),

  updateQuantity: (productId, quantity, selectedColor = '', selectedSize = '') =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.product.id === productId &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      ),
    })),

  clearCart: () => set({ cart: [] }),

  setWizardStep: (step) => set({ wizardStep: step }),
  setWizardCustomer: (customer) => set({ wizardCustomer: customer }),
  setWizardPrescription: (prescription) => set({ wizardPrescription: prescription }),

  resetWizard: () =>
    set({
      cart: [],
      wizardStep: 0,
      wizardCustomer: null,
      wizardPrescription: null,
    }),

  getCartSubtotal: () => {
    return get().cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  },

  getCartTotalCount: () => {
    return get().cart.reduce((count, item) => count + item.quantity, 0);
  },
}));
