<p align="center">
  <a href="https://github.com/yuyosy/textfsm-editor.react.web" target="_blank" rel="noopener noreferrer">
    <img width="180" src="pictures/icon.svg" alt="Vite logo">
  </a>
</p>

# TextFSM Editor

ネットワークエンジニアや開発者が TextFSM テンプレートを効率的に作成・テストできる、リアルタイム解析機能を備えた Web ベースのTextFSMエディタです。

English version: [English README](README.md)

> [!NOTE]
>
> 本プロジェクトは現在開発中です。  
> 一部のコードは非効率な実装の場合があります。  
> セキュリティ上の考慮が十分でない可能性があります。  
> 本ドキュメントは作業途中のため、不完全または不正確な部分があるかもしれません。

![screenshot1](pictures/editor.png)

## 機能

### エディタ機能

- 🎨 インターフェーステーマ  
  - ライトモードとダークモードのサポート
- 📝 高度なエディタ統合 (Monaco Editor)  
  - TextFSM の構文ハイライト
  - 単語補完
  - コードの折りたたみとミニマップナビゲーション
- 📄 ファイルダウンロード  
  - 入力データおよび結果データのファイル出力
- 📋 クリップボード連携  
  - ワンクリックコピー機能

### パース機能

- ⚡ リアルタイムでのテンプレート適用
  - 変更に対する即時フィードバック
  - エラー検出機能
- 🔍 複数のデータ表示オプション  
  - テーブル表示による構造化データの確認
  - JSON 表示によるプログラム的アクセス
- 🕰️ パースの履歴  
  - 入力値、テンプレート、結果を一時的に LocalStorage に保存

### テンプレート管理

- 🗃️ プリセット読み込み  
  - NTC Templates からのテンプレート読み込み
  - 正規表現やあいまい検索によるテンプレート検索
- 🗂️ テンプレート管理  
  - LocalStorage へのテンプレート保存・読み込み
- 🖇️ インポート／エクスポート  
  - ファイルからのテンプレート読み込み
  - ファイルへのテンプレート出力

テーマ機能
![interface theme](pictures/editor-theme.png)

シンタックスハイライトと補完機能
![Word suggestion and code highlight](pictures/feature-highlight-suggetion.png)

パースしたデータのテーブル形式での表示
![Table display of parsed data](pictures/feature-result-table-view.png)

パースしたデータのJSON形式での表示
![JSON display of parsed data](pictures/feature-result-json-view.png)

その他エディタの機能
![Editor features](pictures/editor-features.png)

## プロジェクト構成

```
textfsm-editor.react.web/
├ Frontend/                                # React フロントエンドアプリケーション
│   ├ src/                                  # ソースコード
│   ├ package.json                          # フロントエンドのプロジェクト情報と依存関係
│   └ ***                                   # その他のフロントエンドファイル
├ Backend/                                 # Python バックエンドアプリケーション
│   ├ src/                                  # ソースコード
│   ├ pyproject.toml                        # バックエンドのプロジェクト情報と依存関係
│   └ ***                                   # その他のバックエンドファイル
├ textfsm-editor.react.web.code-workspace  # VSCode ワークスペースファイル
├ README.md                                # 英語版 README
├ README.ja.md                             # このファイル
└ ***                                      # その他のワークスペースファイル
```

VSCodeで textfsm-editor.react.web.code-workspace ファイルを開いて、ワークスペース全体を読み込みます。

## 始め方

