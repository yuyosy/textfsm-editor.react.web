import { defaultEnvVariables } from './defaultEnvs';

const initEnv = () => {
  const viteEnvVariables = Object.entries(import.meta.env).reduce<
    Record<string, string>
  >((acc, cur) => {
    const [key, value] = cur;
    acc[key.startsWith('VITE_APP_') ? key.slice('VITE_APP_'.length) : key] = value;
    return acc;
  }, {});

  const mergedEnvVariables = {
    ...defaultEnvVariables,
    ...viteEnvVariables,
  };
  return mergedEnvVariables;
};

export const envs = initEnv();
