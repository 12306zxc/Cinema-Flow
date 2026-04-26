# app.py - Flask 应用主文件
from flask import Flask
from flask_cors import CORS

# 直接导入蓝图
import routes.movies
import routes.directors

app = Flask(__name__)

# 配置 CORS，允许 Angular 开发服务器 (localhost:4200) 跨域访问
CORS(app, resources={r"/api/*": {"origins": "http://localhost:4200"}})

# 注册蓝图
app.register_blueprint(routes.movies.movie_bp)
app.register_blueprint(routes.directors.director_bp)

# 健康检查接口
@app.route('/api/health', methods=['GET'])
def health():
    return {"status": "ok", "service": "CinemaFlow API"}

if __name__ == '__main__':
    app.run(debug=True, port=5000)