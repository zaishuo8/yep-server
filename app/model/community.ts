/**
 * 圈子
 * */
import { DataTypes } from 'sequelize';
import { Application } from 'egg';

const { STRING, INTEGER, DATE, TEXT } = DataTypes;

export interface Community {
  id: number;
  name: string;
  desc: string;
  img: string;
  createdAt: Date;
  updatedAt: Date;
}

module.exports = (app: Application) => {
  const Community = app.model.define('community', {
    id: {
      primaryKey: true,
      type: INTEGER,
    },
    name: {
      type: STRING,
    },
    desc: {
      type: TEXT,
    },
    img: {
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
  return Community;
};
