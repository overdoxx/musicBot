const {RepeatMode} = require("discord-music-player");

module.exports = class Loop extends Interaction {
    constructor() {
        super({
            name: "loop",
            description: "Define um loop, ou não",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "mode",
                    description: "Loop",
                    required: true,
                    choices: [
                        {
                            name: "track",
                            value: "track",
                        },
                        {
                            name: "queue",
                            value: "queue",
                        },
                        {
                            name: "disable",
                            value: "disable",
                        },
                    ],
                },
            ],
        });
    }

    async exec(int, data) {
        const mode = int.options.getString("mode");
        let channel = int.member.voice.channel;

        if (!channel)
            return int.reply({
                content: `${this.client.emotes.get(
                    "nomic"
                )} Você precisa estar em um canal de voz para usar esse comando!`,
                ephemeral: true,
            });

        if (int.guild.members.me.voice.channel && channel !== int.guild.members.me.voice.channel)
            return int.reply({
                content: `${this.client.emotes.get(
                    "nomic"
                )} Você precisa estar no mesmo canal de voz que euzinho :3 para usar esse comando!`,
                ephemeral: true,
            });

        let isDJ = data.djRoles.some((r) => int.member._roles.includes(r));
        let isAllowed = data.voiceChannels.find((c) => c === channel.id);
        let members = channel.members.filter((m) => !m.user.bot);

        if (data.voiceChannels.length > 0 && !isAllowed) {
            return int.reply({
                content: `${this.client.emotes.get(
                    "nomic"
                )} Você precisa estar em um canal de voz permitido para tocar musicas`,
                ephemeral: true,
            });
        }

        if (members.size > 1 && !isDJ && !int.member.permissions.has("MANAGE_GUILD")) {
            return int.reply({
                content:
                    "Você precisa ser um DJ ou estar sozinho no canal para usar esse comando!",
                ephemeral: true,
            });
        }

        let hasQueue = this.client.player.hasQueue(int.guild.id);
        if (!hasQueue) {
            return int.reply({
                content: "Não há música tocando neste servidor",
                ephemeral: true,
            });
        }

        let queue = this.client.player.getQueue(int.guild.id);

        if (mode === "track") {
            if (queue.repeatMode === RepeatMode.SONG) {
                return int.reply({
                    content: "A faixa atual já está em loop!",
                    ephemeral: true,
                });
            } else {
                queue.setRepeatMode(RepeatMode.SONG);
                return int.reply({
                    content: `${this.client.emotes.get(
                        "looped"
                    )} Repetiu a faixa atual!`,
                    ephemeral: true,
                });
            }
        } else if (mode === "queue") {
            if (queue.repeatMode === RepeatMode.QUEUE) {
                return int.reply({
                    content: "A fila atual já está em loop!",
                    ephemeral: true,
                });
            } else {
                queue.setRepeatMode(RepeatMode.QUEUE);
                return int.reply({
                    content: `${this.client.emotes.get(
                        "looped"
                    )} Repetiu a fila atual!`,
                    ephemeral: true,
                });
            }
        } else if (mode === "disabled") {
            if (queue.repeatMode === RepeatMode.DISABLED) {
                return int.reply({
                    content: "O modo loop já está desativado!",
                    ephemeral: true,
                });
            } else {
                queue.setRepeatMode(RepeatMode.DISABLED);
                return int.reply({
                    content: `${this.client.emotes.get(
                        "noloop"
                    )} Desativou o modo loop!`,
                    ephemeral: true,
                });
            }
        }
    }
};
