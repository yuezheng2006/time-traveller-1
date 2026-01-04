#!/usr/bin/env node

/**
 * 更新 GitHub Secrets 的脚本 (TypeScript 版本)
 * 使用方法: 
 *   npx tsx scripts/update-secrets.ts
 *   或
 *   npx tsx scripts/update-secrets.ts <GEMINI_API_KEY> <GOOGLE_API_KEY>
 */

import { execSync } from 'child_process';
import * as readline from 'readline';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function exec(command: string): string {
  try {
    return execSync(command, { encoding: 'utf-8', stdio: 'pipe' }).trim();
  } catch (error: any) {
    throw new Error(`命令执行失败: ${command}\n${error.message}`);
  }
}

function question(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  log('🔐 GitHub Secrets 更新工具\n', 'green');

  // 检查 gh CLI
  try {
    exec('which gh');
  } catch {
    log('❌ GitHub CLI (gh) 未安装', 'red');
    log('请先安装: brew install gh', 'yellow');
    process.exit(1);
  }

  // 检查登录状态
  try {
    exec('gh auth status');
  } catch {
    log('⚠️  未登录 GitHub，请先运行: gh auth login', 'yellow');
    process.exit(1);
  }

  // 获取仓库信息
  let repo: string;
  try {
    repo = exec('gh repo view --json nameWithOwner -q .nameWithOwner');
  } catch {
    log('❌ 无法获取仓库信息，请确保在 Git 仓库中运行此脚本', 'red');
    process.exit(1);
  }

  log(`📦 仓库: ${repo}\n`, 'green');

  // 获取 API Keys
  let geminiKey: string;
  let googleKey: string;

  if (process.argv.length >= 4) {
    geminiKey = process.argv[2];
    googleKey = process.argv[3];
  } else if (process.argv.length === 3) {
    log('⚠️  只提供了一个参数，将只更新 GEMINI_API_KEY\n', 'yellow');
    geminiKey = process.argv[2];
    googleKey = '';
  } else {
    // 交互式输入
    log('请输入新的 API Keys（留空则跳过更新）:\n', 'yellow');
    geminiKey = await question('Gemini API Key: ');
    console.log('');
    googleKey = await question('Google Maps API Key: ');
    console.log('');
  }

  // 更新 GEMINI_API_KEY
  if (geminiKey) {
    log('🔄 更新 GEMINI_API_KEY...', 'green');
    try {
      execSync(`echo -n "${geminiKey}" | gh secret set GEMINI_API_KEY --repo "${repo}"`, {
        stdio: 'inherit',
      });
      log('✅ GEMINI_API_KEY 更新成功\n', 'green');
    } catch (error) {
      log('❌ GEMINI_API_KEY 更新失败\n', 'red');
      process.exit(1);
    }
  } else {
    log('⏭️  跳过 GEMINI_API_KEY 更新\n', 'yellow');
  }

  // 更新 GOOGLE_API_KEY
  if (googleKey) {
    log('🔄 更新 GOOGLE_API_KEY...', 'green');
    try {
      execSync(`echo -n "${googleKey}" | gh secret set GOOGLE_API_KEY --repo "${repo}"`, {
        stdio: 'inherit',
      });
      log('✅ GOOGLE_API_KEY 更新成功\n', 'green');
    } catch (error) {
      log('❌ GOOGLE_API_KEY 更新失败\n', 'red');
      process.exit(1);
    }
  } else {
    log('⏭️  跳过 GOOGLE_API_KEY 更新\n', 'yellow');
  }

  // 显示当前 Secrets
  log('📋 当前 Secrets 列表:', 'green');
  try {
    const secrets = exec(`gh secret list --repo "${repo}"`);
    const lines = secrets.split('\n');
    lines.forEach((line) => {
      if (line.includes('GEMINI_API_KEY') || line.includes('GOOGLE_API_KEY')) {
        console.log(line);
      }
    });
  } catch {
    log('未找到相关 Secrets', 'yellow');
  }

  log('\n✨ 完成！', 'green');
  log('💡 提示: 更新 Secrets 后，需要重新部署才能生效', 'yellow');
  log('   可以通过推送到 main 分支或手动运行 GitHub Actions 来触发部署', 'yellow');
}

main().catch((error) => {
  log(`\n❌ 错误: ${error.message}`, 'red');
  process.exit(1);
});
