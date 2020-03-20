/**
 * 收藏
 * */
import { DataTypes } from 'sequelize';
import { Application } from 'egg';

const { INTEGER, DATE } = DataTypes;

export interface Collection {
  id: number;
  userId: number;
  postingId: number;
  createdAt: Date;
  updatedAt: Date;
}

module.exports = (app: Application) => {
  const Collection = app.model.define('collection', {
    id: {
      primaryKey: true,
      type: INTEGER,
    },
    userId: {
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
  return Collection;
};
