import database from '../config/database.js';

const MStudent = database.db.define('student', {
    id: {
        type: database.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    nisn: {
        type: database.DataTypes.STRING(10),
        allowNull: false,
        unique: true
    },

    avatar : {
        type: database.DataTypes.STRING(128),
        allowNull: true
    },

    name: {
        type: database.DataTypes.STRING,
        allowNull: false
    },

    birth_place: {
        type: database.DataTypes.STRING(128),
        allowNull: false
    },

    birth_date: {
        type: database.DataTypes.DATE,
        allowNull: false
    },

    gender: {
        type: database.DataTypes.STRING(12),
        allowNull: false
    },

    religion: {
        type: database.DataTypes.STRING(32),
        allowNull: false
    },

    address: {
        type: database.DataTypes.TEXT,
        allowNull: false
    }
}, {
    freezeTableName: true,
    underscored: true
});

export default MStudent