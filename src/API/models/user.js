module.exports = function (sequelize, TYPE) {
    const model = sequelize.define('User',
        {
            id: {
                type: TYPE.BIGINT,
                autoIncrement: true,
                primaryKey: true
            },
            roleId: {
                type: TYPE.BIGINT,
                allowNull: false
            },
            email: {
                type: TYPE.STRING,
                allowNull: false,
                defaultValue: ''
            },
            name: {
                type: TYPE.STRING,
                allowNull: false,
                defaultValue: ''
            },
            password: {
                type: TYPE.STRING,
                allowNull: false,
                defaultValue: '123456'
            },
            avatar: {
                type: TYPE.STRING,
                allowNull: true,
                comment: '用户的头像'
            },
            description: {
                type: TYPE.TEXT,
                allowNull: true,
                comment: '自我介绍'
            },
            status: {
                type: TYPE.ENUM('activing', 'using', 'destroy'),
                allowNull: false,
                defaultValue: 'using'
            },
            country: {
                type: TYPE.STRING,
                allowNull: true
            },
            isApproved: {
                type: TYPE.BOOLEAN,
                allowNull: false,
                defaultValue: true
            }
        }, {
            charset: 'utf8',
            //paranoid: true,
            timestamp: true,
            deletedAt: false,
            timezone: '+08:00',
            //engine: 'MYISAM',
            indexes: [
                {
                    fields: ['email'],
                    name: 'email'
                }
            ],
            freezeTableName: true,
            getterMethods: {

            },
            setterMethods: {},
            defaultScope: {},
            scopes: {

            },
        });
    // 类级方法

    // 实例方法

    model.associate = function (models) {
        // model.belongsTo(models.Role, {
        //     foreignKey: 'id',
        //     otherKey: 'userId',
        //     though: {
        //         model: models.UserRoleMap
        //     }
        // });
        //model.hasMany(models.Comment);
        //model.hasMany(models.Book);
    };
    model.initialize = function () {
        // const data = [
        //     {
        //         id: 1,
        //         email: '123456789@qq.com',
        //         name: '阮家友',
        //         roleId: 1,
        //         password: '100c2c9d9937d117b8e398a1ecd852222017c2d6'
        //     }
        // ];
        // return model.bulkCreate(data, { return: true });
    };
    return model;
};