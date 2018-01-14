module.exports = function (sequelize, TYPE) {
    const model = sequelize.define('images',
        {
            id: {
                type: TYPE.BIGINT,
                autoIncrement: true,
                primaryKey: true
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
        // model.belongsTo(models.User, {
        //     foreignKey: 'authorId',
        //     targetKey: 'id'
        // });
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
    return model;
};