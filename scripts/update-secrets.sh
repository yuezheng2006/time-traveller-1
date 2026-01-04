#!/bin/bash

# 更新 GitHub Secrets 的脚本
# 使用方法: ./scripts/update-secrets.sh [GEMINI_API_KEY] [GOOGLE_API_KEY]

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔐 GitHub Secrets 更新工具${NC}\n"

# 检查 gh CLI 是否已安装
if ! command -v gh &> /dev/null; then
    echo -e "${RED}❌ GitHub CLI (gh) 未安装${NC}"
    echo "请先安装: brew install gh"
    exit 1
fi

# 检查是否已登录
if ! gh auth status &> /dev/null; then
    echo -e "${YELLOW}⚠️  未登录 GitHub，正在登录...${NC}"
    gh auth login
fi

# 获取仓库信息
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null || echo "")
if [ -z "$REPO" ]; then
    echo -e "${RED}❌ 无法获取仓库信息，请确保在 Git 仓库中运行此脚本${NC}"
    exit 1
fi

echo -e "📦 仓库: ${GREEN}$REPO${NC}\n"

# 获取 API Keys
if [ $# -ge 2 ]; then
    GEMINI_KEY="$1"
    GOOGLE_KEY="$2"
elif [ $# -eq 1 ]; then
    echo -e "${YELLOW}⚠️  只提供了一个参数，将只更新 GEMINI_API_KEY${NC}\n"
    GEMINI_KEY="$1"
    GOOGLE_KEY=""
else
    # 交互式输入
    echo -e "${YELLOW}请输入新的 API Keys（留空则跳过更新）:${NC}\n"
    
    read -p "Gemini API Key: " GEMINI_KEY
    echo ""
    read -p "Google Maps API Key: " GOOGLE_KEY
    echo ""
fi

# 更新 GEMINI_API_KEY
if [ -n "$GEMINI_KEY" ]; then
    echo -e "${GREEN}🔄 更新 GEMINI_API_KEY...${NC}"
    if echo -n "$GEMINI_KEY" | gh secret set GEMINI_API_KEY --repo "$REPO"; then
        echo -e "${GREEN}✅ GEMINI_API_KEY 更新成功${NC}\n"
    else
        echo -e "${RED}❌ GEMINI_API_KEY 更新失败${NC}\n"
        exit 1
    fi
else
    echo -e "${YELLOW}⏭️  跳过 GEMINI_API_KEY 更新${NC}\n"
fi

# 更新 GOOGLE_API_KEY
if [ -n "$GOOGLE_KEY" ]; then
    echo -e "${GREEN}🔄 更新 GOOGLE_API_KEY...${NC}"
    if echo -n "$GOOGLE_KEY" | gh secret set GOOGLE_API_KEY --repo "$REPO"; then
        echo -e "${GREEN}✅ GOOGLE_API_KEY 更新成功${NC}\n"
    else
        echo -e "${RED}❌ GOOGLE_API_KEY 更新失败${NC}\n"
        exit 1
    fi
else
    echo -e "${YELLOW}⏭️  跳过 GOOGLE_API_KEY 更新${NC}\n"
fi

# 显示当前 Secrets（不显示值）
echo -e "${GREEN}📋 当前 Secrets 列表:${NC}"
gh secret list --repo "$REPO" | grep -E "(GEMINI_API_KEY|GOOGLE_API_KEY)" || echo "未找到相关 Secrets"

echo -e "\n${GREEN}✨ 完成！${NC}"
echo -e "${YELLOW}💡 提示: 更新 Secrets 后，需要重新部署才能生效${NC}"
echo -e "${YELLOW}   可以通过推送到 main 分支或手动运行 GitHub Actions 来触发部署${NC}"
