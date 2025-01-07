import { Sequelize, DataTypes } from "sequelize";

const db = new Sequelize({
    dialect: "mysql",
    host: "localhost",
    username: "root",
    password: "admin24434",
    database: "siakad",
    port: 3306,
});

export default {db, DataTypes}