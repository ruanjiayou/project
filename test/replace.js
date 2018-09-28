require('../config.project');
const models = require(MODEL_PATH + '/index');
let id = 0, end = false;

async function one(bookId) {
  let chapter = await models.Chapter.findOne({ attributes: ['id', 'bookId', 'content'], where: { bookId: bookId, id: { [models.Op.gt]: id } } });
  if (chapter) {
    id = chapter.id;
    let content = chapter.content;
    content = content.replace(/笔.趣.阁[wｗ][wｗ][wｗ].[bｂ][iｉ][qｑ][uｕ][gｇ][eｅ].[iｉ][nｎ][fｆ][oｏ]/g, '');
    await chapter.update({ content: content });
    console.log('replaced: ' + chapter.id);
  } else {
    end = true;
  }
}

const start = async (bookId) => {
  while (end === false) {
    await one(bookId);
  }
};
start(7275).then(() => {
  console.log('end');
  process.exit(0);
});