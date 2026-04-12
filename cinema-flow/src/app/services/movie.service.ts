import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { delay, map, tap, catchError } from 'rxjs/operators';
import { Movie } from '../models/movie';
import { MessageService } from './message.service';
import { LoggerService } from './logger.service';

/**
 * MovieService - 电影数据服务
 *
 * 功能：管理电影数据的增删改查操作
 * 特性：
 * 1. 所有操作通过LoggerService记录日志，确保数据流可追溯
 * 2. 使用localStorage实现数据持久化，确保刷新页面后数据不丢失
 * 3. 支持RxJS Observable模式，提供响应式数据访问
 * 4. 使用BehaviorSubject实现数据实时更新
 */
@Injectable({
  providedIn: 'root'
})
export class MovieService {
  // 私有数据存储 - 组件禁止直接访问
  private movies: Movie[] = [];
  // 本地存储键名
  private readonly STORAGE_KEY = 'cinema-flow-movies';
  // BehaviorSubject用于实现数据实时更新
  private moviesSubject = new BehaviorSubject<Movie[]>([]);
  
  /**
   * 构造函数注入 LoggerService 并初始化数据
   */
  constructor(private logger: LoggerService) {
    this.initializeData();
  }

  /**
   * 初始化数据
   * 从localStorage加载数据，若不存在则初始化默认mock数据
   */
  private initializeData(): void {
    try {
      // 从localStorage读取数据
      const storedData = localStorage.getItem(this.STORAGE_KEY);
      if (storedData) {
        // 解析JSON数据
        const parsedData = JSON.parse(storedData);
        // 处理日期字段，确保releaseDate为Date类型
        this.movies = parsedData.map((movie: any) => ({
          ...movie,
          releaseDate: new Date(movie.releaseDate)
        }));
        this.logger.log(`从本地存储加载电影数据，共 ${this.movies.length} 条`);
      } else {
        // 初始化默认mock数据
        this.initializeMockData();
        this.logger.log('本地存储无数据，初始化默认电影数据');
      }
    } catch (error) {
      // 解析错误时初始化默认数据
      this.logger.log('本地存储数据解析失败，初始化默认电影数据');
      this.initializeMockData();
    }
    // 通知所有订阅者数据已更新
    this.moviesSubject.next(this.movies);
  }

