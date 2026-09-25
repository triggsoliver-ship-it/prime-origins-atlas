/**
 * The Prime Origins ecosystem, in the order the group publishes it.
 *
 * Atlas's footer used to carry a link labelled "Parent company" pointing at
 * primeorigins.org. That is the operating-software platform, not the group,
 * and "parent company" states a legal relationship this site is in no position
 * to assert. This is navigation between sibling brands, and it is labelled as
 * exactly that — here, in the footer and in the header menu, from one list.
 */
export type EcosystemSite = {
  name: string;
  role: string;
  url: string;
  /** True for Atlas itself, which is marked as the current site and not linked. */
  current?: boolean;
};

export const ECOSYSTEM: readonly EcosystemSite[] = [
  { name: 'Prime Origins Global', role: 'Group & strategy', url: 'https://primeoriginsglobal.org/' },
  { name: 'Prime Origins', role: 'Operations, commerce & provenance', url: 'https://primeorigins.org/' },
  { name: 'Prime Origins Atlas', role: 'Carbon & environmental markets', url: 'https://primeoriginsatlas.org/', current: true },
  { name: 'TerraFi', role: 'Asset finance & digital securities', url: 'https://terrafi.me/' },
  { name: 'Greenback', role: 'Digital-dollar settlement', url: 'https://gnbk.app/' }
];

/** The group entry, used for the footer's top-level group link. */
export const GROUP = ECOSYSTEM[0];
