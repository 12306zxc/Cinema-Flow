# routes/directors.py
from flask import Blueprint, request, jsonify

# 直接定义导演数据
directors = [
    {"id": 1, "name": "克里斯托弗·诺兰", "nationality": "英国/美国",
     "birthYear": 1970, "bio": "以非线性叙事和视觉奇观著称的导演。"},
    {"id": 2, "name": "李安", "nationality": "中国台湾/美国",
     "birthYear": 1954, "bio": "横跨东西方文化的大师级导演。"},
    {"id": 3, "name": "宫崎骏", "nationality": "日本",
     "birthYear": 1941, "bio": "吉卜力工作室创始人，动画电影巨匠。"},
    {"id": 4, "name": "王家卫", "nationality": "中国香港",
     "birthYear": 1958, "bio": "以独特的视觉美学和即兴拍摄著称。"},
]

# 导入电影数据
from .movies import movies

def next_director_id():
    return max(d["id"] for d in directors) + 1 if directors else 1

director_bp = Blueprint('directors', __name__)


# GET /api/directors - 获取全部导演
@director_bp.route('/api/directors', methods=['GET'])
def get_directors():
    return jsonify(directors)


# GET /api/directors/<id> - 获取单个导演
@director_bp.route('/api/directors/<int:director_id>', methods=['GET'])
def get_director(director_id):
    director = next((d for d in directors if d['id'] == director_id), None)
    if director is None:
        return jsonify({"error": f"导演 id={director_id} 未找到"}), 404
    return jsonify(director)


# GET /api/directors/<id>/movies - 获取该导演的所有电影
@director_bp.route('/api/directors/<int:director_id>/movies', methods=['GET'])
def get_director_movies(director_id):
    result = [m for m in movies if m['directorId'] == director_id]
    return jsonify(result)


# POST /api/directors - 新增导演
@director_bp.route('/api/directors', methods=['POST'])
def add_director():
    data = request.get_json()
    if not data or not data.get('name'):
        return jsonify({"error": "name 字段必填"}), 400
    new_director = {
        "id": next_director_id(),
        "name": data.get("name", ""),
        "nationality": data.get("nationality", ""),
        "birthYear": data.get("birthYear", 0),
        "bio": data.get("bio", ""),
    }
    directors.append(new_director)
    return jsonify(new_director), 201


# DELETE /api/directors/<id> - 删除导演
@director_bp.route('/api/directors/<int:director_id>', methods=['DELETE'])
def delete_director(director_id):
    global directors
    director = next((d for d in directors if d['id'] == director_id), None)
    if director is None:
        return jsonify({"error": f"导演 id={director_id} 未找到"}), 404
    directors = [d for d in directors if d['id'] != director_id]
    return jsonify({"success": True, "deleted": director})