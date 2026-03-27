export type CatalogItem = {
  id: string;
  title: string;
  track: 'state' | 'architecture' | 'forms';
  duration: number;
};

export function createCatalogItems(): CatalogItem[] {
  return [
    { id: 'item-1', title: 'Lifting state up', track: 'state', duration: 25 },
    {
      id: 'item-2',
      title: 'Shared filters dashboard',
      track: 'architecture',
      duration: 30,
    },
    { id: 'item-3', title: 'Controlled form bridge', track: 'forms', duration: 20 },
    { id: 'item-4', title: 'Prop drilling clinic', track: 'architecture', duration: 35 },
  ];
}

export type DiscountState = {
  grossPrice: number;
  discountPercent: number;
};

export function createDiscountState(): DiscountState {
  return {
    grossPrice: 2400,
    discountPercent: 15,
  };
}

export type BookingState = {
  seats: number;
  tier: 'starter' | 'team' | 'intensive';
  acceptedRules: boolean;
};

export function createBookingState(): BookingState {
  return {
    seats: 2,
    tier: 'starter',
    acceptedRules: false,
  };
}

export type SelectionItem = {
  id: string;
  label: string;
};

export function createSelectionItems(): SelectionItem[] {
  return [
    { id: 'alpha', label: 'Панель alpha' },
    { id: 'beta', label: 'Панель beta' },
    { id: 'gamma', label: 'Панель gamma' },
  ];
}

export type OwnerScenario = {
  usedBySiblings: boolean;
  usedByOneLeaf: boolean;
  affectsLayoutSummary: boolean;
  needsCrossPagePersistence: boolean;
  isTemporaryInput: boolean;
};

export function createOwnerScenario(): OwnerScenario {
  return {
    usedBySiblings: true,
    usedByOneLeaf: false,
    affectsLayoutSummary: false,
    needsCrossPagePersistence: false,
    isTemporaryInput: false,
  };
}
