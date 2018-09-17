const crypto = require('crypto');

module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define('Catalog', {
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
    cataSort: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comments: '卷序号'
    },
    cataName: {
      type: DataTypes.STRING,
      allowNull: true,
      comments: '卷名称'
    },
    chapterId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comments: '章节id'
    },
    chapterTitle: {
      type: DataTypes.STRING,
      allowNull: true,
      comments: '章节标题'
    }
  }, {
      freezeTableName: false,
      underscoredAll: true,
      tableName: 'catalog',
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