  /**
   * 初始化默认mock数据
   */
  private initializeMockData(): void {
    this.movies = [
      {
        id: 1,
        status: 'showing',
        title: '星际穿越',
        releaseDate: new Date(2014, 10, 7),
        director: '克里斯托弗·诺兰',
        rating: 9.3,
        isWatched: true,
        posterUrl: 'assets/posters/interstellar.jpg',
        description: '在不久的将来，地球气候已经不适合粮食生长，水资源枯竭，饥荒肆掠，人类面临着灭绝的威胁。一组探险家利用他们针对虫洞的新发现，超越人类对于太空旅行的极限，在广袤的宇宙中进行星际航行，寻找人类的新家园。',
        actors: '马修·麦康纳, 安妮·海瑟薇, 杰西卡·查斯坦',
        duration: 169,
        tags: ['科幻', '冒险', '剧情']
      },
      {
        id: 2,
        status: 'showing',
        title: '泰坦尼克号',
        releaseDate: new Date(1997, 11, 19),
        director: '詹姆斯·卡梅隆',
        rating: 9.4,
        isWatched: true,
        posterUrl: 'https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg',
        description: '1912年4月10日，号称 "世界工业史上的奇迹" 的豪华客轮泰坦尼克号开始了自己的处女航，从英国的南安普顿出发驶往美国纽约。富家少女罗丝与母亲及未婚夫卡尔坐上了头等舱；另一边，放荡不羁的少年画家杰克也在码头的一场赌博中赢得了下等舱的船票。',
        actors: '莱昂纳多·迪卡普里奥, 凯特·温丝莱特, 比利·赞恩',
        duration: 194,
        tags: ['爱情', '灾难', '剧情']
      },
      {
        id: 3,
        status: 'showing',
        title: '盗梦空间',
        releaseDate: new Date(2010, 7, 13),
        director: '克里斯托弗·诺兰',
        rating: 9.3,
        isWatched: true,
        posterUrl: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
        description: '道姆·柯布是一位经验老道的窃贼，他在这一行中算得上是最厉害的，因为他能够潜入人们精神最为脆弱的梦境中，窃取潜意识中有价值的秘密。柯布这一罕见的技能使他成为企业间谍活动中令人垂涎的对象，但这也让他成为了国际逃犯。',
        actors: '莱昂纳多·迪卡普里奥, 约瑟夫·高登-莱维特, 艾伦·佩吉',
        duration: 148,
        tags: ['科幻', '动作', '悬疑']
      },
      {
        id: 4,
        status: 'showing',
        title: '哪吒之魔童降世',
        releaseDate: new Date(2019, 6, 26),
        director: '饺子',
        rating: 8.4,
        isWatched: false,
        posterUrl: 'assets/posters/nezha.jpg',
        description: '天地灵气孕育出一颗能量巨大的混元珠，元始天尊将混元珠提炼成灵珠和魔丸，灵珠投胎为人，助周伐纣时可堪大用；而魔丸则会诞出魔王，为祸人间。元始天尊启动了天劫咒语，3年后天雷将会降临，摧毁魔丸。',
        actors: '吕艳婷, 囧森瑟夫, 瀚墨',
        duration: 110,
        tags: ['动画', '奇幻', '喜剧']
      },
      {
        id: 5,
        status: 'showing',
        title: '肖申克的救赎',
        releaseDate: new Date(1994, 9, 14),
        director: '弗兰克·德拉邦特',
        rating: 9.7,
        isWatched: true,
        posterUrl: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
        description: '20世纪40年代末，小有成就的青年银行家安迪因涉嫌杀害妻子及她的情人而锒铛入狱。在这座名为肖申克的监狱内，希望似乎虚无缥缈，终身监禁的惩罚无疑注定了安迪接下来灰暗绝望的人生。',
        actors: '蒂姆·罗宾斯, 摩根·弗里曼, 鲍勃·冈顿',
        duration: 142,
        tags: ['剧情', '犯罪']
      },
      {
        id: 6,
        status: 'showing',
        title: '流浪地球2',
        releaseDate: new Date(2023, 0, 22),
        director: '郭帆',
        rating: 8.3,
        isWatched: false,
        posterUrl: 'assets/posters/wandering_earth2.jpg',
        description: '太阳即将毁灭，人类在地球表面建造出巨大的推进器，寻找新的家园。然而宇宙之路危机四伏，为了拯救地球，流浪地球时代的年轻人再次挺身而出，展开争分夺秒的生死之战。',
        actors: '吴京, 刘德华, 李雪健',
        duration: 173,
        tags: ['科幻', '冒险', '灾难']
      }
    ];
    // 同步到本地存储
    this.syncToLocalStorage();
    // 通知所有订阅者数据已更新
    this.moviesSubject.next(this.movies);
  }

