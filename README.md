# 真心话大冒险

适配 iPad 横屏，也兼容桌面和手机触屏的中文聚会转盘游戏。包含三种档位、600 条题目、玩家与题目转盘、限时旋转、一次强制重抽、全屏模式及会话恢复。

## 本地运行

```bash
npm install
npm run dev
```

浏览器打开终端显示的地址（默认 `http://localhost:5173`）。

## 检查与构建

```bash
npm test
npm run build
```

构建产物会生成在 `dist/` 目录。

## GitHub Pages 部署

仓库包含 `.github/workflows/deploy-pages.yml` 自动部署工作流。合并到 `main`
分支后，GitHub Actions 会依次安装依赖、运行测试、构建应用，并将 `dist/`
发布到 GitHub Pages。也可以在仓库的 **Actions → Deploy to GitHub Pages →
Run workflow** 中手动触发部署。

首次部署前，请在 GitHub 仓库的 **Settings → Pages → Build and deployment**
中将 **Source** 设为 **GitHub Actions**。工作流成功后，可以通过以下地址访问：

```text
https://<GitHub 用户名>.github.io/-truth-or-dare-game/
```

Vite 的生产构建 `base` 已配置为 `/-truth-or-dare-game/`，因此部署在仓库的
Pages 子路径时，JavaScript、CSS 和其他静态资源会从正确地址加载。本地开发仍
使用根路径 `http://localhost:5173/`。
