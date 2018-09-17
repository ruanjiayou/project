const crypto = require('crypto');

module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define('Book', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      defaultValue: '',
      comments: '书籍名称'
    },
    poster: {
      type: DataTypes.STRING,
      defaultValue: '',
      comments: '书籍封面'
    },
    origin: {
      type: DataTypes.STRING,
      defaultValue: '',
      comments: '书籍原始地址'
    },
    inited: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    tags: {
      type: DataTypes.STRING,
      defaultValue: '[]',
      comments: '书籍标签'
    },
    catalogs: {
      type: DataTypes.STRING,
      defaultValue: '[]',
      comments: '卷数组'
    },
    status: {
      type: DataTypes.ENUM('loading', 'finished'),
      defaultValue: 'loading',
      comments: '书籍状态,loading:连载中,finished:已完结'
    },
    description: {
      type: DataTypes.STRING,
      defaultValue: '',
      comments: '书籍描述'
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comments: '是否审核通过'
    },
    words: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comments: '字数统计'
    },
    comments: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comments: '评论统计'
    },
    collections: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comments: '收藏统计'
    },
    recommends: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comments: '推荐统计'
    },
    scores: {
      type: DataTypes.DECIMAL(10, 1),
      defaultValue: 0,
      comments: '评分统计'
    },
    authorId: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comments: '作者ID'
    },
    authorName: {
      type: DataTypes.STRING,
      allowNull: false,
      comments: '作者名字'
    },
    authorAvatar: {
      type: DataTypes.STRING,
      defaultValue: '',
      comments: '作者头像'
    },
    cId: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comments: '分类ID'
    },
    cName: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comments: '分类名称'
    },
  }, {
      freezeTableName: false,
      underscoredAll: true,
      tableName: 'book',
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