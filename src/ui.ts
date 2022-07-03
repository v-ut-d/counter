import { CategoryChannel, Collection, Guild } from 'discord.js';
import { BOT, RoleLike } from './counter';

export async function display(
  guild: Guild,
  stats: Collection<RoleLike, number>
) {
  const category = guild.channels.cache.find(
    (channel): channel is CategoryChannel =>
      channel.type === 'GUILD_CATEGORY' && channel.name == 'SERVER STATS'
  );
  if (!category) return;
  for (const channel of category.children.values()) {
    if (!channel.isVoice()) continue;
    const match = channel.name.match(
      /^(@(?<role>.*) Count|(?<attr>Bot) Count)(: (?<count>\d*))?$/
    );
    if (!match?.groups) continue;
    const oldCount = Number.parseInt(match.groups.count) || 0;
    if (match.groups.role) {
      const role = guild.roles.cache.find(
        (role) => role.name === match.groups?.role
      );
      if (!role) continue;
      const count = stats.get(role.id);
      if (!count || count == oldCount) continue;
      await channel.setName(`@${role.name} Count: ${count}`);
    } else {
      const attr = match.groups.attr;
      let count: number | undefined = undefined;
      switch (attr) {
        case 'Bot':
          count = stats.get(BOT);
          break;
        default:
          continue;
      }
      if (!count || count == oldCount) continue;
      await channel.setName(`${attr} Count: ${count}`);
    }
  }
}
