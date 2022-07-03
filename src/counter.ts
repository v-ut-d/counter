import {
  Client,
  Collection,
  Guild,
  GuildMember,
  PartialGuildMember,
  Role,
  Snowflake,
} from 'discord.js';
import { display } from './ui';

export const BOT = Symbol('BOT');
// the id of role(Snowflake) or BOT
export type RoleLike = Snowflake | typeof BOT;

export class GuildCounter {
  private fetching = false;
  counts: Collection<RoleLike, number> = new Collection();
  constructor(public guild: Guild) {}
  private renewBotCount() {
    this.counts.set(
      BOT,
      this.guild.members.cache.filter((member) => member.user.bot).size
    );
  }
  private renewRoleCount(role: Role) {
    this.counts.set(role.id, role.members.size);
  }
  dispatch(member: GuildMember | PartialGuildMember, force = false) {
    if (this.fetching && !force) return;
    if (member.user.bot) {
      this.renewBotCount();
    }
    member.roles.cache.each((role) => this.renewRoleCount(role));
  }
  async fetchAll() {
    this.fetching = true;
    const members = await this.guild.members.fetch();
    members.each((member) => this.dispatch(member, true));
    this.fetching = false;
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
        this.counters.map((counter) => {
          display(counter.guild, counter.counts);
        })
      );
    };
    setInterval(intervalEvent, 60 * 60 * 1000);
    await intervalEvent();
  }
  async fetchAll(guild: Guild) {
    const counter = this.ensureGuild(guild);
    await counter.fetchAll();
  }
  dispatch(member: GuildMember | PartialGuildMember) {
    const counter = this.ensureGuild(member.guild);
    counter.dispatch(member);
  }
}
