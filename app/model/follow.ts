/**
 * 城市-用户 关系
 * */
import { DataTypes } from 'sequelize';
import { Application } from 'egg';

const { INTEGER, DATE } = DataTypes;

export interface Follow {
  id: number;
  cityId: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

module.exports = (app: Application) => {
  const Follow = app.model.define('follow', {
    id: {
      primaryKey: true,
      type: INTEGER,
    },
    followerUserId: {
      type: INTEGER,
    },
    followedUserId: {
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
  return Follow;
};
