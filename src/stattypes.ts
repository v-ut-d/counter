import { Collection, Snowflake } from 'discord.js';

type valueOf<T> = T[keyof T];

export const AttrTypes = {
  Bot: Symbol('Bot'),
};

export function isAttr(arg: unknown): arg is keyof typeof AttrTypes {
  return typeof arg === 'string' && arg in AttrTypes;
}

// the id of role(Snowflake) or value of AttrTypes
export type RoleLike = Snowflake | valueOf<typeof AttrTypes>;
export type Stats = Collection<RoleLike, number>;
