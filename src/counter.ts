import { Client, Collection, Guild, Snowflake } from 'discord.js';
import { display } from './ui';

export const BOT = Symbol('BOT');
// the id of role(Snowflake) or BOT
export type RoleLike = Snowflake | typeof BOT;

export class GuildCounter {
  constructor(public guild: Guild) {}
  get counts() {
    const counts: Collection<RoleLike, number> =
      this.guild.roles.cache.mapValues((role) => role.members.size);
    counts.set(
      BOT,
      this.guild.members.cache.filter((member) => member.user.bot).size
    );
    return counts;
  }
  async fetchAll() {
    await this.guild.members
      .fetch()
      .catch((err) => console.error('Member fetch:', this.guild.id, err));
  }
}

export default class Counter {
  counters: Collection<Snowflake, GuildCounter> = new Collection();
  private ensureGuild(guild: Guild) {
    return this.counters.ensure(guild.id, () => new GuildCounter(guild));
  }
  async initialize(client: Client) {
    const guilds = await client.guilds.fetch();
    for (const partial of guilds.values()) {
      const guild = await partial.fetch();
      await this.fetchAll(guild);
    }
    const intervalEvent = async () => {
      await Promise.all(
        this.counters.map((counter) =>
          display(counter.guild, counter.counts).catch((err) =>
            console.error('Display:', counter.guild.id, err)
          )
        )
      );
    };
    setInterval(intervalEvent, 60 * 60 * 1000);
    await intervalEvent();
  }
  async fetchAll(guild: Guild) {
    const counter = this.ensureGuild(guild);
    await counter.fetchAll();
  }
}