- 基本環境 (Node.js + Python)
  - Dockerを使わずに Node.js と Python で直接実行する
  - 詳細: [基本環境での始め方](#基本環境での始め方)
- Docker Compose
  - 詳細: [Docker Compose環境での始め方](#docker-compose環境での始め方)


### 備考

このソフトウェアは、外部 CDN である jsDelivr から Monaco Editor (Microsoft) を読み込みます。
- https://www.jsdelivr.com/package/npm/monaco-editor


## 基本環境での始め方

### 前提条件

- Node.js (v16以上)
- npm
- Python (v3.8以上)
- uv (推奨)

### インストール

1. リポジトリをクローン

```bash
git clone https://github.com/yourusername/textfsm-editor.react.web.git
cd textfsm-editor.react.web
```

2. Frontend のセットアップ

```bash
# プロジェクトルートディレクトリでコマンドを実行
cd frontend
npm install
```

3. Backend のセットアップ

```bash
# プロジェクトルートディレクトリでコマンドを実行
cd backend
uv sync
```

### 開発

フロントエンドとバックエンドは別々のターミナルで実行してください。

1. Frontend の起動

```bash
cd frontend
npm run dev
```

※ 起動時にポート番号を変更する場合は、`--port` オプションを使用してください。

2. Backend の起動

```bash
cd backend
uv run uvicorn src.main:app --reload
```

※ 起動時にポート番号を変更する場合は、`--port` オプションを使用してください。

3. 各サービスへのアクセス  
- フロントエンド: http://localhost:5173  
- バックエンド: http://localhost:8000

### 本番環境

> [!WARNING]
>
> この本番環境構成は個人利用や内部ツール向けです。
> インターネットに公開するアプリケーションとして十分なセキュリティやパフォーマンスを担保していない場合があります。
> 公開環境へのデプロイには、以下のような追加の対策を検討してください:
> - SSL/TLS 終端を行うリバースプロキシ (Nginx, Caddy, Traefik 等)
> - レート制限と DDoS 対策
> - Web アプリケーションファイアウォール (WAF)

1. フロントエンドをビルドしてバックエンドにデプロイ

```bash
cd frontend
npm run build:deploy
```

このコマンドでフロントエンドをビルドし、`backend/public/static/` に出力をコピーします。

2. バックエンドを本番モードで起動

```bash
cd backend
MODE=production uv run uvicorn src.main:app --host 0.0.0.0 --port 8000
```

3. サービスへのアクセス
   - サービス: `http://localhost:8000`

#### 環境変数

| 変数名 | デフォルト値 | 説明 |
|--------|-------------|------|
| `MODE` | `development` | `production` で本番モード |
| `LOG_LEVEL` | `INFO` | ログレベル (`DEBUG`, `INFO`, `WARNING`, `ERROR`) |
| `DOCS_ENABLED` | `true` | APIドキュメント (`/docs`) の有効/無効 |
| `ALLOWED_HOSTS` | `localhost:5173,localhost:8000,localhost` | 許可するホスト (カンマ区切り) |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173` | 許可するCORSオリジン (カンマ区切り) |
| `ENABLE_HTTPS_REDIRECT` | `false` | HTTPSリダイレクトの有効/無効 (SSL付きリバースプロキシ使用時は `true`) |

## Docker Compose環境での始め方

### 前提条件

- Docker
- Docker Compose

### インストール

1. リポジトリをクローン

```bash
git clone https://github.com/yourusername/textfsm-editor.react.web.git
cd textfsm-editor.react.web
```

2. コンテナのビルド

```bash
docker compose build
```

### 開発用

1. コンテナの起動

```bash
docker compose --profile dev up --build --watch
```

2. 各サービスへのアクセス
   - フロントエンド: `http://localhost:5173`
   - バックエンド: `http://localhost:8000`

### 本番環境

> [!WARNING]
>
> この本番環境構成は個人利用や内部ツール向けです。
> インターネットに公開するアプリケーションとして十分なセキュリティやパフォーマンスを担保していない場合があります。
> 公開環境へのデプロイには、以下のような追加の対策を検討してください:
> - SSL/TLS 終端
> - レート制限と DDoS 対策
> - Web アプリケーションファイアウォール (WAF)
> - 定期的なセキュリティ監査

2つの本番構成が利用可能です:

#### オプション 1: バックエンドが静的ファイルを配信

```bash
docker compose --profile prod up --build
```

- アクセス: `http://localhost:8000`

#### オプション 2: Nginx + バックエンドAPI（高トラフィック向け推奨）

```bash
docker compose --profile prod-nginx up --build
```

- アクセス: `http://localhost:80`

## Contributing

コントリビューション大歓迎です！お気軽にプルリクエストをお送りください。

1. リポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/AmazingFeature`)
3. 変更をコミット (`git commit -m 'Add some AmazingFeature'`)
4. ブランチにプッシュ (`git push origin feature/AmazingFeature`)
5. プルリクエストを作成

## License

MIT License Copyright (c) 2023 yuyosy


## References

- [GitHub - microsoft/monaco-editor](https://github.com/microsoft/monaco-editor)
- [React](https://react.dev)
- [Vite](https://vitejs.dev)
