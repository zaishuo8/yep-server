/**
 * 城市
 * */
import { DataTypes } from 'sequelize';
import { Application } from 'egg';

const { STRING, INTEGER, DATE } = DataTypes;

export interface City {
  id: number;
  name: string;
  img: string;
  cityCode: string;
  createdAt: Date;
  updatedAt: Date;
}

module.exports = (app: Application) => {
  const City = app.model.define('city', {
    id: {
      primaryKey: true,
      type: INTEGER,
    },
    name: {
      type: STRING,
    },
    img: {
      type: STRING,
    },
    cityCode: {
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
  return City;
};
