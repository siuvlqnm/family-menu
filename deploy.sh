#!/bin/bash

# 清理旧的部署文件
rm -rf deploy deploy.zip

# 前端构建
echo "Building frontend..."
npm run build

# 部署前端
echo "Deploying frontend..."
npx wrangler pages deploy out

# 部署后端
echo "Deploying backend..."
npx wrangler pages deploy functions

# 创建 zip 文件
zip -r deploy.zip ./*

# 清理部署目录
rm -rf deploy

echo "部署包已创建: deploy.zip" 
echo "Deployment completed!"