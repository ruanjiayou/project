module.exports = function (sequelize, TYPE) {
    const model = sequelize.define('Image',
        {
            id: {
                type: TYPE.BIGINT,
                autoIncrement: true,
                primaryKey: true
            },
            uid: {
                type: TYPE.BIGINT,
                allowNull: false
            },
            filename: {
                type: TYPE.STRING,
                allowNull: false,
                comment: ''
            },
            path: {
                type: TYPE.STRING,
                allowNull: false,
                comment: ''
            },
            size: {
                type: TYPE.BIGINT,
                allowNull: true,
                default: 0,
                comment: ''
            },
            md5: {
                type: TYPE.STRING,
                allowNull: true,
                comment: ''
            },
            time: {
                type: TYPE.DATE,
                allowNull: false,
                comment: ''
            }
        }, {
            charset: 'utf8',
            paranoid: false,
            timestamps: false,
            //deletedAt: false,
            timezone: '+08:00',
            //engine: 'MYISAM', change the database engine, e.g. to MyISAM. InnoDB is the default.
            indexes: [
                // {
                //     fields: ['authorId'],
                //     name: 'authorId'
                // }
            ],
            freezeTableName: true,
            tableName: 'images',
            unique: true,
            initialAutoIncrement: 1000000,
            getterMethods: {},
            setterMethods: {},
            // defaultScope: {
            //     where: {
            //         isApproved: true
            //     }
            // },
            scopes: {
                // includeAuthor: function () {
                //     return {
                //         include: [
                //             {
                //                 model: sequelize.models.User,
                //                 attributes: ['id', 'name'],
                //                 required: false
                //             }
                //         ]
                //     };
                // }
            },
        });
    // 类级方法

    // 实例方法

    model.associate = function (models) {
        model.belongsTo(models.User, {
            foreignKey: 'uid',
            targetKey: 'id'
        });
        // model.belongsTo(models.Catalog, {
        //     foreignKey: 'id',
        //     otherKey: 'bookId',
        //     through: {
        //         model: models.BookCatelogMap
        //     }
        // });
        // model.hasMany(models.Chapter, {
        //     foreignKey: 'id',
        //     targetKey: 'bookId',
        // });
    };
    model.initialize = function () {
        const data = [
            {
                filename: 'test1.png',
                path: 'upload/images/',
                size: 123456,
                uid: 1,
                md5: '100c2c9d9937d117b8e398a1ecd852222017c2d6',
                time: Date.now()
            },
            {
                filename: 'test2.png',
                path: 'upload/images/',
                size: 123457,
                uid: 1,
                md5: '100c2c9d9937d117b8e398a1ecd852222017c2d6',
                time: Date.now()
            }
        ];
        return model.bulkCreate(data, { return: true });
    };
    return model;
};