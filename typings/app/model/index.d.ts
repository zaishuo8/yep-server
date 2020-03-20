// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportActivity from '../../../app/model/activity';
import ExportActivityUser from '../../../app/model/activity_user';
import ExportCollection from '../../../app/model/collection';
import ExportComment from '../../../app/model/comment';
import ExportCommunity from '../../../app/model/community';
import ExportCommunityUser from '../../../app/model/community_user';
import ExportMedias from '../../../app/model/medias';
import ExportPosting from '../../../app/model/posting';
import ExportThumb from '../../../app/model/thumb';
import ExportUser from '../../../app/model/user';

declare module 'egg' {
  interface IModel {
    Activity: ReturnType<typeof ExportActivity>;
    ActivityUser: ReturnType<typeof ExportActivityUser>;
    Collection: ReturnType<typeof ExportCollection>;
    Comment: ReturnType<typeof ExportComment>;
    Community: ReturnType<typeof ExportCommunity>;
    CommunityUser: ReturnType<typeof ExportCommunityUser>;
    Medias: ReturnType<typeof ExportMedias>;
    Posting: ReturnType<typeof ExportPosting>;
    Thumb: ReturnType<typeof ExportThumb>;
    User: ReturnType<typeof ExportUser>;
  }
}
