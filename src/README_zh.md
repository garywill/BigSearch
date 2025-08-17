[![firefox](https://img.shields.io/amo/v/big-search?style=flat-square&color=success)](https://addons.mozilla.org/firefox/addon/big-search/) [![chrome](https://img.shields.io/chrome-web-store/v/ojcnjeigmgjaiolalpapfnmmhdmpjhfb?style=flat-square&color=success)](https://chrome.google.com/webstore/detail/big-search/ojcnjeigmgjaiolalpapfnmmhdmpjhfb) 

# 大术专搜

以 灵活又顺手 的方式 在(切换) **任意一个** 或 (连续)**多个** 搜索引擎（或任意网站）进行搜索。

新手友好，专家满意。包括日常、娱乐及工作。 

俱有 多搜索引擎工具 该有的**基本功能**，如：
- 内置 百度,Google,B站,Youtube,Github,淘宝 等
- GET/POST
- 自定引擎

等。 <ins><u>在具有了 以上 基本功能 **之后**，它**还可以**✨：</u></ins>
- 🖋️ 文本单行或**多行**
- ⌨️ 调用搜索的过程可完全仅用键盘，不碰鼠标。其自身UI里内置**类似Vimium**的功能，键盘可点击不同的搜索引擎（[详情](#vem特性内置类似vimium)）
- 🖥️ 桌面（扩展或网页）和移动（网页）
- 🔎 **甚至兼容**那些 **不**对外开放GET/POST搜索接口 的网站（这里称其为**In-page-Ajax-render**）（详见下[FAQ](#FAQ)）
- 🔎 一个按钮一次调用多个操作。跨引擎呼叫搜索
- 💪 用户可**JSON编程**做高级自定义（亦有**GUI**易用编辑）。引擎数据 和 搜索方式 的 **高灵活性** （[详情](#编辑引擎数据及各种搜索方式说明)）

等...详见下文

**视频介绍**：特色概括+完整说明：  [Bilibili](https://www.bilibili.com/video/BV1J14y1k7jv/) | [Youtube](https://youtu.be/8xhLpw57ufc) （分章节视频，可直接看某一功能的使用说明）

![signboard](https://gitlab.com/garywill/bigSearch/-/raw/screenshot/signboard.jpg)

<p align="center">大术专搜 👨‍💻　 既专又广 🗺️　 手敲几下 🖱️ 纵横去往　（装逼时间）</p> 

> 图标含意：「**術**」（术）字 篆刻简版线条 + 放大镜 代表搜索查询

> 名称含意：1.在搜索方面有强大的技术技巧 2.亦可以搜索「术」这类内容 （起了个很装逼/扮嘢/作势的名字～）


<!--ts-->
   * [开始安装使用](#开始安装使用)
   * [基础屏幕截图 及演示、视频](#基础屏幕截图-及演示视频)
   * [功能及特性](#功能及特性)
      * [基本](#基本)
      * [更多](#更多)
      * [还有更多：特别之处](#还有更多特别之处)
      * [Vem特性（内置类似Vimium）](#vem特性内置类似vimium)
      * [隐私安全](#隐私安全)
   * [FAQ](#faq)
         * [Q: 到底什么是「In-page-Ajax-render」?](#q-到底什么是in-page-ajax-render)
   * [已收录引擎](#已收录引擎)
   * [相似工具和方法比较](#相似工具和方法比较)
   * [如何编辑搜索引擎（GUI或JSON）](#如何编辑搜索引擎gui或json)
      * [例子](#例子)
         * [简短形式](#简短形式)
         * [完整形式](#完整形式)
      * [编辑引擎数据及各种搜索方式说明](#编辑引擎数据及各种搜索方式说明)
         * [数据说明](#数据说明)
         * [搜索In-page-Ajax-render的网站](#搜索in-page-ajax-render的网站)
   * [For Developers](#for-developers)
<!--te-->


## 开始安装使用

使用方式有：

1. 浏览器扩展（**推荐**）
   - [Firefox Addon ![](https://img.shields.io/amo/v/big-search?style=flat-square&color=success)](https://addons.mozilla.org/firefox/addon/big-search/)
   - [Chrome Addon ![](https://img.shields.io/chrome-web-store/v/ojcnjeigmgjaiolalpapfnmmhdmpjhfb?style=flat-square&color=success)](https://chrome.google.com/webstore/detail/big-search/ojcnjeigmgjaiolalpapfnmmhdmpjhfb)  或 [下载 .crx](https://gitlab.com/garywill/releaseapps-dl/-/tree/main)。 适用于：Google Chrome、Microsoft Edge、Brave、Vivaldi、Opera、~~搜狗浏览器~~(部分)、360极速浏览器(部分) 等 

2. [网页版 ![](https://img.shields.io/website?down_message=repairing&style=flat-square&up_color=blue&url=http%3A%2F%2Facsearch.atwebpages.com)](http://acsearch.atwebpages.com)：演示作用为主，网页版不能像扩展一样完全工作。网页版可在手机浏览器使用。 

## 基础屏幕截图 及演示、视频

| 使用扩展    |  可深可广   | UI风格可选 | 
| --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| ![chi](https://gitlab.com/garywill/bigSearch/-/raw/screenshot/chi.jpg)  | ![breadth_chi](https://gitlab.com/garywill/bigSearch/-/raw/screenshot/breadth_chi.jpg) | ![themes](https://gitlab.com/garywill/bigSearch/-/raw/screenshot/themes.jpg)   |  
| 搜索选择内容    | 几种UI显示方式                                                                           | Vem (类似Vimium)  | 
| ![context](https://gitlab.com/garywill/bigSearch/-/raw/screenshot/context.png) | ![3ui](https://gitlab.com/garywill/bigSearch/-/raw/screenshot/3ui.webp) | ![vem](https://gitlab.com/garywill/bigSearch/-/raw/screenshot/vem.webp) | 
| 编辑搜索引擎 | 特别搜索方式 灵活、可扩展 |  | 
| ![edit](https://gitlab.com/garywill/bigSearch/-/raw/screenshot/edit.png) | ![edit-add](https://gitlab.com/garywill/bigSearch/-/raw/screenshot/edit-add.png) |  | 

![demo_gif](https://gitlab.com/garywill/bigSearch/-/raw/screenshot/demo.gif)

视频介绍：特色概括+完整说明：  [Bilibili](https://www.bilibili.com/video/BV1J14y1k7jv/) | [Youtube](https://youtu.be/8xhLpw57ufc) （分章节视频，可直接看某一功能的使用说明）

## 功能及特性

### 基本

- 🔎 **任意**搜索引擎、查询网站（内置90+）集于一处(连续)操作。任何支持GET/POST的
- 🔎 **自定义**搜索引擎（[详情](#如何编辑搜索引擎GUI或JSON)）（在扩展中可同步）
- 🔎 调用**浏览器内联**的搜索引擎（扩展。因此已加进浏览器的可直接用。仅Firefox）

### 更多

- 🖋️ 单行或**多行** 文本编辑及发送
  > 例如需要翻译文章段落时就很有用
- 🗂️ 引擎**分类**卡片
- 📋 保存（仅在本地）、**复用**和管理搜索历史（无痕模式下不保存）。复用方式：双击动作
  - 单行编辑时：替换文本框
  - 多行编辑时：插入至光标
- 🖱️ 将**选择**的文本(单行或多行)作为搜索词
  > - Firefox无痕模式中无 ([bug 1380812](https://bugzilla.mozilla.org/show_bug.cgi?id=1380812)).
- ⌨️ 可自定的**快捷键**。默认为（可能需自行修改）：
  - 唤出界面。Firefox: `Ctrl+Alt+S`  Chrome及其他：`Ctrl+Shift+S` 
  - 将选择文本设定为搜索词。Firefox: `Ctrl+Alt+D`  Chrome及其他：`Ctrl+Shift+D`
  > [Firefox更改](https://bug1303384.bmoattachments.org/attachment.cgi?id=9051647) | Chrome更改 `chrome://extensions/shortcuts` 
- 🖥️ 适配多处：**桌面**（扩展或网页）和**移动**（网页）。扩展在工具栏按钮弹出界面、独立标签、侧边栏（浏览器原生）多处可用

### 还有更多：特别之处

- ⌨️ Vem特性：内置**类似Vimium**的功能，可用键盘快捷点击不同的搜索引擎（[详情](#vem特性内置类似vimium)）
- 🔎 **甚至兼容**那些 **不**对外开放GET/POST搜索接口 的网站（这里称其为**In-page-Ajax-render**）（[详情](#搜索In-page-Ajax-render的网站)）
- 🔎 一个按钮一次调用多个操作
- ✨ 好看强大的同时，非常**轻量级**（[详情](#采用的第三方库和组件)）
- 💪 用户可**JSON编程**做高级自定义（亦有**GUI**易用编辑）。内置的 及 用户自定义 的引擎采用同种数据格式（[详情](#编辑引擎数据及各种搜索方式说明)）。引擎数据 和 搜索方式 的 **高灵活性**：
  - 🔲 **一引擎，多按钮**：对于一个引擎，可以支持不同的操作。（各按钮继承引擎的数据，按钮之下的某些键值可覆盖引擎名下的键值数据作用）
  - 📞 **跨引擎**调用：可调用另一引擎（中的某一按钮的动作）来动作
  - 🔏 可针对引擎需要，对用户输入进行字符串格式化，或字符替换，编码选择
  - 🔎 适当结合上两点，可搜索不提供搜索的网站

### Vem特性（内置类似Vimium）

若你用过 `!bang`（DuckDuckGo的） 或 omnibox 等 快捷键，它们都要求你背诵代号。

而 大术专搜 的 Vem模式 让你 **可视化**、快捷 地 用**键盘** (连续)点击不同的搜索引擎的不同按钮。使用`Shift+Enter`进入Vem模式

![vem](https://gitlab.com/garywill/bigSearch/-/raw/screenshot/vemgif.gif)

> 这部分未翻译完成。详细见英文文档对应的本部分

### 隐私安全

- 🛡️ **不**向网页注入任何代码（除搜索In-page-Ajax-render网站时外）
- 🛡️ **纯客户端**功能及数据完整，不需第三方服务器。完全**无**搜集任何用户数据
- 🛡️ 用户自定义引擎的GUI编辑器为在线使用（减小扩展体积），若追求极致的安全性，也可以将它们之间的通信禁用，采用手动编辑

## FAQ

#### Q: 到底什么是「In-page-Ajax-render」?

A: 

普通的GET/POST搜索流程是：
1. 你输入搜索词，点击搜索按钮
1. 你的浏览器把搜索词装入GET/POST query中，发到你指定的目标网站
1. 你的浏览器打开新tab并载入目标网站返回的HTML

大术专搜的In-page-Ajax-render搜索功能是：
1. 你输入搜索词，点击搜索按钮
1. 你的浏览器打开你指定的目标网站页面（未发送搜索词）
1. 本工具向该页面注入一个简单的JS，把你的搜索词填入页面上的文本框中（通过你指定的css selector找到它），然后JS模拟点击提交按钮（同样通过你的css selector找到）动作
1. 网站页面本身的JS会起作用，Ajax获取搜索结果，浏览器渲染展示在该页面上

本工具的In-page-Ajax-render搜索功能，可以用于搜索那些不对外开放GET/POST搜索接口的（例如SPA型网页），或者要检验在搜索入口表单分配的随机token的

「In-page-Ajax-render」是 **In-page**-submit-form-via-**Ajax**-then-XHR-gets-search-result-then-**render**-and-show-in-page-without-web-frame-navigation 的简称。

> 视频说明中也有关于这部分的解读

## 已收录引擎

目前 90+ 。[查看收录引擎列表](https://github.com/garywill/BigSearch/blob/list/list.md#list-of-build-in-search-engines-in-big-search)

## 相似工具和方法比较

[开源的多引擎网络搜索工具比较](https://github.com/garywill/BigSearch/blob/list/list.md)

有经验的用户可看直观的横向比较，快速了解“独门”特色。（顺便了解其他工具）

## 如何编辑搜索引擎（GUI或JSON）

[在线GUI引擎编辑工具（link 1）](https://garywill.github.io/BigSearch/editengine.html) （[link 2](http://acsearch.atwebpages.com/editengine.php)） 

一般用以上GUI编辑器即可。若不用GUI（例如你是高级用户，或想使用进阶特性），可以继续阅读以下关于JSON数据的说明。

大术专搜用户可通过编程的方式设置搜索引擎。以下讲述JSON格式的编辑引擎说明。以下两者皆适用：

1. 用户自定义的私人引擎
2. 大术专搜内置搜索引擎（`enginesdata.js`）

### 例子

#### 简短形式

只需要很简单的JSON，及基本HTTP `GET Method`知识。

```json
{
    "百度": "https://www.baidu.com/s?wd={0}",
    "Google": "https://www.google.com/search?q={0}",
    "Yahoo Search": "https://search.yahoo.com/search?q={0}"
}
```

<details>
<summary>关于简短形式的更多说明</summary>

以上虽然简单且正确，但如果你是程序员，建议不要将key和显示名称混用。例如，应该至少用：

```json
{
    "baidu": {
        "dname": "百度",
        "full_url": "https://www.baidu.com/s?wd={0}"
    }
}
```

</details>

#### 完整形式

使用完整形式有机会发挥本工具所有功能。

亦支持将 简短形式 和 完整形式 混合使用。

<details>
<summary>完整形式例子</summary>

```json
{
    "yahoo": {
        "dname": "Yahoo搜索",
        "addr": "https://search.yahoo.com",
        "action": "https://search.yahoo.com/search",
        "kw_key": "q"
    },

    "google": {
        "dname": "Google",
        "addr": "https://www.google.com",
        "action": "https://www.google.com/search",
        "kw_key": "q",
        "btns": {
            "search": {
                "label": "Google一下"
            },
            "lucky": {
                "label": "运气不错",
                "params": [
                    {"key":"btnI", "val": "1"}
                ]
            }
        }
    },

    "label_mbap" : { "lstr": "跨引擎" },
    "itunesapps": {
        "dname": "iTunes Apps (Google)",
        "addr": "https://www.apple.com/itunes/charts/free-apps/",
        "btns": {
            "search_apps": {
                "label": "Search Apps",
                "kw_format": "{0} site:apple.com/*app",
                "use_other_engine": {
                    "engine": "google",
                    "btn": "search"
                }
            }
        }
    },

    "label_usaj": { "lstr": "搜 In-page-Ajax-render 的网站" },
    "chrome_ext_dev": {
        "dname": "Chrome Ext Dev Doc",
        "addr": "https://developer.chrome.com/docs/extensions/reference/",
        "action": "https://developer.chrome.com/docs/extensions/reference/",
        "ajax": ".search-box__input"
    },

    "label_many": { "lstr": "一次搜索多个引擎" },
    "many_once" : {
        "dname": "多个引擎",
        "btns": {
            "gg_ddg": {
                "label": "Google + DDG",
                "use_other_engine": ["google", "duckduckgo"]
            }
        }
    }
}
```

> 视频说明中也有关于这部分的解读

</details>


### 编辑引擎数据及各种搜索方式说明

#### 数据说明

JSON格式。

使用 完整形式 的引擎数据可以包含以下键值（其中包含了特别搜索方式的说明）：

<details>
<summary>数据说明</summary>

```yaml
// # 按钮之下的某些键值可覆盖引擎名下的键值
{
    "引擎名": {
        "dname": "引擎显示名字", 
        "addr": "主页URL",   // # 可选
        "tip": "引擎提示文字",  // # 可选
        
        "action": "表单目标url", 
        // # 例如，https://search-engine.com/search?q=输入内容，
        // # 则action为https://search-engine.com/search
        "kw_key": "query string中关键字的键名", // # 上例中，此处为q
        
        "full_url": "http://www.example.com/search/{0}",   // # 可选。仅GET method时。会覆盖上两个。整个url
        
        "method": "get/post",  // # 可选 默认为get
        
        "charset": "UTF-8/gb2312/gb18030/big5/....", // # 可选 默认UTF-8 (注意：不支持full_url)
        
        "allow_referer": false, // # false(default)/true 可选
        
        "kw_replace": [ [" ", "-"] ] ,  // # 可选，关键字中需要替换的字符，此例将空格替换为'-'
        "kw_format": "格式化关键字{0}后的样子", // # 可选. {0}即常见的%s

        "params":[   // # 可选，该操作所需的query string中关键字之外的键和值。POST method时常需要
            {"key": "键", "val": "值"},
            // # 例如，https://search-engine.com/search?q=输入内容&option=searchall
            // # 则 {key: "option", val: "searchall"},
        ],
        
        "use_other_engine": {   // # 可选，使用另一个引擎来操作。
            "dbname": "bigsearch/user/browser",   // # 可选，另一个引擎的数据来源（3个可能来源数据库）：大术专搜内建库（缺省）/用户自定库/浏览器内置库
            "engine": "引擎名", 
            "btn": "按钮名"    // # 可选。无则使用第一个按钮
            // # 这一整个object也可简化成一个引擎名字符串
        },
        // # （如果是个数组，则可一次调用多个操作）
        
        "ajax": ......  // # 可选。详见专门的搜索In-page-Ajax-render网站说明
            
        "btns": {  // # 可选。若没有此项，则显示一个"搜索"按钮，点击按钮为默认行动
            "按钮名": {
                "label": "按钮显示文字",
                "btn_tip": "提示文字", // # 可选
                
                "..." : "..." // # 这里可以有键值。按钮下的会覆盖引擎下的
            },
            ....
        }
    },
}
```

> 视频说明中也有关于这部分的解读

</details>

#### 搜索In-page-Ajax-render的网站

有些网站无公开的GET/POST搜索接口（或搜索结果非以HTML返回），需要打开它们的页面后输入，它们然后通过Ajax展现结果。（见[FAQ](#FAQ)）

大术专搜支持收录和调用这类网站（通过你的浏览器往页面注入js，实现输入、点击、表单提交的自动化），且易配置：

例1：指定输入框的css selector。将自动进行关键词输入，模拟回车动作

```json
"ajax": "#search-box-input"
```

例2：先延时2s，输入，再延时1s，然后模拟点击按钮

```json
"ajax": [2000, "#search-box-input", 1000, "#submit-button"]
```

> 视频说明中也有关于这部分的解读

<p align="center">大术专搜 👨‍💻　万页在手 🗺️　　网之所询 🌐　无不可收　（装逼时间）</p>

## For Developers

> 用户使用自定义后，我们鼓励将JSON提交到源码（往`enginesdata.js`文件提交）

### What's Next Step?

目前可见的一些改进、完善、发展空间：

- Omnibox 
- 兼容OpenSearch等，一键自动添加或转换

### 技术框图

<details>

![tech_diagram](https://gitlab.com/garywill/bigSearch/-/raw/screenshot/tech.png)

</details>

### 采用的第三方库和组件

**快速**且**轻量**: 不使用任何大型库或框架。尽管UI既有简洁又有丰富风格，所有主要功能和UI皆是纯JS+CSS。  ![](https://img.shields.io/github/languages/code-size/garywill/BigSearch)

<details>

- [LZ-UTF8.js](https://github.com/rotemdan/lzutf8.js) (38kB not minified. Data compression library, only for user-custom engines sync)
  
  ```
  Copyright (c) 2021, Rotem Dan
  Released under the MIT license.
  ```

- [Foggy Lake](https://www.pexels.com/photo/foggy-lake-2166695/) (37kB webp. Optional background photo)
  
  by Quang Nguyen Vinh

- [Unicons icon](https://github.com/Iconscout/unicons) (svg)
  
  Unicons by [Iconscout](https://iconscout.com/)

</details>

### 国际化

<details>

因为目前只有中英2种语言，尚未使用任何框架，只用了一个简单函数实现多语言。

对于要多语言的字符串（单独是英文也行），使用JS函数`i18n()`，其输入参数可以是：

- 一个字符串数组（仅中文及英文两种语言时用）。`[0]`内为中文，`[1]`内为英文
- 一个Object如 `{zh: "这是中文, en: "这是英文", fr: "这是法文"}`

该函数执行时会返回对应语言的一个字符串

如果你想添加一个仅针对某一语言用户的搜索引擎，可以在引擎数据中使用`visible_lang`，以使它只对某语言可见。

</details>

### 历史、代码状况、许可证

<details>

这工具的代码一部分最早可追溯到2008年左右。2015年首次将网页功能发布在网上可公开使用。2020年代初，才发现webExtension和JS已经标准化，于是做出了浏览器扩展版本并开了Github repo。（是的，慢慢地发展，不是全职的）

有过（并可能仍会有）重构。尽管部分代码仍有岁月的痕迹，但**一直很现代并很好用**。

代码在AGPL许可下发布

[Change log](https://addons.mozilla.org/firefox/addon/big-search/versions/)

</details>
