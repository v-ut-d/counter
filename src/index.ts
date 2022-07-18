import { Client, GatewayIntentBits } from 'discord.js';
import Counter from './counter';
import env from './env';
import { Handlers } from './handlers';

const { BOT_TOKEN } = env;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMembers,
  ],
});

client.login(BOT_TOKEN).then(async () => {
  const counter = new Counter();
  await counter.initialize(client);
  new Handlers(client, counter);
});
