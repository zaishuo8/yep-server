// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportCity from '../../../app/controller/city';
import ExportCommunity from '../../../app/controller/community';
import ExportHome from '../../../app/controller/home';
import ExportPosting from '../../../app/controller/posting';
import ExportUser from '../../../app/controller/user';

declare module 'egg' {
  interface IController {
    city: ExportCity;
    community: ExportCommunity;
    home: ExportHome;
    posting: ExportPosting;
    user: ExportUser;
  }
}
