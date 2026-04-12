import { Movie } from './movie';

export const mockMovies: Movie[] = [
  {
    id: 1,
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
