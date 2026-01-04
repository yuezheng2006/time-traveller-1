#!/bin/bash

# 更新 API Keys 并部署到 Motia Cloud 的脚本
# 使用方法: ./scripts/update-and-deploy.sh <新的_GEMINI_API_KEY> [新的_GOOGLE_API_KEY]

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🚀 更新 API Keys 并部署到 Motia Cloud${NC}\n"

# 检查参数
if [ $# -lt 1 ]; then
    echo -e "${YELLOW}使用方法:${NC}"
    echo "  $0 <新的_GEMINI_API_KEY> [新的_GOOGLE_API_KEY]"
    echo ""
    echo "示例:"
    echo "  $0 AIzaSy... AIzaSy..."
    exit 1
fi

NEW_GEMINI_KEY="$1"
NEW_GOOGLE_KEY="${2:-$1}"  # 如果没有提供第二个参数，使用第一个

echo -e "${GREEN}📝 步骤 1: 更新本地 .env 文件${NC}"
sed -i.bak "s|^GEMINI_API_KEY=.*|GEMINI_API_KEY=$NEW_GEMINI_KEY|" .env
sed -i.bak "s|^GOOGLE_API_KEY=.*|GOOGLE_API_KEY=$NEW_GOOGLE_KEY|" .env
echo "✅ .env 文件已更新"
echo ""

echo -e "${GREEN}📝 步骤 2: 更新 GitHub Secrets${NC}"
echo -n "$NEW_GEMINI_KEY" | gh secret set GEMINI_API_KEY --repo yuezheng2006/time-traveller-1
echo -n "$NEW_GOOGLE_KEY" | gh secret set GOOGLE_API_KEY --repo yuezheng2006/time-traveller-1
echo "✅ GitHub Secrets 已更新"
echo ""

echo -e "${GREEN}📝 步骤 3: 部署到 Motia Cloud${NC}"
# 请确保已在本地设置了 MOTIA_API_KEY 环境变量，或通过命令行输入
if [ -z "$MOTIA_API_KEY" ]; then
    read -p "请输入 MOTIA_API_KEY: " MOTIA_API_KEY
fi
VERSION_NAME="v1.0.$(date +%Y%m%d%H%M%S)"

npx motia cloud deploy \
  --api-key "$MOTIA_API_KEY" \
  --project-name "time-traveller" \
  --environment-name "production" \
  --version-name "$VERSION_NAME" \
  --env-file .env

echo ""
echo -e "${GREEN}✅ 完成！${NC}"
echo "新的 API keys 已更新并部署到 Motia Cloud"