  /**
   * 同步数据到本地存储
   */
  private syncToLocalStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.movies));
      this.logger.log('电影数据已同步到本地存储');
    } catch (error) {
      this.logger.log('本地存储同步失败');
    }
  }

  /**
   * 获取所有电影
   * @returns Observable<Movie[]> 电影数组的 Observable
   */
  getMovies(): Observable<Movie[]> {
    this.logger.log('获取全部电影列表');
    return this.moviesSubject.asObservable().pipe(
      delay(200),
      tap(list => this.logger.log(`已加载 ${list.length} 部电影`)),
      catchError(error => {
        this.logger.log(`加载电影列表失败: ${error.message || error}`);
        return of([]); // 降级为空列表
      })
    );
  }

  /**
   * 根据 ID 获取电影
   * @param id 电影ID
   * @returns Observable<Movie | undefined> 匹配的电影或 undefined 的 Observable
   */
  getMovieById(id: number): Observable<Movie | undefined> {
    this.logger.log(`查询ID为${id}的电影`);
    return of(this.movies.find(movie => movie.id === id)).pipe(
      delay(150),
      catchError(error => {
        this.logger.log(`查询电影失败: ${error.message || error}`);
        return of(undefined); // 降级为undefined
      })
    );
  }

  /**
   * 添加新电影
   * 自动生成自增ID，将新电影添加到数组中
   * @param movie 不包含id的电影对象
   * @returns Observable<Movie> 新增的电影对象的 Observable
   */
  addMovie(movie: Omit<Movie, 'id'>): Observable<Movie> {
    try {
      // 计算新的自增ID：取当前最大ID+1，如果没有电影则从1开始
      const newId = Math.max(...this.movies.map(m => m.id), 0) + 1;
      // 创建新电影对象
      const createdMovie = { ...movie, id: newId };
      // 将新电影添加到数组
      this.movies.push(createdMovie);
      // 同步到本地存储
      this.syncToLocalStorage();
      // 通知所有订阅者数据已更新
      this.moviesSubject.next(this.movies);
      // 记录日志
      this.logger.log(`新增电影：${movie.title}（ID:${newId}）`);
      return of(createdMovie).pipe(
        delay(150),
        catchError(error => {
          const errorMessage = error instanceof Error ? error.message : String(error);
          this.logger.log(`添加电影失败: ${errorMessage}`);
          throw error; // 重新抛出错误
        })
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.log(`添加电影失败: ${errorMessage}`);
      return throwError(() => error);
    }
  }

  /**
   * 删除电影
   * 根据ID删除对应的电影
   * @param id 要删除的电影ID
   * @returns Observable<boolean> 删除成功返回true，失败返回false的 Observable
   */
  deleteMovie(id: number): Observable<boolean> {
    try {
      // 查找电影在数组中的索引
      const index = this.movies.findIndex(m => m.id === id);
      let success = false;
      if (index > -1) {
        // 找到后使用splice删除
        this.movies.splice(index, 1);
        // 同步到本地存储
        this.syncToLocalStorage();
        // 通知所有订阅者数据已更新
        this.moviesSubject.next(this.movies);
        // 记录成功日志
        this.logger.log(`删除ID为${id}的电影，操作成功`);
        success = true;
      } else {
        // 记录失败日志
        this.logger.log(`删除ID为${id}的电影，操作失败`);
      }
      return of(success).pipe(
        delay(150),
        catchError(error => {
          const errorMessage = error instanceof Error ? error.message : String(error);
          this.logger.log(`删除电影失败: ${errorMessage}`);
          return of(false); // 降级为false
        })
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.log(`删除电影失败: ${errorMessage}`);
      return of(false);
    }
  }

  /**
   * 更新电影
   * 根据ID更新对应的电影信息
   * @param updatedMovie 更新后的完整电影对象
   * @returns Observable<boolean> 更新成功返回true，失败返回false的 Observable
   */
  updateMovie(updatedMovie: Movie): Observable<boolean> {
    try {
      // 查找电影在数组中的索引
      const index = this.movies.findIndex(m => m.id === updatedMovie.id);
      let success = false;
      if (index > -1) {
        // 找到后直接替换该位置的元素
        this.movies[index] = updatedMovie;
        // 同步到本地存储
        this.syncToLocalStorage();
        // 通知所有订阅者数据已更新
        this.moviesSubject.next(this.movies);
        // 记录成功日志
        this.logger.log(`更新ID为${updatedMovie.id}的电影：${updatedMovie.title}，操作成功`);
        success = true;
      } else {
        // 记录失败日志
        this.logger.log(`更新ID为${updatedMovie.id}的电影：${updatedMovie.title}，操作失败`);
      }
      return of(success).pipe(
        delay(150),
        catchError(error => {
          const errorMessage = error instanceof Error ? error.message : String(error);
          this.logger.log(`更新电影失败: ${errorMessage}`);
          return of(false); // 降级为false
        })
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.log(`更新电影失败: ${errorMessage}`);
      return of(false);
    }
  }
}