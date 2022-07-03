import { Client, Guild, GuildMember, PartialGuildMember } from 'discord.js';
import Counter from './counter';

export class Handlers {
  constructor(public client: Client, public counter: Counter) {
    client.on('guildMemberAdd', this.memberChanges.bind(this));
    client.on('guildMemberUpdate', this.memberChanges.bind(this));
    client.on('guildMemberRemove', this.memberChanges.bind(this));
    client.on('guildMemberAdd', this.memberChanges.bind(this));
    client.on('guildCreate', this.guildCreate.bind(this));
  }
  private memberChanges(
    oldMember: GuildMember | PartialGuildMember,
    newMember?: GuildMember
  ) {
    const member = newMember ?? oldMember;
    this.counter.dispatch(member);
  }
  private async guildCreate(guild: Guild) {
    await this.counter.fetchAll(guild);
  }
}
