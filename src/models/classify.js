const crypto = require('crypto');

module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define('Classify', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
      comments: '名字'
    },
    pid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comments: '父id'
    }
  }, {
      freezeTableName: false,
      underscoredAll: true,
      tableName: 'classify',
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