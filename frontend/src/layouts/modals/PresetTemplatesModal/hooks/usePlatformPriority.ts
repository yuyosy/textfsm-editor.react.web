import { platformPrioritiesAtom } from '@/features/state/storageAtoms';
import { useAtom } from 'jotai';

export const usePlatformPriority = () => {
  const [platformPriorities, setPlatformPriorities] = useAtom(platformPrioritiesAtom);

  const setPlatformPriority = (platform: string, priority: number) => {
    setPlatformPriorities(prev => {
      const existing = prev.find(p => p.platform === platform);
      if (existing) {
        return prev.map(p => (p.platform === platform ? { ...p, priority } : p));
      } else {
        return [...prev, { platform, priority }];
      }
    });
  };
  const removePlatformPriority = (platform: string) => {
    setPlatformPriorities(prev => prev.filter(p => p.platform !== platform));
  };

  return {
    platformPriorities,
    setPlatformPriorities,
    setPlatformPriority,
    removePlatformPriority,
  };
};
