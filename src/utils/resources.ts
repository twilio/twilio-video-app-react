import { ISessionResources } from 'types/Session';

const defaults: ISessionResources = {
  title: 'Digitaler DemokraTisch',
  hostLogoSrc: '/assets/demokratisch.png',
};

export const initSessionResources = (resources: ISessionResources | undefined) => {
  if (resources === undefined) {
    return defaults;
  }

  const res = resources;
  Object.entries(defaults).forEach(([key, value]) => {
    res[key as keyof ISessionResources] = res[key as keyof ISessionResources] ?? value;
  });
  return res;
};
