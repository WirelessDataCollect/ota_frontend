# ota-front

# docker打包文件的使用方法
1. 打包项目，运行npm run build或yarn build
2. 运行dockerfile文件，`sudo docker build -t [TAG] .`
3. 将image推送到远程docker仓库，推荐阿里云容器镜像服务
4. 在目标服务器拉取docker镜像
5. 目标服务器运行docker镜像
