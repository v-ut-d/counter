import { Client, Guild } from 'discord.js';
import Counter from './counter';

export class Handlers {
  constructor(public client: Client, public counter: Counter) {
    client.on('guildCreate', this.guildCreate.bind(this));
  }
  private async guildCreate(guild: Guild) {
    await this.counter.fetchAll(guild);
  }
}
