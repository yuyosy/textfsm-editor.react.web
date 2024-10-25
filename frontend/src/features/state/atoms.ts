import { StatusBadgeVariant } from '@/components/StatusBadge';
import { ResultItem } from '@/types';
import { atom } from 'jotai';
import { atomWithReset } from 'jotai/utils';

export const responseStateAtom = atom<StatusBadgeVariant>('init');
export const responseResultsAtom = atomWithReset<ResultItem[]>([]);
export const resultViewValueAtom = atom<ResultItem>();
