import { Client, Guild } from 'discord.js';
import { Stats, AttrTypes } from './stattypes';
import { display } from './ui';

export default class Counter {
  private static getStats(guild: Guild) {
    const stats: Stats = guild.roles.cache.mapValues(
      (role) => role.members.size
    );
    stats.set(
      AttrTypes.Bot,
      guild.members.cache.filter((member) => member.user.bot).size
    );
    return stats;
  }

  async initialize(client: Client) {
    const guilds = await client.guilds.fetch();
    for (const partial of guilds.values()) {
      const guild = await partial.fetch();
      await this.fetchAll(guild);
    }
    const hourly = async () => {
      await Promise.all(
        client.guilds.cache.map((guild) => {
          display(guild, Counter.getStats(guild)).catch((err) =>
            console.error('Display:', guild.id, err)
          );
        })
      );
    };
    setInterval(hourly, 60 * 60 * 1000);
    await hourly();
  }

  async fetchAll(guild: Guild) {
    await guild.members
      .fetch()
      .catch((err) => console.error('Member fetch:', guild.id, err));
  }
}
