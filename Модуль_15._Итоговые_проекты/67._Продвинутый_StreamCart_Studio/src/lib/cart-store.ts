import { useSyncExternalStore } from 'react';

import { formatCurrency, getProductBySlug } from './store-data';

export type CartLine = {
  id: string;
  productSlug: string;
  color: string;
  size: string;
  quantity: number;
};

type Listener = () => void;

const storageKey = 'streamcart-cart-v1';

function createCartStore() {
  let lines: CartLine[] = [];
  let hydrated = false;
  const listeners = new Set<Listener>();

  function notify() {
    listeners.forEach((listener) => listener());
  }

  function persist() {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(storageKey, JSON.stringify(lines));
  }

  function hydrate() {
    if (hydrated || typeof window === 'undefined') {
      return;
    }

    hydrated = true;

    try {
      const raw = window.localStorage.getItem(storageKey);

      if (!raw) {
        return;
      }

      const parsed = JSON.parse(raw) as CartLine[];

      if (Array.isArray(parsed)) {
        lines = parsed;
      }
    } catch {
      lines = [];
    }
  }

  function mutate(nextLines: CartLine[]) {
    lines = nextLines;
    persist();
    notify();
  }

  return {
    getSnapshot() {
      hydrate();
      return lines;
    },
    subscribe(listener: Listener) {
      hydrate();
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },
    addLine(input: Omit<CartLine, 'id'>) {
      hydrate();

      const existing = lines.find(
        (line) =>
          line.productSlug === input.productSlug &&
          line.color === input.color &&
          line.size === input.size,
      );

      if (existing) {
        mutate(
          lines.map((line) =>
            line.id === existing.id
              ? { ...line, quantity: line.quantity + input.quantity }
              : line,
          ),
        );
        return;
      }

      mutate([
        ...lines,
        {
          ...input,
          id: `${input.productSlug}:${input.color}:${input.size}`,
        },
      ]);
    },
    updateQuantity(lineId: string, quantity: number) {
      hydrate();

      if (quantity <= 0) {
        mutate(lines.filter((line) => line.id !== lineId));
        return;
      }

      mutate(lines.map((line) => (line.id === lineId ? { ...line, quantity } : line)));
    },
    removeLine(lineId: string) {
      hydrate();
      mutate(lines.filter((line) => line.id !== lineId));
    },
    clear() {
      hydrate();
      mutate([]);
    },
  };
}

export const cartStore = createCartStore();

export function useCartLines() {
  return useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getSnapshot,
    cartStore.getSnapshot,
  );
}

export function getCartSummary(lines: readonly CartLine[]) {
  const detailedLines = lines
    .map((line) => {
      const product = getProductBySlug(line.productSlug);

      if (!product) {
        return null;
      }

      return {
        ...line,
        product,
        lineTotal: product.price * line.quantity,
      };
    })
    .filter((line): line is NonNullable<typeof line> => line !== null);

  const subtotal = detailedLines.reduce((sum, line) => sum + line.lineTotal, 0);
  const shipping = subtotal >= 30000 || subtotal === 0 ? 0 : 690;
  const total = subtotal + shipping;
  const itemCount = detailedLines.reduce((sum, line) => sum + line.quantity, 0);

  return {
    lines: detailedLines,
    itemCount,
    subtotal,
    shipping,
    total,
    formattedSubtotal: formatCurrency(subtotal),
    formattedShipping: shipping === 0 ? 'Бесплатно' : formatCurrency(shipping),
    formattedTotal: formatCurrency(total),
  };
}
