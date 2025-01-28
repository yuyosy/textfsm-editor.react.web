import { atom } from 'jotai';
import { atomWithReset } from 'jotai/utils';

import { StatusBadgeVariant } from '@/components/StatusBadge';
import { ModalState } from '@/layouts/modals/types';
import { Notification, ResultItem } from '@/types';

export const responseStateAtom = atom<StatusBadgeVariant>('init');
export const responseResultsAtom = atomWithReset<ResultItem[]>([]);
export const resultViewValueAtom = atom<ResultItem>();

export const controlModalAtom = atom<ModalState>({ opened: false, type: 'not-active' });

export const notificationsAtom = atom<Notification[]>([]);

// add notification action
export const addNotificationAtom = atom(
  null,
  (get, set, notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const notifications = get(notificationsAtom);
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };
    set(notificationsAtom, [newNotification, ...notifications]);
  }
);

// remove notification action
export const removeNotificationAtom = atom(null, (get, set, notificationId: string) => {
  const notifications = get(notificationsAtom);
  console.log(notifications);
  set(
    notificationsAtom,
    notifications.filter(n => n.id !== notificationId)
  );
});

// clear all notifications action
export const clearNotificationsAtom = atom(null, (_, set) => {
  set(notificationsAtom, []);
});
