/**
 * 活动
 * */
import { DataTypes } from 'sequelize';
import { Application } from 'egg';

const { INTEGER, DATE, TEXT, STRING, ENUM } = DataTypes;

enum ActivityStatus {
  NotStart = '1', // 未开始
  Going = '2', // 进行中
  Done = '3', // 已结束
}

export interface Activity {
  id: number;
  name: string;
  desc: string;
  userId: number;
  communityId: number;
  startTime: Date;
  endTime: Date;
  location: string;
  address: string;
  status: ActivityStatus;
  createdAt: Date;
  updatedAt: Date;
}

module.exports = (app: Application) => {
  const Activity = app.model.define('activity', {
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
    userId: {
      type: INTEGER,
    },
    communityId: {
      type: INTEGER,
    },
    startTime: {
      type: DATE,
    },
    endTime: {
      type: DATE,
    },
    location: {
      type: STRING,
    },
    address: {
      type: TEXT,
    },
    status: {
      type: ENUM('1', '2', '3'),
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
  return Activity;
};
