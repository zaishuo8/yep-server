import { Service } from 'egg';
import { Posting } from '../model/posting';
import { City } from '../model/city';
import { Media, Medias } from '../model/medias';
import { Op } from 'sequelize';
import { CommentType } from '../model/comment';

/**
 * Posting Service
 */
export default class PostingService extends Service {

  /**
   * 发帖
   */
  public async createPosting(
    medias: Media[], content: string, communityId: number, cityCode: string,
    longitude: number, latitude: number, address: string,
  ) {
    const userId = this.ctx.headers['x-application-user-id'];

    let posting: Posting = {
      content, communityId, longitude, latitude, address, userId,
    };

    // 通过 cityCode 找到 cityId
    let cityId: number | undefined;
    if (cityCode) {
      const city: City = await this.ctx.model.City.findOne({
        where: { cityCode },
        raw: true,
      });
      if (city) {
        cityId = city.id;
      }
    }
    if (cityId) {
      posting.cityId = cityId;
    }

    // 先存帖子主体
    const createResult = await this.ctx.model.Posting.create(posting);
    posting = createResult.get({ plain: true });

    // 再存帖子图片视频
    const mediasToCreate: Medias[] = [];

    if (medias && medias.length > 0) {
      for (const media of medias) {
        mediasToCreate.push({
          type: media.type,
          host: '1',
          hostId: posting.id || 0,
          url: media.url,
        } as Medias);
      }
    }

    if (mediasToCreate && mediasToCreate.length > 0) {
      await this.ctx.model.Medias.bulkCreate(mediasToCreate);
    }

  }

  /**
   * 筛选帖子
   * */
  public async getPostings(pageNo: number, pageSize: number, communityId?: number) {
    const userId = this.ctx.headers['x-application-user-id'];

    const where: any = {};
    if (communityId) {
      where.communityId = communityId;
    }

    // 先查帖子主体
    const list = await this.ctx.model.Posting.findAll({
      where,
      offset: pageSize * (pageNo - 1),
      limit: pageSize,
      order: [[ 'createdAt', 'DESC' ]],
      raw: true,
    });

    console.log(list);

    const userIds: number[] = [];
    const postingIds: number[] = [];
    const cityIds: number[] = [];
    if (list && list.length > 0) {
      for (const posting of list) {
        // 查作者的准备
        userIds.push(posting.userId);
        // 查 照片/热评 的准备
        postingIds.push(posting.id);
        // 查城市的准备
        cityIds.push(posting.cityId);
        // 评论数量
        posting.totalCommentsNum = await this.ctx.model.Comment.count({
          where: {
            type: '1',
            postingId: posting.id,
          },
        });
        // 点赞数量
        posting.totalThumbsNum = await this.ctx.model.Thumb.count({
          where: {
            type: '1',
            postingId: posting.id,
          },
        });
        // 是否点赞
        const hasThumb = await this.ctx.model.Thumb.findOne({
          where: {
            type: '1',
            postingId: posting.id,
            userId,
          },
        });
        posting.hasThumb = !!hasThumb;
        // 是否收藏
        const hasCollection = await this.ctx.model.Collection.findOne({
          where: {
            postingId: posting.id,
            userId,
          },
        });
        posting.hasCollection = !!hasCollection;
      }

      // 查 作者 图片 城市 热评
      const userInfos = await this.ctx.model.User.findAll({
        attributes: [ 'id', 'name', 'avatars' ],
        where: {
          id: { [Op.in]: userIds },
        },
        raw: true,
      });
      const mediasInfo = await this.ctx.model.Medias.findAll({
        attributes: [ 'hostId', 'id', 'type', 'url' ],
        where: {
          host: '1',
          hostId: { [Op.in]: postingIds },
        },
        raw: true,
      });
      const cityInfos = await this.ctx.model.City.findAll({
        attributes: [ 'id', 'cityCode', 'name' ],
        where: {
          id: { [Op.in]: cityIds },
        },
        raw: true,
      });
      const hotCommentInfos = await this.ctx.model.Comment.findAll({
        attributes: [ 'id', 'userId', 'content', 'postingId' ],
        where: {
          postingId: { [Op.in]: postingIds },
        },
        limit: 5,
        order: [[ 'createdAt', 'DESC' ]],
        raw: true,
      });

      // 先把 各个 infos 变成 map，id 为 key
      const userMap: any = {};
      const mediaMap: any = {};
      const cityMap: any = {};
      const hotCommentMap: any = {};
      if (userInfos && userInfos.length > 0) {
        for (const user of userInfos) {
          userMap[user.id] = user;
        }
      }
      if (mediasInfo && mediasInfo.length > 0) {
        for (const media of mediasInfo) {
          if (mediaMap[media.hostId]) {
            mediaMap[media.hostId].push(media);
          } else {
            mediaMap[media.hostId] = [ media ];
          }
        }
      }
      if (cityInfos && cityInfos.length > 0) {
        for (const city of cityInfos) {
          cityMap[city.id] = city;
        }
      }
      if (hotCommentInfos && hotCommentInfos.length > 0) {
        for (const hotComment of hotCommentInfos) {
          // 先通过 userId 找到 username
          const commentUser = await this.ctx.model.User.findByPk(hotComment.userId, { raw: true });
          if (commentUser) hotComment.name = commentUser.name;
          if (hotCommentMap[hotComment.postingId]) {
            hotCommentMap[hotComment.postingId].push(hotComment);
          } else {
            hotCommentMap[hotComment.postingId] = [ hotComment ];
          }
        }
      }

      console.log(hotCommentInfos);
      console.log(hotCommentMap);

      // 把 各个 info 连接到 posting 上
      for (const posting of list) {
        const userId = posting.userId;
        if (userId && userMap[userId]) {
          posting.userInfo = userMap[userId];
        }

        posting.medias = mediaMap[posting.id];

        const cityId = posting.cityId;
        if (cityId && cityMap[cityId]) {
          posting.cityInfo = cityMap[cityId];
        }

        posting.hotComments = hotCommentMap[posting.id];
      }
    }

    return {
      pageNo,
      pageSize,
      hasNext: list.length === pageSize,
      list,
    };
  }

  /**
   * 评论 回复
   * */
  public async submitComment(type: CommentType, postingId: number, content: string, commentId?: number) {
    const userId = this.ctx.headers['x-application-user-id'];
    await this.ctx.model.Comment.create({
      userId, type, postingId, content, commentId,
    });
  }
}
