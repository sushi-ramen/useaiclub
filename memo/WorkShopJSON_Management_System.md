## イベント分散型JSON管理方式

***

## フォルダ構造

```
/workshop-games/
  ├─ folders.json                    ← イベントフォルダ一覧
  ├─ 2025-11-01/                     ← イベント1
  │   ├─ event.json                  ← このイベントの情報+ゲーム一覧
  │   ├─ taro2023.html               ← ゲーム本体
  │   ├─ taro2023.jpg                ← サムネイル画像
  │   └─ hanako2024.html
  ├─ 2025-12-15/                     ← イベント2
  │   ├─ event.json
  │   ├─ ken2025.html
  │   └─ ken2025.jpg
  └─ index.html                      ← 全イベント統合リンクページ
```

***

## ファイル仕様

### 1. folders.json (ルート階層)

**役割:** 存在するイベントフォルダ名の一覧  
**場所:** `/workshop-games/folders.json`

```json
[
  "2025-11-01",
  "2025-12-15",
  "2026-01-20"
]
```

**フォルダ命名規則:** `YYYY-MM-DD` (イベント開催日)

**更新タイミング:** 新しいイベントフォルダを作成したとき

***

### 2. event.json (各イベントフォルダ内)

**役割:** そのイベントの開催情報とゲーム一覧  
**場所:** `/workshop-games/{YYYY-MM-DD}/event.json`

```json
{
  "eventName": "秋のワークショップ",
  "eventDate": "2025-11-01",
  "eventDescription": "小学生を対象にAIを使ったゲーム作りを体験するワークショップを開催しました。参加者は生成AIと対話しながら、自分だけのオリジナルゲームを完成させました。",
  "eventURL": "https://example.com/events/workshop-2025-11",
  "games": [
    {
      "id": "taro2023",
      "creator": "たろう",
      "age": 9,
      "grade": "小学3年生",
      "ai": "ChatGPT",
      "prompt": "宇宙を冒険するゲームを作って",
      "title": "宇宙大冒険"
    },
    {
      "id": "hanako2024",
      "creator": "はなこ",
      "age": 10,
      "grade": "小学4年生",
      "ai": "Claude",
      "prompt": "パズルのゲームを作りたい",
      "title": "パズルゲーム"
    }
  ]
}
```

**フィールド説明:**

#### イベント情報

| フィールド | 型 | 必須 | 説明 | 例 |
|-----------|---|------|------|-----|
| eventName | String | ◯ | イベント名 | "秋のワークショップ" |
| eventDate | String | ◯ | 開催日(YYYY-MM-DD) | "2025-11-01" |
| eventDescription | String | ◯ | イベント概要・説明文 | "小学生を対象に..." |
| eventURL | String | △ | イベント詳細ページのURL | "https://example.com/events/..." |

#### games配列の各要素

| フィールド | 型 | 必須 | 説明 | 例 |
|-----------|---|------|------|-----|
| id | String | ◯ | ゲームファイルのベース名(拡張子なし) | "taro2023" |
| creator | String | ◯ | 作者の表示名 | "たろう" |
| age | Number | ◯ | 作成時の年齢 | 9 |
| grade | String | ◯ | 学年 | "小学3年生" |
| ai | String | ◯ | 使用した生成AIモデル | "ChatGPT" |
| prompt | String | ◯ | 最初に入力したプロンプト | "宇宙を冒険するゲームを作って" |
| title | String | ◯ | ゲームのタイトル | "宇宙大冒険" |

**更新タイミング:** 新しいゲームを追加したとき

***

### 3. ゲームファイル (各イベントフォルダ内)

**命名規則:** `{id}.html` および `{id}.jpg`

- `{id}` はevent.jsonの`games[].id`と一致
- 例: `taro2023.html`, `taro2023.jpg`

**関連ファイル:**
- `{id}.html` - ゲーム本体
- `{id}.jpg` - サムネイル画像
- (オプション) `{id}_thumb.jpg` - 小サムネイル
- (オプション) `{id}.mp4` - プレイ動画

***

### 4. index.html (ルート階層)

**役割:** 全イベントのゲームを統合表示するリンクページ  
**場所:** `/workshop-games/index.html`

**処理フロー:**
1. `folders.json`を読み込み、イベントフォルダ一覧を取得
2. 各フォルダの`event.json`を並列で読み込み
3. 取得したデータを元にHTMLを動的生成
4. イベントごとにセクション分けして表示

**基本的な表示構造:**
```html
<section class="event-section">
  <h2>{eventName}</h2>
  <p class="event-date">{eventDate}</p>
  <p class="event-description">{eventDescription}</p>
  <a href="{eventURL}">イベント詳細</a>
  
  <div class="games-grid">
    <div class="game-card">
      <img src="{folder}/{id}.jpg">
      <h3><a href="{folder}/{id}.html">{title}</a></h3>
      <p>{creator} ({age}歳・{grade})</p>
      <p>使用AI: {ai}</p>
      <p>プロンプト: 「{prompt}」</p>
    </div>
  </div>
</section>
```

***

## ファイルパスの生成ルール

### ゲームHTMLへのリンク
```
{イベントフォルダ名}/{id}.html
例: 2025-11-01/taro2023.html
```

### ゲーム画像のパス
```
{イベントフォルダ名}/{id}.jpg
例: 2025-11-01/taro2023.jpg
```

### 完全URL例
```
https://example.com/workshop-games/index.html
https://example.com/workshop-games/2025-11-01/taro2023.html
https://example.com/workshop-games/2025-11-01/taro2023.jpg
```

***

## 運用フロー

### 新しいイベント追加時
1. `/workshop-games/{YYYY-MM-DD}/` フォルダを作成
2. `folders.json` に新フォルダ名を追加
3. `{YYYY-MM-DD}/event.json` を作成
    - eventName, eventDate, eventDescription, eventURL を記入
    - gamesは空配列 `[]` でOK

### 新しいゲーム追加時
1. ゲームHTMLファイルを該当イベントフォルダに配置
2. ファイル名を `{ニックネーム}.html` にリネーム (例: `taro2023.html`)
3. サムネイル画像を同じ名前で配置 (例: `taro2023.jpg`)
4. 該当イベントの `event.json` の `games` 配列に情報追加
    - id, creator, age, grade, ai, prompt, title を記入

***

## データの独立性

- 各イベントは完全に独立
- 1つのイベントのJSONを編集しても他に影響なし
- イベントフォルダごとバックアップ・移動が可能
- 削除も該当フォルダと`folders.json`から1行削除するだけ

***

## 拡張性

### UI拡張(index.htmlのみ修正で実装可能)
- ページネーション
- 無限スクロール
- 年度別フィルタ
- 年齢別フィルタ
- 使用AI別フィルタ
- 検索機能

### データ拡張(event.jsonに追加可能)
```json
{
  "eventName": "...",
  "eventDate": "...",
  "eventDescription": "...",
  "eventURL": "...",
  "eventThumbnail": "event-photo.jpg",     // イベント写真
  "participantCount": 15,                   // 参加人数
  "games": [...]
}
```

### games配列の拡張(追加可能フィールド例)
```json
{
  "id": "taro2023",
  "creator": "たろう",
  "age": 9,
  "grade": "小学3年生",
  "ai": "ChatGPT",
  "prompt": "宇宙を冒険するゲームを作って",
  "title": "宇宙大冒険",
  "videoURL": "taro2023.mp4",              // プレイ動画
  "playCount": 125,                         // プレイ回数
  "tags": ["アクション", "宇宙"]            // タグ
}
```