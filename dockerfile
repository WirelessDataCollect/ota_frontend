FROM nginx

# 将打包好的项目文件拷贝到容器对应位置
COPY  build /usr/share/nginx/html

# 将本地的nginx配置文件拷贝到容器对应位置，使其生效
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# 用来启动容器的命令
COPY ./docker-compose.yml /home/hope/docker-compose.yml