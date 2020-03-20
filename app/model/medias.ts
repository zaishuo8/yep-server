/**
 * 活动-用户 关系
 * */
import { DataTypes } from 'sequelize';
import { Application } from 'egg';

const { INTEGER, DATE, ENUM, STRING } = DataTypes;

enum MediasType {
  Image = '1', // 图片
  Video = '2', // 视频
}

enum MediasHost {
  Posting = '1', // 帖子
  Activity = '2', // 活动
}

export interface Medias {
  id: number;
  type: MediasType;
  host: MediasHost;
  hostId: number;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

module.exports = (app: Application) => {
  const Medias = app.model.define('medias', {
    id: {
      primaryKey: true,
      type: INTEGER,
    },
    type: {
      type: ENUM('1', '2'),
    },
    host: {
      type: ENUM('1', '2'),
    },
    hostId: {
      type: INTEGER,
    },
    url: {
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
  return Medias;
};
