# ja 術語表

## 語気

- です・ます体。読者への呼びかけは省略し、「あなた」は使わない。
- 句読点は「、」「。」。英数字と日本語の間に半角スペースを入れる（`JSON を貼り付け`）。かっこは「」。
- ボタン名は「…」で囲み、`action` / `label` と完全に一致させる。
- カタカナ語は長音を付ける（フォーマッター、コンバーター、プライバシー）。

## サイトの概念とUI語

| 概念 | 訳語 | 避ける |
|---|---|---|
| Tool | ツール | アプリ、ユーティリティ |
| Category | カテゴリ | 分類、タグ |
| preset | プリセット | バリアント |
| ブラウザ内で実行 | ブラウザ内で処理 | クライアントサイド |
| アップロードしない | アップロードされません／デバイスの外に出ません | クラウドに送信されません |
| コピー／ダウンロード／キャンセル | コピー／ダウンロード／キャンセル | 保存 |
| 使い方／よくある質問／関連ツール | 使い方／よくある質問／関連ツール | チュートリアル |
| validate | 検証 | チェック |
| compress（容量） | 圧縮 | 縮小 |
| minify | 圧縮（JSON は「圧縮して1行に」） | 最小化 |
| format（JSON） | 整形 | フォーマット |
| transcribe | 文字起こし（動詞として「認識」は避ける。「音声認識モデル」は可） | 認識 |
| merge | 結合 | 統合 |
| device | デバイス | 端末 |
| encode / decode / URL-safe / padding | エンコード / デコード / URL セーフ / パディング | 暗号化 |
| percent-encoding / hash (digest) | パーセントエンコーディング / ハッシュ | ダイジェスト（「ハッシュ値」で統一） |
| JWT / header / payload / claim / signature | JWT / ヘッダー / ペイロード / クレーム / 署名 | 請求、シグネチャ |
| Unix timestamp / time zone | Unix タイムスタンプ / タイムゾーン | エポック秒、時間帯 |
| alpha / hue / gamut | アルファ（透明度）/ 色相 / 色域 | 不透明度、色合い、ガマット |

## ツールとカテゴリの名称

| id | 名称 |
|---|---|
| json-formatter | JSON フォーマッター |
| http-header-checker | HTTP ヘッダーチェッカー |
| image-compressor | 画像圧縮 |
| image-converter | 画像変換 |
| merge-pdf | PDF 結合 |
| video-converter | 動画変換 |
| speech-to-text | 音声文字起こし |
| base64-encode-decode | Base64 エンコード/デコード |
| url-encode-decode | URL エンコード/デコード |
| hash-generator | ハッシュ生成 |
| jwt-decoder | JWT デコーダー |
| timestamp-converter | タイムスタンプ変換 |
| color-converter | カラー変換 |
| developer / image / pdf / media | 開発者・テキスト／画像／PDF／動画・音声 |
