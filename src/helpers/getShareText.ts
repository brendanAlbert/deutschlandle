
const green = '🟩';
const yellow = '🟨';
const white = '⬜';

const directions = {
    n: '⬆️',
    ne: '↗️',
    e: '➡️',
    se: '↘️',
    s: '⬇️',
    sw: '↙️',
    w: '⬅️',
    nw: '↖️',
    party: '🎉'
}

const getShareText = (numberArray: number[][]) => {
    let emojiStr = '';
    numberArray.forEach(arr => {
        let emojiRow: string[] = [];
        arr.forEach(num => {
            if (num === 2) emojiRow.push(green);
            else if (num === 1) emojiRow.push(yellow);
            else if (num === 0) emojiRow.push(white);
            else {
                switch (num) {
                    case 3:
                    case 4:
                        emojiRow.push(directions['s']);
                        break;
                    case 5:
                    case 6:
                        emojiRow.push(directions['se']);
                        break;
                    case 7:
                    case 8:
                        emojiRow.push(directions['e']);
                        break;
                    case 9:
                    case 10:
                        emojiRow.push(directions['ne']);
                        break;
                    case 11:
                    case 12:
                        emojiRow.push(directions['n']);
                        break;
                    case 13:
                    case 14:
                        emojiRow.push(directions['nw']);
                        break;
                    case 15:
                    case 16:
                        emojiRow.push(directions['w']);
                        break;
                    case 17:
                    case 18:
                        emojiRow.push(directions['sw']);
                        break;
                    case 19:
                        emojiRow.push(directions['party']);
                        break;
                }
            }
        })
        emojiStr += emojiRow.join('') + '\n';
    })
    return emojiStr;
}

export { getShareText }
