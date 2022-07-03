import { Client, Intents } from 'discord.js';
import Counter from './counter';
import env from './env';
import { Handlers } from './handlers';

const { BOT_TOKEN } = env;

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MEMBERS,
  ],
});

client.login(BOT_TOKEN).then(async () => {
  const counter = new Counter();
  await counter.initialize(client);
  new Handlers(client, counter);
});
