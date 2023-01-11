module.exports = class Skip extends Interaction {
    constructor() {
        super({
            name: "skip",
            description: "Pula a faixa atual",
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

        let isAllowed = data.voiceChannels.find((c) => c === channel.id);

        if (data.voiceChannels.length > 0 && !isAllowed) {
            return int.reply({
                content: `${this.client.emotes.get(
                    "nomic"
                )} Você deve estar em um dos canais de voz permitidos para usar este comando!`,
                ephemeral: true,
            });
        }

        let queue = this.client.player.getQueue(int.guild.id);
        if (!queue || !queue.nowPlaying)
            return int.reply({
                content: "Não há música tocando nesta guilda!",
                ephemeral: true,
            });

        let isDJ = data.djRoles.some((r) => int.member._roles.includes(r));
        let members = channel.members.filter((m) => !m.user.bot);

        if (members.size > 1 && !isDJ && !int.member.permissions.has("MANAGE_GUILD")) {
            let required = members.size === 2 ? 2 : Math.ceil(members.size / 2);

            if (queue.skipVotes.includes(int.user.id)) {
                return int.reply({
                    content: "Você já votou para pular a faixa atual!",
                    ephemeral: true,
                });
            }

            queue.skipVotes.push(int.user.id);
            int.reply({
                content: `Você votou para pular a faixa atual! **${queue.skipVotes.length}/${required}**`,
            });

            if (queue.skipVotes.length >= required) {
                queue.skipVotes = [];
                let skipped = queue.skip();

                int.channel.send(
                    `${this.client.emotes.get("skip")} Pulada **${skipped.name}**!`
                );
            }
        } else {
            queue.skipVotes = [];
            let skipped = queue.skip();

            int.reply({
                content: `${this.client.emotes.get("skip")} Pulada **${
                    skipped.name
                }**!`,
                ephemeral: true,
            });
        }
    }
};
