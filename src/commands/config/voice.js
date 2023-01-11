module.exports = class Voice extends Interaction {
    constructor() {
        super({
            name: "voice",
            description: "Manage the allowed voice channels",
            options: [
                {
                    type: ApplicationCommandOptionType.Subcommand,
                    name: "add",
                    description: "Adicionar um canal de voz à lista permitida",
                    options: [
                        {
                            type: ApplicationCommandOptionType.Channel,
                            name: "channel",
                            description: "O canal de voz a adicionar",
                            required: true,
                        },
                    ]
                },
                {
                    type: ApplicationCommandOptionType.Subcommand,
                    name: "remove",
                    description: "Remover um canal de voz da lista permitida",
                    options: [
                        {
                            type: ApplicationCommandOptionType.Channel,
                            name: "channel",
                            description: "O canal de voz a ser removido",
                            required: true,
                        },
                    ]
                },
                {
                    type: ApplicationCommandOptionType.Subcommand,
                    name: "list",
                    description: "Listar os canais de voz permitidos",
                },
            ],
        });
    }

    async exec(int, data) {
        if (!int.member.permissions.has("MANAGE_GUILD"))
            return int.reply({
                content: "Você não tem as permissões necessárias para fazer isso!",
                ephemeral: true,
            });

        const cmd = int.options.getSubcommand()

        if (cmd === "add") {
            let channel = int.options._hoistedOptions[0].channel;

            if (
                channel.type !== ChannelType.GuildVoice &&
                channel.type !== ChannelType.GuildStageVoice
            ) {
                return int.reply({
                    content: "Você só pode adicionar canais de voz à lista permitida!",
                    ephemeral: true,
                });
            }

            let old = data.voiceChannels.find((c) => c === channel.id);

            if (old) {
                return int.reply({
                    content: `O canal ${channel.name} já está na lista de permitidos!`,
                    ephemeral: true,
                });
            }

            data.voiceChannels.push(channel.id);
            await data.save();

            return int.reply({
                content: `O canal ${channel.name} foi adicionado à lista de permitidos!`,
                ephemeral: true,
            });
        }
        if (cmd === "remove") {
            let channel = int.options._hoistedOptions[0].channel;

            if (
                channel.type !== ChannelType.GuildVoice &&
                channel.type !== ChannelType.GuildStageVoice
            ) {
                return int.reply({
                    content: "Você só pode adicionar canais de voz à lista permitida!",
                    ephemeral: true,
                });
            }

            let old = data.voiceChannels.find((c) => c === channel.id);

            if (!old) {
                return int.reply({
                    content: `O canal ${channel.name} não está na lista de permitidos!`,
                    ephemeral: true,
                });
            }

            let index = data.voiceChannels.indexOf(channel.id);
            data.voiceChannels.splice(index, 1);
            await data.save();

            return int.reply({
                content: `O canal ${channel.name} foi removido da lista de permitidos!`,
                ephemeral: true,
            });
        }
        if (cmd === "list") {
            let vcs = data.voiceChannels;

            if (!vcs.length) {
                return int.reply({
                    content: "Não há canais de voz na lista permitida!",
                    ephemeral: true,
                });
            }

            let emb = new EmbedBuilder()
                .setTitle("Canais de voz permitidos")
                .setThumbnail(int.guild.iconURL({size: 2048}))
                .setColor("#2f3136")
                .setDescription(`${vcs.map((m) => `<#${m}>`).join(" ")}`)
                .setTimestamp();

            return int.reply({embeds: [emb]});
        }
    }
};
