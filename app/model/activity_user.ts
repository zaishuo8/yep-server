/**
 * 活动-用户 关系
 * */
import { DataTypes } from 'sequelize';
import { Application } from 'egg';

const { INTEGER, DATE } = DataTypes;

export interface ActivityUser {
  id: number;
  userId: number;
  activityId: number;
  createdAt: Date;
  updatedAt: Date;
}

module.exports = (app: Application) => {
  const ActivityUser = app.model.define('activity_user', {
    id: {
      primaryKey: true,
      type: INTEGER,
    },
    userId: {
      type: INTEGER,
    },
    activityId: {
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
  return ActivityUser;
};
