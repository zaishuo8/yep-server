// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportActivity from '../../../app/model/activity';
import ExportActivityUser from '../../../app/model/activity_user';
import ExportCity from '../../../app/model/city';
import ExportCityUser from '../../../app/model/city_user';
import ExportCollection from '../../../app/model/collection';
import ExportComment from '../../../app/model/comment';
import ExportCommunity from '../../../app/model/community';
import ExportCommunityUser from '../../../app/model/community_user';
import ExportFollow from '../../../app/model/follow';
import ExportMedias from '../../../app/model/medias';
import ExportPosting from '../../../app/model/posting';
import ExportThumb from '../../../app/model/thumb';
import ExportUser from '../../../app/model/user';

declare module 'egg' {
  interface IModel {
    Activity: ReturnType<typeof ExportActivity>;
    ActivityUser: ReturnType<typeof ExportActivityUser>;
    City: ReturnType<typeof ExportCity>;
    CityUser: ReturnType<typeof ExportCityUser>;
    Collection: ReturnType<typeof ExportCollection>;
    Comment: ReturnType<typeof ExportComment>;
    Community: ReturnType<typeof ExportCommunity>;
    CommunityUser: ReturnType<typeof ExportCommunityUser>;
    Follow: ReturnType<typeof ExportFollow>;
    Medias: ReturnType<typeof ExportMedias>;
    Posting: ReturnType<typeof ExportPosting>;
    Thumb: ReturnType<typeof ExportThumb>;
    User: ReturnType<typeof ExportUser>;
  }
}
