const crypto = require('crypto');

module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define('Chapter', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    bookId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comments: '书籍id'
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
      comments: '章节标题'
    },
    content: {
      type: DataTypes.STRING,
      allowNull: true,
      comments: '章节内容'
    },
    url: {
      type: DataTypes.STRING
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    words: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comments: '字数统计'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      default: DataTypes.NOW,
      comments: '创建时间'
    }
  }, {
      freezeTableName: false,
      underscoredAll: true,
      tableName: 'chapter',
      charset: 'utf8',
      initialAutoIncrement: 1,
      timezone: '+08:00',
      paranoid: false,
      timestamps: true,
      indexes: []
    });
  // class method

  // 表间的关系
  model.associate = (models) => {

  }
  // 表的初始化数据
  model.seed = async () => {
    const data = [];
    await model.bulkCreate(data);
  }
  // instance method

  return model;
}