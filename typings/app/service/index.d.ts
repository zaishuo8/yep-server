// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportCity from '../../../app/service/City';
import ExportCommunity from '../../../app/service/Community';
import ExportPosting from '../../../app/service/Posting';
import ExportTest from '../../../app/service/Test';
import ExportUser from '../../../app/service/User';

declare module 'egg' {
  interface IService {
    city: ExportCity;
    community: ExportCommunity;
    posting: ExportPosting;
    test: ExportTest;
    user: ExportUser;
  }
}
