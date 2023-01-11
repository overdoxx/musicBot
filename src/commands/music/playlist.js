const {sourceTest, testPlaylist} = require("../../utils/Utils");

module.exports = class Playlist extends Interaction {
    constructor() {
        super({
            name: "playlist",
            description: "Adiciona uma lista de reprodução à fila",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "link",
                    description: "Link da playlist",
                    required: true,
                },
            ],
        });
    }

    async exec(int, data) {
        const playlist = int.options.getString("link");

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


        let source = await sourceTest(playlist);
        let isPlaylist = testPlaylist(playlist);

        if (!isPlaylist)
            return int.reply({
                content: "Esse não é um link de lplaylist válido!",
                ephemeral: true,
            });

        return this.client.play(
            this.client,
            int,
            data,
            playlist,
            source,
            true,
            false
        );
    }
};
