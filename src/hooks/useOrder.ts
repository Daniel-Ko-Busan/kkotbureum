'use client';

import { useReducer, useCallback } from 'react';
import type { OrderFormData } from '@/types';

const initialState: OrderFormData = {
  senderName: '',
  senderPhone: '',
  recipientName: '',
  recipientPhone: '',
  recipientAddress: '',
  recipientAddressDetail: '',
  recipientZipcode: '',
  deliveryDate: '',
  deliveryTimeSlot: 'anytime',
  cardMessage: '',
  specialInstructions: '',
  productId: '',
  productName: '',
  productPrice: 0,
};

type Action =
  | { type: 'UPDATE_FIELD'; field: keyof OrderFormData; value: string | number }
  | { type: 'SET_PRODUCT'; payload: { productId: string; productName: string; productPrice: number } }
  | { type: 'RESET' }
  | { type: 'LOAD'; payload: OrderFormData };

function orderReducer(state: OrderFormData, action: Action): OrderFormData {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_PRODUCT':
      return { ...state, ...action.payload };
    case 'RESET':
      return initialState;
    case 'LOAD':
      return action.payload;
    default:
      return state;
  }
}

export function useOrder() {
  const [orderData, dispatch] = useReducer(orderReducer, initialState, () => {
    if (typeof window === 'undefined') return initialState;
    const saved = sessionStorage.getItem('orderData');
    return saved ? JSON.parse(saved) : initialState;
  });

  const updateField = useCallback((field: keyof OrderFormData, value: string | number) => {
    dispatch({ type: 'UPDATE_FIELD', field, value });
    if (typeof window !== 'undefined') {
      const current = JSON.parse(sessionStorage.getItem('orderData') || '{}');
      sessionStorage.setItem('orderData', JSON.stringify({ ...current, [field]: value }));
    }
  }, []);

  const setProduct = useCallback((productId: string, productName: string, productPrice: number) => {
    dispatch({ type: 'SET_PRODUCT', payload: { productId, productName, productPrice } });
    if (typeof window !== 'undefined') {
      const current = JSON.parse(sessionStorage.getItem('orderData') || '{}');
      sessionStorage.setItem('orderData', JSON.stringify({ ...current, productId, productName, productPrice }));
    }
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('orderData');
    }
  }, []);

  const save = useCallback(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('orderData', JSON.stringify(orderData));
    }
  }, [orderData]);

  return { orderData, updateField, setProduct, reset, save };
}
