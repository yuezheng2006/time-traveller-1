#!/bin/bash

echo "🔍 Motia Cloud 配置诊断工具"
echo "================================"
echo ""

# 检查 GitHub Secrets
echo "1. 检查 GitHub Secrets:"
gh secret list --repo yuezheng2006/time-traveller-1 | grep MOTIA || echo "   未找到 MOTIA 相关 Secrets"
echo ""

# 提示用户需要的信息
echo "2. 需要从 Motia Cloud 获取的信息:"
echo "   📍 登录: https://motia.cloud"
echo "   📍 进入你的项目"
echo "   📍 查看 Settings → 找到以下信息："
echo ""
echo "   a) 项目名称（Project Name）"
echo "   b) Environment ID"
echo "   c) API Key（如果之前的无效，重新生成一个）"
echo ""

echo "3. 更新配置的命令："
echo ""
echo "   # 更新 MOTIA_API_KEY"
echo "   echo -n '你的完整_API_KEY' | gh secret set MOTIA_API_KEY --repo yuezheng2006/time-traveller-1"
echo ""
echo "   # 更新 MOTIA_ENV_ID"
echo "   echo -n '你的_ENV_ID' | gh secret set MOTIA_ENV_ID --repo yuezheng2006/time-traveller-1"
echo ""

echo "4. 然后重新触发部署："
echo "   gh workflow run deploy.yml --repo yuezheng2006/time-traveller-1"
echo ""
