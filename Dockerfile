FROM nginx:latest
RUN /bin/cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo 'Asia/Shanghai' >/etc/timezone

WORKDIR /app/h5-sidebar
ADD ./dist /app/h5-sidebar
COPY ./docker/nginx.test.conf /etc/nginx/nginx.conf

# 运行的环境变量设置
ENV RUN_MODE pro
EXPOSE 80

