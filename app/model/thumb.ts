/**
 * 点赞
 * */
import { DataTypes } from 'sequelize';
import { Application } from 'egg';

const { INTEGER, DATE, ENUM } = DataTypes;

export interface Thumb {
  id: number;
  userId: number;
  postingId: number;
  createdAt: Date;
  updatedAt: Date;
}

module.exports = (app: Application) => {
  const Thumb = app.model.define('thumb', {
    id: {
      primaryKey: true,
      type: INTEGER,
    },
    userId: {
      type: INTEGER,
    },
    type: {
      type: ENUM('1', '2'),
    },
    commentId: {
      type: INTEGER,
    },
    postingId: {
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
  return Thumb;
};
