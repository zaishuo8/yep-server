/**
 * 圈子-用户 关系
 * */
import { DataTypes } from 'sequelize';
import { Application } from 'egg';

const { INTEGER, DATE } = DataTypes;

export interface CommunityUser {
  id: number;
  communityId: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

module.exports = (app: Application) => {
  const CommunityUser = app.model.define('community_user', {
    id: {
      primaryKey: true,
      type: INTEGER,
    },
    communityId: {
      type: INTEGER,
    },
    userId: {
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
  return CommunityUser;
};
