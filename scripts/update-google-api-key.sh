#!/bin/bash

# 更新 Google API Key 的完整流程脚本
# 使用方法: ./scripts/update-google-api-key.sh <新的_GOOGLE_API_KEY> [新的_GEMINI_API_KEY]

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔐 Google API Key 更新工具${NC}\n"
echo -e "${YELLOW}⚠️  重要提示：${NC}"
echo -e "   1. 请先在 Google Cloud Console 创建新的 API Key"
echo -e "   2. 确保新 Key 已启用以下 API："
echo -e "      - Maps JavaScript API"
echo -e "      - Street View Static API"
echo -e "      - Geocoding API"
echo -e "      - Places API"
echo -e "   3. 如果使用 Gemini，还需要启用："
echo -e "      - Generative Language API"
echo ""

# 检查参数
if [ $# -lt 1 ]; then
    echo -e "${YELLOW}使用方法:${NC}"
    echo "  $0 <新的_GOOGLE_API_KEY> [新的_GEMINI_API_KEY]"
    echo ""
    echo "示例:"
    echo "  $0 AIzaSy... [AIzaSy...]"
    echo ""
    echo -e "${YELLOW}如果只提供一个参数，将同时用于 GOOGLE_API_KEY 和 GEMINI_API_KEY${NC}"
    exit 1
fi

NEW_GOOGLE_KEY="$1"
NEW_GEMINI_KEY="${2:-$1}"  # 如果没有提供第二个参数，使用第一个

echo -e "${GREEN}📝 步骤 1: 更新本地 .env 文件${NC}"
if [ -f .env ]; then
    # 备份原文件
    cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
    
    # 更新 GOOGLE_API_KEY
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s|^GOOGLE_API_KEY=.*|GOOGLE_API_KEY=$NEW_GOOGLE_KEY|" .env
        sed -i '' "s|^GEMINI_API_KEY=.*|GEMINI_API_KEY=$NEW_GEMINI_KEY|" .env
        sed -i '' "s|^VITE_GOOGLE_API_KEY=.*|VITE_GOOGLE_API_KEY=$NEW_GOOGLE_KEY|" .env
    else
        # Linux
        sed -i "s|^GOOGLE_API_KEY=.*|GOOGLE_API_KEY=$NEW_GOOGLE_KEY|" .env
        sed -i "s|^GEMINI_API_KEY=.*|GEMINI_API_KEY=$NEW_GEMINI_KEY|" .env
        sed -i "s|^VITE_GOOGLE_API_KEY=.*|VITE_GOOGLE_API_KEY=$NEW_GOOGLE_KEY|" .env
    fi
    echo "✅ .env 文件已更新"
else
    echo -e "${RED}❌ .env 文件不存在${NC}"
    exit 1
fi
echo ""

# 检查 gh CLI 是否已安装
if ! command -v gh &> /dev/null; then
    echo -e "${YELLOW}⚠️  GitHub CLI (gh) 未安装，跳过 GitHub Secrets 更新${NC}"
    echo "   请手动前往 GitHub → Settings → Secrets → Actions 更新以下 Secrets:"
    echo "   - GOOGLE_API_KEY"
    echo "   - GEMINI_API_KEY"
    echo ""
else
    # 检查是否已登录
    if ! gh auth status &> /dev/null; then
        echo -e "${YELLOW}⚠️  未登录 GitHub，正在登录...${NC}"
        gh auth login
    fi
    
    # 获取仓库信息
    REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null || echo "")
    if [ -z "$REPO" ]; then
        REPO="yuezheng2006/time-traveller-1"
        echo -e "${YELLOW}⚠️  无法自动获取仓库信息，使用默认: $REPO${NC}"
    fi
    
    echo -e "${GREEN}📝 步骤 2: 更新 GitHub Secrets${NC}"
    echo -e "   仓库: ${BLUE}$REPO${NC}"
    
    # 更新 GOOGLE_API_KEY
    echo -e "${GREEN}🔄 更新 GOOGLE_API_KEY...${NC}"
    if echo -n "$NEW_GOOGLE_KEY" | gh secret set GOOGLE_API_KEY --repo "$REPO"; then
        echo -e "${GREEN}✅ GOOGLE_API_KEY 更新成功${NC}"
    else
        echo -e "${RED}❌ GOOGLE_API_KEY 更新失败${NC}"
        exit 1
    fi
    
    # 更新 GEMINI_API_KEY
    echo -e "${GREEN}🔄 更新 GEMINI_API_KEY...${NC}"
    if echo -n "$NEW_GEMINI_KEY" | gh secret set GEMINI_API_KEY --repo "$REPO"; then
        echo -e "${GREEN}✅ GEMINI_API_KEY 更新成功${NC}"
    else
        echo -e "${RED}❌ GEMINI_API_KEY 更新失败${NC}"
        exit 1
    fi
    echo ""
fi

echo -e "${GREEN}📝 步骤 3: 验证更新${NC}"
echo -e "   检查本地 .env 文件中的 Key..."
if grep -q "GOOGLE_API_KEY=$NEW_GOOGLE_KEY" .env; then
    echo -e "   ${GREEN}✅ GOOGLE_API_KEY 已正确更新${NC}"
else
    echo -e "   ${RED}❌ GOOGLE_API_KEY 更新验证失败${NC}"
fi

if grep -q "GEMINI_API_KEY=$NEW_GEMINI_KEY" .env; then
    echo -e "   ${GREEN}✅ GEMINI_API_KEY 已正确更新${NC}"
else
    echo -e "   ${RED}❌ GEMINI_API_KEY 更新验证失败${NC}"
fi
echo ""

echo -e "${GREEN}✨ 更新完成！${NC}\n"
echo -e "${YELLOW}📋 下一步操作：${NC}"
echo -e "   1. ${BLUE}测试新 Key（可选）${NC}:"
echo -e "      node scripts/test-gemini-key.js"
echo ""
echo -e "   2. ${BLUE}触发重新部署到 Motia Cloud${NC}:"
echo -e "      方式 A: 推送到 main 分支（自动触发）"
echo -e "        git add .env"
echo -e "        git commit -m 'chore: update Google API keys'"
echo -e "        git push origin main"
echo ""
echo -e "      方式 B: 手动触发 GitHub Actions"
echo -e "        前往: https://github.com/$REPO/actions/workflows/deploy.yml"
echo -e "        点击 'Run workflow' → 'Run workflow'"
echo ""
echo -e "   3. ${BLUE}如果使用 Vercel 部署前端${NC}:"
echo -e "      前往 Vercel Dashboard → Project Settings → Environment Variables"
echo -e "      更新 VITE_GOOGLE_API_KEY"
echo ""
