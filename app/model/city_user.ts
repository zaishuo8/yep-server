/**
 * 城市-用户 关系
 * */
import { DataTypes } from 'sequelize';
import { Application } from 'egg';

const { INTEGER, DATE } = DataTypes;

export interface CityUser {
  id?: number;
  cityId: number;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

module.exports = (app: Application) => {
  const CityUser = app.model.define('city_user', {
    id: {
      primaryKey: true,
      type: INTEGER,
    },
    cityId: {
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
  return CityUser;
};
