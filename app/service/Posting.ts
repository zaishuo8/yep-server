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

    const userIds: number[] = [];
    const postingIds: number[] = [];
    const cityIds: number[] = [];
    const communityIds: number[] = [];
    if (list && list.length > 0) {
      for (const posting of list) {
        // 查作者的准备
        userIds.push(posting.userId);
        // 查 照片 的准备
        postingIds.push(posting.id);
        // 查圈子的准备
        communityIds.push(posting.communityId);
        // 查城市的准备
        cityIds.push(posting.cityId);
        // 评论数量
        posting.totalCommentsNum = await this.ctx.model.Comment.count({
          where: {
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
        // 热评
        const hotComments = await this.ctx.model.Comment.findAll({
          attributes: [ 'id', 'userId', 'content', 'postingId' ],
          where: {
            postingId: posting.id,
          },
          limit: 5,
          order: [[ 'createdAt', 'ASC' ]],
          raw: true,
        });
        for (const hotComment of hotComments) {
          hotComment.name = (await this.ctx.app.model.User.findByPk(hotComment.userId, {
            attributes: [ 'name' ],
            raw: true,
          })).name;
        }
        posting.hotComments = hotComments;
      }

      // 查 作者 图片 圈子 城市
      const userInfos = await this.ctx.model.User.findAll({
        attributes: [ 'id', 'name', 'avatars' ],
        where: {
          id: { [Op.in]: userIds },
        },
        raw: true,
      });
      const mediasInfo = await this.ctx.model.Medias.findAll({
        attributes: [ 'type', 'url', 'hostId' ],
        where: {
          host: '1',
          hostId: { [Op.in]: postingIds },
        },
        raw: true,
      });

      const communityInfos = await this.ctx.model.Community.findAll({
        attributes: [ 'id', 'name' ],
        where: {
          id: { [Op.in]: communityIds },
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

      // 先把 各个 infos 变成 map，id 为 key
      const userMap: any = {};
      const mediaMap: any = {};
      const cityMap: any = {};
      const communityMap: any = {};
      if (userInfos && userInfos.length > 0) {
        for (const user of userInfos) {
          userMap[user.id] = user;
        }
      }
      if (mediasInfo && mediasInfo.length > 0) {
        for (const media of mediasInfo) {
          media.url = `${this.ctx.app.config.oss.host}${media.url}`;
          if (mediaMap[media.hostId]) {
            mediaMap[media.hostId].push(media);
          } else {
            mediaMap[media.hostId] = [ media ];
          }
        }
      }
      if (communityInfos && communityInfos.length > 0) {
        for (const community of communityInfos) {
          communityMap[community.id] = community;
        }
      }
      if (cityInfos && cityInfos.length > 0) {
        for (const city of cityInfos) {
          cityMap[city.id] = city;
        }
      }

      // 把 各个 info 连接到 posting 上
      for (const posting of list) {
        const userId = posting.userId;
        if (userId && userMap[userId]) {
          posting.userInfo = userMap[userId];
        }

        posting.medias = mediaMap[posting.id];

        const communityId = posting.communityId;
        if (communityId && communityMap[communityId]) {
          posting.communityInfo = communityMap[communityId];
        }

        const cityId = posting.cityId;
        if (cityId && cityMap[cityId]) {
          posting.cityInfo = cityMap[cityId];
        }
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

  /**
   * 获取单个帖子
   * */
  public async getOnePosting(id: number) {
    const posting = await this.ctx.model.Posting.findByPk(id, { raw: true });
    const { userId, communityId, cityId } = posting;
    // 评论数量
    posting.totalCommentsNum = await this.ctx.model.Comment.count({
      where: {
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
    // 作者
    posting.userInfo = await this.ctx.model.User.findByPk(userId, {
      attributes: [ 'id', 'name', 'avatars' ],
      raw: true,
    });
    // 图片
    const mediasResult = await this.ctx.model.Medias.findAll({
      attributes: [ 'type', 'url', 'hostId' ],
      where: {
        host: '1',
        hostId: id,
      },
      raw: true,
    });
    if (mediasResult && mediasResult.length > 0) {
      mediasResult.forEach(media => (media.url = `${this.ctx.app.config.oss.host}${media.url}`));
    }
    posting.medias = mediasResult;
    // 圈子
    posting.communityInfo = await this.ctx.model.Community.findByPk(communityId, {
      attributes: [ 'id', 'name' ],
      raw: true,
    });
    // 城市
    posting.cityInfo = await this.ctx.model.City.findByPk(cityId, {
      attributes: [ 'id', 'cityCode', 'name' ],
      raw: true,
    });
    // 热评
    const hotComments = await this.ctx.model.Comment.findAll({
      attributes: [ 'id', 'userId', 'content', 'postingId' ],
      where: {
        postingId: posting.id,
      },
      limit: 5,
      order: [[ 'createdAt', 'ASC' ]],
      raw: true,
    });
    for (const hotComment of hotComments) {
      hotComment.name = (await this.ctx.app.model.User.findByPk(hotComment.userId, {
        attributes: [ 'name' ],
        raw: true,
      })).name;
    }
    posting.hotComments = hotComments;
    return posting;
  }

  /**
   * 点赞、取消
   * */
  public async submitThumb(type: string, postingId: number, commentId?: number) {
    const userId = this.ctx.headers['x-application-user-id'];
    try {
      await this.ctx.model.Thumb.create({
        userId, type, postingId, commentId,
      });
    } catch (e) {
      if (e.name === 'SequelizeUniqueConstraintError') {
        // 唯一索引错误，表示已存在，取消点赞
        await this.ctx.model.Thumb.destroy({
          where: {
            userId, type, postingId,
            commentId: commentId || null,
          },
        });
      } else {
        throw e;
      }
    }
  }
}
