import { CategoryChannel, Guild } from 'discord.js';
import { Stats, AttrTypes, isAttr } from './stattypes';

export async function display(guild: Guild, stats: Stats) {
  const category = guild.channels.cache.find(
    (channel): channel is CategoryChannel =>
      channel.type === 'GUILD_CATEGORY' && channel.name == 'SERVER STATS'
  );
  if (!category) return;
  for (const channel of category.children.values()) {
    if (!channel.isVoice()) continue;

    const match = channel.name.match(
      /^(?<statsName>Bot|(@.+)) Count(: (?<count>[0-9]+))?$/
    );
    if (!match?.groups?.statsName) continue;

    const statsName = match.groups.statsName;
    const oldCount = Number.parseInt(match.groups.count);

    let count: number | undefined = undefined;

    if (statsName.startsWith('@')) {
      const role =
        statsName === '@everyone'
          ? guild.roles.everyone
          : guild.roles.cache.find((role) => `@${role.name}` === statsName);
      count = role && stats.get(role.id);
    } else if (isAttr(statsName)) {
      count = stats.get(AttrTypes[statsName]);
    }

    if (count === oldCount) continue;
    await channel
      .setName(`${statsName} Count: ${count || 0}`)
      .catch((err) => console.error('Display:', guild.id, err));
  }
}
