import utils from './utils';

export default {
    initForDemo() {
        this.drop('widgets');

        /* create 20 random ads */
        for (let i = 0; i < 20; i++) {
            this.set('widgets', {
                [this.uniq()]: createRandomWidget(i + 1)
            });
        }
    }

};

const numbers = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
function createRandomWidget(id) {
    let i = utils.randomNumber(numbers.length);
    let randomTemplate = [];
    let randomTemplateContent = '';

    for (; i >= 0; i--) {
        randomTemplate.push(`<div class='editable'> ${numbers[i]} </div>`);
    }

    randomTemplateContent = randomTemplate.reverse().join('');

    return {
        id: id,
        name: utils.randomText({
            wordsLength: 1
        }),
        template: `<div class='template'>${randomTemplateContent}</div>`,
        modified: Date.now() - (utils.randomNumber(1e8) + 1e8) // now - (1...2) days
    };
}
