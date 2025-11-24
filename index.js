require('dotenv').config();
const { Client, GatewayIntentBits, Collection, SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
const db = require('./database');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commands = [
  new SlashCommandBuilder().setName('clock-in').setDescription('Pontaj: intrare tura')
    .addStringOption(o=>o.setName('ora').setDescription('Ora de intrare').setRequired(true)),
  new SlashCommandBuilder().setName('clock-out').setDescription('Pontaj: iesire tura')
    .addStringOption(o=>o.setName('ora').setDescription('Ora de iesire').setRequired(true)),
  new SlashCommandBuilder().setName('pontaj-status').setDescription('Statusul pontajului tau'),
  new SlashCommandBuilder().setName('pontaj-history').setDescription('Istoricul pontajului')
].map(c=>c.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

client.once('ready', async () => {
  console.log(`Bot pornit: ${client.user.tag}`);
  await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const userId = interaction.user.id;
  const command = interaction.commandName;

  if (command === 'clock-in') {
    const ora = interaction.options.getString('ora');
    db.clockIn(userId, ora);
    return interaction.reply({ content: `Ai intrat pe tura la **${ora}**`, ephemeral: true });
  }

  if (command === 'clock-out') {
    const ora = interaction.options.getString('ora');
    db.clockOut(userId, ora);
    return interaction.reply({ content: `Ai iesit de pe tura la **${ora}**`, ephemeral: true });
  }

  if (command === 'pontaj-status') {
    const status = db.getStatus(userId);
    return interaction.reply({ content: status, ephemeral: true });
  }

  if (command === 'pontaj-history') {
    const hist = db.getHistory(userId);
    return interaction.reply({ content: hist, ephemeral: true });
  }
});

client.login(process.env.BOT_TOKEN);
