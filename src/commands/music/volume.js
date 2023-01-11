module.exports = class Volume extends Interaction {
  constructor() {
    super({
      name: "volume",
      description: "Changes the volume of the music player",
      options: [
        {
          type: ApplicationCommandOptionType.Integer,
          name: "value",
          description: "O valor para definir o volume para",
          required: true,
        },
      ],
    });
  }

  async exec(int, data) {
    const volume = int.options.getInteger("value");
    let channel = int.member.voice.channel;

    if (!channel)
      return int.reply({
        content: `${this.client.emotes.get(
          "nomic"
        )} Você deve estar em um canal de voz para usar este comando!`,
        ephemeral: true,
      });
    if (int.guild.members.me.voice.channel && channel !== int.guild.members.me.voice.channel)
      return int.reply({
        content: `${this.client.emotes.get(
          "nomic"
        )} Você deve estar no mesmo canal de voz que eu para usar este comando!`,
        ephemeral: true,
      });

    let isDJ = data.djRoles.some((r) => int.member._roles.includes(r));
    let isAllowed = data.voiceChannels.find((c) => c === channel.id);
    let members = channel.members.filter((m) => !m.user.bot);

    if (data.voiceChannels.length > 0 && !isAllowed) {
      return int.reply({
        content: `${this.client.emotes.get(
          "nomic"
        )} Você deve estar em um dos canais de voz permitidos para usar este comando!`,
        ephemeral: true,
      });
    }

    if (
      members.size > 1 &&
      !isDJ &&
      !int.member.permissions.has("MANAGE_GUILD")
    ) {
      return int.reply({
        content:
          "Você deve ser um DJ ou estar sozinho no canal de voz para usar este comando!",
        ephemeral: true,
      });
    }

    if (volume < 0 || volume > 200)
      return int.reply({
        content: "O volume deve estar entre 0 e 200!",
        ephemeral: true,
      });

    let hasQueue = this.client.player.hasQueue(int.guild.id);
    if (!hasQueue)
      return int.reply({
        content: "Não há música tocando nesta guilda!",
        ephemeral: true,
      });

    let queue = this.client.player.getQueue(int.guild.id);

    queue.setVolume(volume);

    let emoji;
    if (volume === 0) {
      emoji = this.client.emotes.get("vol-mute");
    } else if (volume > 0 && volume <= 33) {
      emoji = this.client.emotes.get("vol-low");
    } else if (volume > 33 && volume <= 66) {
      emoji = this.client.emotes.get("vol-mid");
    } else if (volume > 66 && volume < 100) {
      emoji = this.client.emotes.get("vol-high");
    }

    return int.reply({
      content: `${emoji} Volume definido para ${volume}%!`,
      ephemeral: true,
    });
  }
};
