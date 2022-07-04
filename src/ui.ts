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
      /^(@(?<role>.*) Count|(?<attr>Bot) Count)(: (?<count>\d*))?$/
    );
    if (!match?.groups) continue;
    const oldCount = Number.parseInt(match.groups.count) || 0;
    if (match.groups.role) {
      if (match.groups.role === 'everyone') {
        const count = stats.get(guild.roles.everyone.id);
        await channel.setName(`@everyone Count: ${count}`);
      } else {
        const role = guild.roles.cache.find(
          (role) => role.name === match.groups?.role
        );
        if (!role) continue;
        const count = stats.get(role.id);
        if (!count || count == oldCount) continue;
        await channel.setName(`@${role.name} Count: ${count}`);
      }
    } else {
      const attr = match.groups.attr;
      if (!isAttr(attr)) return;
      const count = stats.get(AttrTypes[attr]);
      if (!count || count == oldCount) continue;
      await channel.setName(`${attr} Count: ${count}`);
    }
  }
}
