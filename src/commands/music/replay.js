module.exports = class Replay extends Interaction {
    constructor() {
        super({
            name: "replay",
            description: "Repete a faixa atual",
        });
    }

    async exec(int, data) {
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

        let queue = this.client.player.getQueue(int.guild.id);
        if (!queue || !queue.nowPlaying)
            return int.reply({
                content: "Não há música tocando neste servidor!",
                ephemeral: true,
            });

        await queue.seek(0);

        return int.reply({
            content: `${this.client.emotes.get("replay")} Repetindo **${
                queue.nowPlaying.name
            }**!`,
            ephemeral: true,
        });
    }
};
