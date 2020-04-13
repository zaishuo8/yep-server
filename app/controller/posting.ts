import { Controller } from 'egg';

export default class PostingController extends Controller {

  /**
   * post
   * body: {
   *   medias: {type: 1照片/2视频, url: string}[],
   *   content: string,
   *   communityId: number,
   *   cityCode?: number,
   *   longitude?: number,
   *   latitude?: number,
   *   address?: string
   * }
   * return: boolean
   * */
  public async submitPosting() {
    const { ctx } = this;

    ctx.validate({
      medias: {
        type: 'array',
        itemType: 'object',
        rule: {
          type: { type: 'enum', values: [ '1', '2' ] },
          url: { type: 'string' },
        },
      },
      content: { type: 'string', required: false },
      communityId: { type: 'number' },
      cityCode: { type: 'string', required: false },
      longitude: { type: 'number', required: false },
      latitude: { type: 'number', required: false },
      address: { type: 'string', required: false },
    });

    const { medias, content, communityId, cityCode, longitude, latitude, address } = ctx.request.body;

    await ctx.service.posting.createPosting(medias, content, communityId, cityCode, longitude, latitude, address);

    ctx.body = true;
  }

  /**
   * get
   * query: {
   *   communityId?: number  // 不传返回用户关注圈子的帖子，穿了返回该圈子的帖子
   *   pageNo: number
   *   pageSize: number
   * }
   * return: {
   *   pageNo: number,
   *   pageSize: number,
   *   hasNext: boolean,
   *   list: {
   *     id: number,
   *     author: {avatars: string, name: string},
   *     medias: {type: 1照片/2视频, url: string}[],
   *     content: string,
   *     longitude: number,
   *     latitude: number,
   *     address: string,
   *     totalCommentsNum: number,
   *     totalThumbsNum: number,
   *     hasThumb: boolean,
   *     hasCollection: boolean,
   *     cityInfo: {cityId: number, cityCode: string, cityName: string},
   *     hotComments: {
   *       id: number,
   *       name: string,
   *       content: string,
   *     }[]
   *   }[]
   * }
   * */
  public async getPostings() {
    const { ctx } = this;

    // query 是 string 的，number 校验不能通过
    ctx.validate({
      pageNo: { type: 'string' },
      pageSize: { type: 'string' },
      communityId: { type: 'string', required: false },
    }, ctx.query);

    const { pageNo, pageSize, communityId } = ctx.query;

    ctx.body = await ctx.service.posting.getPostings(parseInt(pageNo), parseInt(pageSize), parseInt(communityId));
  }

  /**
   * 获取单个帖子
   * get
   * query: {id: number}
   * return: Posting
   * */
  public async getOnePosting() {
    const { ctx } = this;

    // query 是 string 的，number 校验不能通过
    ctx.validate({
      postingId: { type: 'string' },
    }, ctx.query);

    const { postingId } = ctx.query;

    ctx.body = await ctx.service.posting.getOnePosting(parseInt(postingId));
  }

  /**
   * post
   * body: {
   *   type: 1 | 2, // 1:帖子的评论(postingId 必传) 2:评论的回复(commentId 必传)
   *   postingId: number, // 必传，被回复的帖子，当回复评论时也需要传
   *   commentId?: number, // 被回复的评论/回复
   *   content: string, // 内容
   * }
   * */
  public async submitComment() {
    const { ctx } = this;

    ctx.validate({
      type: { type: 'enum', values: [ '1', '2' ] },
      postingId: { type: 'number' },
      commentId: { type: 'number', required: false },
      content: { type: 'string' },
    });

    const { type, postingId, content, commentId } = ctx.request.body;

    await ctx.service.posting.submitComment(type, postingId, content, commentId);

    ctx.body = true;
  }

  /**
   * get
   * query: {
   *   type: 1 | 2, // 1:帖子的评论(postingId 必传) 2:评论的回复(commentId 必传)
   *   postingId: number, // 查帖子的评价
   *   commentId?: number, // 查评价的回复 (类似虎扑的评价)
   *   pageNo: number,
   *   pageSize: number,
   * }
   * return: {
   *   pageNo: number,
   *   pageSize: number,
   *   hasNext: boolean,
   *   list: {
   *     id: number,
   *     type: 1 | 2,
   *     userId: number, // 评论/回复 人 id
   *     userName: string, // 评论/回复 人
   *     content: string, // 内容
   *     totalCommentsNum: number, // 评论的评论数量
   *     totalThumbsNum: number, // 评论的点赞数量
   *     hasThumb: boolean,  // 是否点赞品论
   *     createdAt: number, // 评论/回复 时间
   *     // 当这条回复的 type 是 2 的时候，找到被这条回复的内容
   *     replied?: {
   *       repliedId: number,
   *       repliedName: string,
   *       repliedContent: string,
   *     }
   *   }[]
   * }[]
   * */
  public async getComments() {
    return null;
  }

  /**
   * 点赞/取消
   * post
   * body: {type: '1'|'2', postingId: number, commentId: number}
   * return: boolean
   * */
  public async submitThumb() {
    const { ctx } = this;

    ctx.validate({
      type: { type: 'enum', values: [ '1', '2' ] },
      postingId: { type: 'number' },
      commentId: { type: 'number', required: false },
    });

    const { type, postingId, commentId } = ctx.request.body;

    await ctx.service.posting.submitThumb(type, postingId, commentId);

    ctx.body = true;
  }
}
