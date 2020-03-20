/**
 * 评论/回复
 * */
import { DataTypes } from 'sequelize';
import { Application } from 'egg';

const { TEXT, INTEGER, DATE, ENUM } = DataTypes;

enum CommentType {
  Comment = '1', // 评论
  Reply = '2', // 回复
}

export interface Comment {
  id: number;
  userId: number;
  type: CommentType;
  postingId: number;
  communityId: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

module.exports = (app: Application) => {
  const Comment = app.model.define('comment', {
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
    postingId: {
      type: INTEGER,
    },
    communityId: {
      type: INTEGER,
    },
    content: {
      type: TEXT,
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
  return Comment;
};
