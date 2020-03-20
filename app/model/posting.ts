/**
 * 帖子
 * */
import { DataTypes } from 'sequelize';
import { Application } from 'egg';

const { INTEGER, DATE, TEXT, DECIMAL } = DataTypes;

export interface Posting {
  id: number;
  userId: number;
  communityId: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

module.exports = (app: Application) => {
  const Posting = app.model.define('posting', {
    id: {
      primaryKey: true,
      type: INTEGER,
    },
    userId: {
      type: INTEGER,
    },
    communityId: {
      type: INTEGER,
    },
    content: {
      type: TEXT,
    },
    longitude: {
      type: DECIMAL,
    },
    latitude: {
      type: DECIMAL,
    },
    address: {
      type: TEXT,
    },
    cityId: {
      type: INTEGER,
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
  return Posting;
};
