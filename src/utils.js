import randomTextblock from 'random-textblock';

export default {
    randomText(arg) {
        return randomTextblock.getTextBlock({
            minWords: arg.wordsLength,
            maxWords: arg.wordsLength,
            minSentences: (arg.sentencesLength || 1),
            maxSentences: (arg.sentencesLength || 1),
            terminalPunctuation: arg.sentencesLength ? '.' : ' '
        }).trim();
    },
    randomNumber(max) {
        return Math.floor(Math.random() * max);
    },
    transformNumber(num) {
        return (('' + num).length === 1 ? '0' : '') + num;
    },
    replaceDate(date) {
        const currentDate = new Date(date);
        const calendarDate = [
            this.transformNumber(currentDate.getMonth() + 1),
            this.transformNumber(currentDate.getDate()),
            this.transformNumber(currentDate.getFullYear()),

        ].join('/');
        const time = [
            this.transformNumber(currentDate.getHours()),
            this.transformNumber(currentDate.getMinutes())
        ].join(':');

        return `${calendarDate} ${time}`;
    },
    substring(str, len) {
        return (str.length > len)
            ? (str.substring(0, len) + '...')
            : str;
    }
};
