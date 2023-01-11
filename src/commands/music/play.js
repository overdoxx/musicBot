const {sourceTest, testPlaylist} = require("../../utils/Utils")

module.exports = class Play extends Interaction {
    constructor() {
        super({
            name: "play",
            description: "Adiciona uma música à fila",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "musica",
                    description: "O termo de pesquisa ou um link",
                    required: true,
                },
                {
                    type: ApplicationCommandOptionType.Boolean,
                    name: "force",
                    description: "Tocar a música diretamente",
                    required: false,
                },
            ],
        });
    }

    async exec(int, data) {
        const song = int.options.getString("musica");
        const force = int.options.getBoolean("force");

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
            force &&
            members.size > 1 &&
            !isDJ &&
            !int.member.permissions.has("MANAGE_GUILD")
        ) {
            return int.reply({
                content:
                    "Você deve ser DJ ou estar sozinho no canal de voz para usar a função force!",
                ephemeral: true,
            });
        }

        let source = await sourceTest(song);
        let isPlaylist = testPlaylist(song);

        if (isPlaylist) {
            return this.client.play(
                this.client,
                int,
                data,
                song,
                source,
                true,
                false,
                false,
                false
            );
        } else {
            return this.client.play(
                this.client,
                int,
                data,
                song,
                source,
                false,
                false,
                false,
                force
            );
        }
    }
};
