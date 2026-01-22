// 修复 velite index.js 文件中的 with { type: 'json' } 语法
import fs from 'fs';
import path from 'path';

const indexJsPath = path.join(process.cwd(), '.velite', 'index.js');

try {
  // 检查文件是否存在
  if (!fs.existsSync(indexJsPath)) {
    console.error('[fix-velite-export] 未找到 .velite/index.js 文件');
    process.exit(1);
  }

  // 读取文件内容
  const content = fs.readFileSync(indexJsPath, 'utf8');
  
  // 替换 with { type: 'json' } 语法
  const fixedContent = content.replace(/ with \{ type: 'json' \}/g, '');
  
  // 写入修复后的内容
  fs.writeFileSync(indexJsPath, fixedContent, 'utf8');
  
  console.log('[fix-velite-export] 已修复 .velite/index.js 文件中的 with { type: \'json\' } 语法');
} catch (error) {
  console.error('[fix-velite-export] 修复 .velite/index.js 文件失败:', error);
  process.exit(1);
}