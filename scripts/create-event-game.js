const fs = require('fs');
const path = require('path');

// workshop-gamesフォルダへのパス
const workshopDir = path.join(__dirname, '..', 'com', 'workshop-games');

const eventDate = process.argv[2];

if (!eventDate) {
    console.error('使用方法: node scripts/create-event-game.js YYYY-MM-DD');
    process.exit(1);
}

// イベントフォルダパス
const eventFolder = path.join(workshopDir, eventDate);
const eventJsonPath = path.join(eventFolder, 'event.json');

// event.jsonが既に存在する場合は警告して終了
if (fs.existsSync(eventJsonPath)) {
    console.error(`❌ エラー: ${eventDate}/event.json は既に存在します`);
    console.error(`既存のファイルを保護するため、処理を中止しました。`);
    console.error(`\n別の日付を指定するか、既存のファイルを手動で編集してください。`);
    process.exit(1);
}

// フォルダ作成
if (!fs.existsSync(eventFolder)) {
    fs.mkdirSync(eventFolder, { recursive: true });
    console.log(`✓ フォルダ作成: com/workshop-games/${eventDate}/`);
} else {
    console.log(`ℹ フォルダは既に存在します: ${eventDate}/`);
}

// event.json のテンプレート(サンプルゲーム付き)
const eventTemplate = {
    eventName: "イベント名を入力",
    eventDate: eventDate,
    eventDescription: "イベントの説明を入力してください",
    eventURL: "",
    eventImage:`${eventDate}.png`,
    games: [
        {
            id: "sample001",
            creator: "サンプル太郎",
            age: 10,
            grade: "小学4年生",
            ai: "ChatGPT",
            prompt: "サンプルゲームを作って",
            title: "サンプルゲーム"
        }
    ]
};

// event.json を作成
fs.writeFileSync(eventJsonPath, JSON.stringify(eventTemplate, null, 2), 'utf8');
console.log(`✓ ファイル作成: com/workshop-games/${eventDate}/event.json`);

// folders.json を更新
const foldersPath = path.join(workshopDir, 'folders.json');
let folders = [];

if (fs.existsSync(foldersPath)) {
    folders = JSON.parse(fs.readFileSync(foldersPath, 'utf8'));
}

if (!folders.includes(eventDate)) {
    folders.push(eventDate);
    folders.sort();
    fs.writeFileSync(foldersPath, JSON.stringify(folders, null, 2), 'utf8');
    console.log(`✓ folders.json を更新`);
} else {
    console.log(`ℹ ${eventDate} は既に folders.json に存在します`);
}

console.log('\n✅ 完了! 次のステップ:');
console.log(`1. com/workshop-games/${eventDate}/event.json を編集`);
console.log(`2. サンプルゲームを削除して実際のゲーム情報を追加`);
console.log(`3. ゲームファイルを com/workshop-games/${eventDate}/ に追加`);
