# routes/movies.py
from flask import Blueprint, request, jsonify

# 直接定义电影数据
movies = [
    {"id": 1, "title": "星际穿越", "director": "诺兰", "directorId": 1,
     "genre": "科幻", "rating": 9.3, "releaseYear": 2014, "status": "showing"},
    {"id": 2, "title": "盗梦空间", "director": "诺兰", "directorId": 1,
     "genre": "科幻", "rating": 9.4, "releaseYear": 2010, "status": "archived"},
    {"id": 3, "title": "蝙蝠侠：黑暗骑士", "director": "诺兰", "directorId": 1,
     "genre": "动作", "rating": 9.1, "releaseYear": 2008, "status": "showing"},
    {"id": 4, "title": "卧虎藏龙", "director": "李安", "directorId": 2,
     "genre": "武侠", "rating": 8.9, "releaseYear": 2000, "status": "archived"},
    {"id": 5, "title": "千与千寻", "director": "宫崎骏", "directorId": 3,
     "genre": "动画", "rating": 9.4, "releaseYear": 2001, "status": "showing"},
    {"id": 6, "title": "花样年华", "director": "王家卫", "directorId": 4,
     "genre": "剧情", "rating": 8.6, "releaseYear": 2000, "status": "archived"},
]

def next_movie_id():
    return max(m["id"] for m in movies) + 1 if movies else 1

movie_bp = Blueprint('movies', __name__)


# GET /api/movies - 获取全部电影（支持 ?title= 搜索）
@movie_bp.route('/api/movies', methods=['GET'])
def get_movies():
    title = request.args.get('title', '').strip()
    genre = request.args.get('genre', '').strip()
    result = movies
    if title:
        result = [m for m in result if title.lower() in m['title'].lower()]
    if genre:
        result = [m for m in result if m['genre'] == genre]
    return jsonify(result)


# GET /api/movies/<id> - 获取单部电影
@movie_bp.route('/api/movies/<int:movie_id>', methods=['GET'])
def get_movie(movie_id):
    movie = next((m for m in movies if m['id'] == movie_id), None)
    if movie is None:
        return jsonify({"error": f"电影 id={movie_id} 未找到"}), 404
    return jsonify(movie)


# POST /api/movies - 新增电影
@movie_bp.route('/api/movies', methods=['POST'])
def add_movie():
    data = request.get_json()
    if not data or not data.get('title'):
        return jsonify({"error": "title 字段必填"}), 400
    new_movie = {
        "id": next_movie_id(),
        "title": data.get("title", ""),
        "director": data.get("director", ""),
        "directorId": data.get("directorId", 0),
        "genre": data.get("genre", ""),
        "rating": data.get("rating", 0),
        "releaseYear": data.get("releaseYear", 0),
        "status": data.get("status", "showing"),
    }
    movies.append(new_movie)
    return jsonify(new_movie), 201


# PUT /api/movies/<id> - 更新电影
@movie_bp.route('/api/movies/<int:movie_id>', methods=['PUT'])
def update_movie(movie_id):
    movie = next((m for m in movies if m['id'] == movie_id), None)
    if movie is None:
        return jsonify({"error": f"电影 id={movie_id} 未找到"}), 404
    data = request.get_json()
    for key in ['title', 'director', 'directorId', 'genre', 'rating',
                'releaseYear', 'status']:
        if key in data:
            movie[key] = data[key]
    return jsonify(movie)


# DELETE /api/movies/<id> - 删除电影
@movie_bp.route('/api/movies/<int:movie_id>', methods=['DELETE'])
def delete_movie(movie_id):
    global movies
    movie = next((m for m in movies if m['id'] == movie_id), None)
    if movie is None:
        return jsonify({"error": f"电影 id={movie_id} 未找到"}), 404
    movies = [m for m in movies if m['id'] != movie_id]
    return jsonify({"success": True, "deleted": movie})