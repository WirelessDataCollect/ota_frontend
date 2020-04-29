# ota-front

# docker打包文件的使用方法
1. 本地测试，`yarn start`
2. 打包项目，运行`npm run build`或`yarn build`
3. 运行dockerfile文件，`sudo docker build -t [TAG] .`
4. 将image推送到远程docker仓库，推荐阿里云容器镜像服务
5. 在目标服务器拉取docker镜像
6. 目标服务器运行docker镜像
