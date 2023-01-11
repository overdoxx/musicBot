module.exports = class Pause extends Interaction {
    constructor() {
        super({
            name: "pause",
            description: "Alterna o estado de pausa do reprodutor de música",
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

        let hasQueue = this.client.player.hasQueue(int.guild.id);
        if (!hasQueue)
            return int.reply({
                content: "Não há música tocando nesta guilda!",
                ephemeral: true,
            });

        let queue = this.client.player.getQueue(int.guild.id);

        if (queue.paused) {
            queue.setPaused(false);

            return int.reply({
                content: `${this.client.emotes.get(
                    "resume"
                )} Retomou o reprodutor de música!`,
                ephemeral: true,
            });
        } else {
            queue.setPaused(true);
            return int.reply({
                content: `${this.client.emotes.get("pause")} Pausou o reprodutor de música!`,
                ephemeral: true,
            });
        }
    }
};
