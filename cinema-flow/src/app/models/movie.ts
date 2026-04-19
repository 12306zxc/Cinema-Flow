export interface Movie {
  /**
   * 电影ID
   */
  id: number;

  /**
   * 电影名
   */
  title: string;

  /**
   * 上映日期
   */
  releaseDate: Date;

  /**
   * 导演
   */
  director: string;
  /**
   * 导演ID
   */
  directorId: number;
  /**
   * 电影类型
   */
  genre: string;

  /**
   * 评分 (0-10)
   */
  rating: number;

  /**
   * 是否已观影
   */
  isWatched: boolean;

  /**
   * 海报 URL
   */
  posterUrl: string;

  /**
   * 电影简介/剧情介绍
   */
  description?: string;

  /**
   * 主演
   */
  actors?: string;
  /**
   * 状态
   */
  status: 'showing' | 'coming' | 'ended' | 'archived';

  /**
   * 时长（分钟）
   */
  duration?: number;

  /**
   * 类型/标签
   */
  tags?: string[];
  /**
   * 上映年份
   */
  releaseYear: number;
}