import { atom } from 'jotai';

import { HistoryAutoSaveItem, HistoryAutoSaveItemInfo } from '@/types';

import {
  historyAutoSaveCountAtom,
  historyAutoSaveEnabledAtom,
  historyAutoSaveItemsAtom,
} from './storageAtoms';

// Atom to add a new history auto-save item
export const addHistoryAutoSaveItemAtom = atom(
  null,
  (get, set, item: HistoryAutoSaveItemInfo) => {
    const historyAutoSaveItems = get(historyAutoSaveItemsAtom);
    const newItem: HistoryAutoSaveItem = {
      ...item,
      timestamp: new Date().toISOString(),
    };
    set(historyAutoSaveItemsAtom, [newItem, ...historyAutoSaveItems]);
  }
);

// Atom to remove a history auto-save item by index
export const removeHistoryAutoSaveItemAtom = atom(null, (get, set, index: number) => {
  const historyAutoSaveItems = get(historyAutoSaveItemsAtom);
  const newHistoryAutoSaveItems = historyAutoSaveItems.filter((_, i) => i !== index);
  set(historyAutoSaveItemsAtom, newHistoryAutoSaveItems);
});

// Atom to clear all history auto-save items
export const clearHistoryAutoSaveItemAtom = atom(null, (_, set) => {
  set(historyAutoSaveItemsAtom, []);
});

// If historyAutoSaveEnabled is True,
// add an item and remove the oldest item if the count exceeds
export const historyAutoSaveHandler = atom(
  null,
  (get, set, item: HistoryAutoSaveItemInfo) => {
    if (!get(historyAutoSaveEnabledAtom)) {
      return;
    }

    const items = get(historyAutoSaveItemsAtom);
    set(addHistoryAutoSaveItemAtom, item);

    const maxCount = get(historyAutoSaveCountAtom);

    if (items.length > maxCount) {
      set(historyAutoSaveItemsAtom, items.slice(0, maxCount));
    }
  }
);
