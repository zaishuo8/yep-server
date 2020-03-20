/**
 * 用户
 * */
import { DataTypes } from 'sequelize';
import { Application } from 'egg';

const { STRING, INTEGER, DATE } = DataTypes;

export interface User {
  id: number;
  email: string;
  phone: string;
  pwd: string;
  name: string;
  avatars: string;
  createdAt: Date;
  updatedAt: Date;
}

module.exports = (app: Application) => {
  const User = app.model.define('user', {
    id: {
      primaryKey: true,
      type: INTEGER,
    },
    email: {
      type: STRING,
    },
    phone: {
      type: STRING,
    },
    pwd: {
      type: STRING,
    },
    name: {
      type: STRING,
    },
    avatars: {
      type: STRING,
    },
    createdAt: {
      type: DATE,
    },
    updatedAt: {
      type: DATE,
    },
  }, {
    freezeTableName: true,
  });
  return User;
};
