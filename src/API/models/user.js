// libs
const authHelper = require('../libs/').auth;

module.exports = function (sequelize, TYPE) {
    const model = sequelize.define('User',
        {
            id: {
                type: TYPE.BIGINT,
                autoIncrement: true,
                primaryKey: true
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
                // 123456 -> md5 -> sha1+salt
                defaultValue: '100c2c9d9937d117b8e398a1ecd852222017c2d6'
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
                defaultValue: 'activing'
            },
            country: {
                type: TYPE.STRING,
                allowNull: true
            },
            gender: {
                type: TYPE.ENUM('f', 'm'),
                allowNull: false,
                defaultValue: 'm'
            },
            phone: {
                type: TYPE.STRING,
                allowNull: true
            },
            birth: {
                type: TYPE.DATE,
                allowNull: false
            },
            isApproved: {
                type: TYPE.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
        }, {
            charset: 'utf8',
            //paranoid: true,
            timestamps: true,
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
            hooks: {
                beforeCreate(instance, options) {
                    instance.password = authHelper.encrypt(instance.password);
                },
                beforeUpdate(instance, options) {
                    if (options.fields.includes('password')) {
                        instance.password = authHelper.encrypt(instance.password);
                    }
                }
            },
            getterMethods: {

            },
            setterMethods: {},
            defaultScope: {},
            scopes: {
                includeImages: {
                    include: [
                        {
                            model: sequelize.models.Image
                        }
                    ]
                }
            },
        });
    // 类级方法
    model.prototype.comparePassword = function (password) {
        return authHelper.encrypt(password).toUpperCase() === this.password.toUpperCase();
    };

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
        model.hasMany(models.Image, {
            foreignKey: 'uid',
            targetKey: 'id'
        });
    };
    model.initialize = function () {
        const data = [
            {
                id: 1,
                email: '1439120442@qq.com',
                name: '阮家友',
                status: 'using',
                password: '100c2c9d9937d117b8e398a1ecd852222017c2d6'
            }
        ];
        return model.bulkCreate(data, { return: true });
    };
    model.prototype.toJSON = function () {
        const res = this.dataValues;
        //res.password = authHelper.encrypt(res.password);
        delete res.password;
        if (res.avatar === null) {
            res.avatar = '/images/default-avatar.png';
        }
    };
    return model;
};