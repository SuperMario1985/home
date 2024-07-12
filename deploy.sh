#!/bin/bash

image=${1}
tag=${2}
object=${image##*/}
obj=${object##*-}

cat > Dockerfile << EOF
FROM artifactory.csc.com.cn/csc-docker-sit/paas/wxwork/base/nginx-arm64:1.23.1
WORKDIR /app/${obj}
ADD ./dist /app/${obj}
COPY ./docker/nginx.test.conf /etc/nginx/nginx.conf
ENV RUN_MODE prod
EXPOSE 80
EOF


cat > deploy.yaml << EOF
apiVersion: app.k8s.io/v1beta1
kind: Application
metadata:
  name: ${object}
  namespace: wxwork-scrm
---
apiVersion: v1
kind: Service
metadata:
  name: ${object}
  labels:
    app: ${object}
    appmonitor: prometheus
spec:
  ports:
    - name: http
      port: 80
      protocol: TCP
      targetPort: 80
  selector:
    app: ${object}
---
apiVersion: apps/v1
kind: Deployment
metadata:
  namespace: wxwork-scrm
  labels:
    app: ${object}
  name: ${object}
spec:
  replicas: 1
  selector:
    matchLabels:
      app: $object
  template:
    metadata:
      labels:
        app: ${object}
      name: $object
    spec:
      containers:
        - image: ${image}:${tag}
          imagePullPolicy: IfNotPresent
          name: ${object}
          resources:
            limits:
              cpu: 100m
              memory: 500Mi
            requests:
              cpu: 100m
              memory: 125Mi
      dnsPolicy: ClusterFirst
      restartPolicy: Always
      schedulerName: default-scheduler
      terminationGracePeriodSeconds: 30
EOF