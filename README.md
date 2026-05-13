# 我的電影短評

電影短評紀錄與展示工具，使用 GitHub Gist 作為零後端資料庫，部署於 GitHub Pages。

**Tech stack:** React 19 + Vite 8 + Tailwind CSS v4

## 快速開始

```bash
npm install
cp .env.example .env.local   # 填入 TMDB API Key（選填）
npm run dev
```

## 設定說明

1. 前往 [GitHub Settings → Tokens](https://github.com/settings/tokens/new?scopes=gist) 建立有 **gist** 權限的 PAT
2. 開啟網頁，點右下角 ⚙ 站長設定
3. 填入 PAT → 點「自動建立新 Gist」→ 儲存設定

## 部署到 GitHub Pages

**GitHub Actions（推薦）：** 在 Repo Settings 啟用 Pages（Source: GitHub Actions），推送 `main` 即自動部署。

**手動：**

```bash
npm run deploy
```

## 環境變數

| 變數 | 說明 |
|------|------|
| `VITE_TMDB_API_KEY` | [TMDB API Key](https://www.themoviedb.org/settings/api)，用於自動抓取電影海報（選填）|

GitHub Actions 部署時請在 Repo → Settings → Secrets → Actions 新增 `VITE_TMDB_API_KEY`。

## 資料夾結構

```
src/
├── api/           # Gist API、TMDB API 封裝
├── components/    # React 元件
├── hooks/         # useAuth（localStorage 狀態）
└── utils/         # storage、YouTube 工具函式
```
