# 大术专搜

以 **灵活的方式** 往 **任何一个** 或 **多个** 搜索引擎（或任意网站、查询系统）发起搜索。

跨浏览器工具。具有高度自定义性。

![signboard](https://gitlab.com/garywill/bigSearch/-/raw/screenshot/signboard.png)

> 图标含意：篆书的「術」（术）字 + 代表搜索/查询的放大镜

## 使用

使用方式有：

1. 网页： 主站 https://acsearch.ga | 备用站 http://acsearch.tk

   可在不同类型浏览器使用。适合桌面及移动设备。
   
   > 记得看主页中的小技巧

2. 浏览器扩展（**推荐**）

   能发挥所有功能。且更方便地连续点击，无间断地一次调用多个搜索引擎。（不会修改任何浏览器设置）
   
   - [Firefox Addon](https://addons.mozilla.org/firefox/addon/big-search/) 
   
   - Chrome、Brave、Vivaldi、Edge、Opera、搜狗浏览器、360浏览器 等 [下载 .crx](https://gitlab.com/garywill/releaseapps-dl/-/tree/main)
     
     > 现在Google要为Chrome Store的开发者账号收费\$5，我还没弄清楚如何支付。如果哪位兄台乐意帮忙
   
   - Microsoft Edge： 请下载.crx安装，商店无法更新（~~[Edge Store](https://microsoftedge.microsoft.com/addons/detail/big-search/pdmlapcmibobkkchijgfeongemmepkbc)~~）
     
     > 鲜为人知的有趣事实：Microsoft禁止这种多搜索引擎的addon在Edge上架

## 截图与演示

| 截图                                                                                |                                                                                           |                                                                                   |                                                                                         |
| --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| 扩展UI                                                                              | 上下文菜单搜索选择内容                                                                               | 免安装网页使用                                                                           | 移动版(web)                                                                                |
| ![screenshot_en](https://gitlab.com/garywill/bigSearch/-/raw/screenshot/en.png)   | ![screenshot_context](https://gitlab.com/garywill/bigSearch/-/raw/screenshot/context.png) | ![screenshot_web](https://gitlab.com/garywill/bigSearch/-/raw/screenshot/web.png) | ![screenshot_mobile](https://gitlab.com/garywill/bigSearch/-/raw/screenshot/mobile.png) |
| 中文界面                                                                              |                                                                                           |                                                                                   |                                                                                         |
| ![screenshot_chi](https://gitlab.com/garywill/bigSearch/-/raw/screenshot/chi.png) |                                                                                           |                                                                                   |                                                                                         |

[Watch demo video](https://www.youtube.com/watch?v=hn5BkviAyvQ)

解决一切浏览器与搜索引擎之间的需求。让你最充分地利用不同的网络搜索引擎或查询系统。也可以作为注重搜索质量和广度的人的网络入口。

## 已收录引擎

[查看收录引擎列表](https://github.com/garywill/bigSearch/blob/list/list.md#list-of-build-in-search-engines-in-big-search)

## 相似工具比较

[开源的多引擎网络搜索工具比较](https://github.com/garywill/bigSearch/blob/list/list.md)

## 功能

- 🔎 可将任意（已将许多）搜索、查询的网站集于一处操作（任意支持普通GET/POST的网站）
  > 例如 百度、Google、淘宝、有道、Github、StackOverflow、IEEE、你家附近某图书馆（易于自定义）藏书查询 等。已收录50+个
- 🔎 用户添加自定义搜索引擎（若在浏览器扩展中，可与同浏览器账号同步）
- 🔎 可调用浏览器内联的搜索引擎（浏览器扩展。因此你已添加进浏览器的搜索引擎可以直接用）
- 🛡️ 纯客户端工具，无中转，无数据库服务器
- 📁 分类卡片
- 📋 可保存、复用和管理你的输入历史（仅保存在浏览器本地）
- 🖥️ 支持桌面设备和移动设备（网页版）
- 🖱️ 快速将选择的网页上的文本作为搜索词（浏览器扩展，通过右键菜单）
  > - Firefox无痕模式中无。
  > - Chrome中点了右键菜单后，需再点击工具栏中的图标
- 🛡️ 默认隐藏HTTP Referrer以保护用户隐私

## 既然浏览器本身可添加搜索引擎在URL栏调用，为什么用这个？

1. 浏览器本身的搜索引擎功能不支持POST
2. 这个可以连续点击，向多个不同引擎快速送出request，不需要再次输入或复制粘贴
3. 这个可跨浏览器快速迁移引擎数据
4. 分类功能允许用户添加很多很多引擎而不至于凌乱
5. 历史功能方便微调搜索词，**这对于获得想要的搜索结果很关键**
6. 从其他特性也可见，这个是一个更强大的工具

## 如何编辑搜索引擎

只需要会简单的JSON，和GET/POST这一基本http request知识

### 例子

此处提供的例子可用于放入“用户自定”区域以供尝试

#### 简短形式

```yaml
{
    "百度": "https://www.baidu.com/s?wd={0}",
    "Google": "https://www.google.com/search?q={0}",
    "Yahoo Search": "https://search.yahoo.com/search?q={0}"
}
```

#### 完整形式

使用完整形式有机会发挥本工具所有功能。

亦支持将 简短形式 和 完整形式 混合使用。

<details>

```yaml
{
    "yahoo": {
        "dname": "Yahoo Search",
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
                "label": "Google Search"
            },
            "lucky": {
                "label": "I'm Feeling Lucky",
                "params": [
                    {"key":"btnI", "val": "1"}
                ]
            }
        }
    },

    "label1" : { "lstr": "Computer Software" },
    "flathub": {
        "dname": "Flathub",
        "addr": "https://flathub.org/apps",
        "btns": {
            "search": {
                "label": "Search",
                "full_url": "https://flathub.org/apps/search/{0}"
            }
        }
    },
    
    "label2" : { "lstr": "Mobile App" },
    "itunesapps": {
        "dname": "iTunes Apps (Google)",
        "addr": "https://www.apple.com/itunes/charts/free-apps/",
        "btns": {
            "search_apps": {
                "label": "Search Apps",
                "use_other_engine": {
                    "engine": "google",
                    "btn": "search"
                },
                "kw_format": "{0} site:apple.com/*app"
            }
        }
    }
}
```

</details>

### 编辑引擎数据说明

JSON格式。

> 数年前，我在编制这种数据格式的时候，还不知道有OpenSearch（xml）和Firefox的`search.json.mozlz4`，因此考虑如何将我们的数据格式与一些其他格式兼容，同时又要能保留我们的特色功能，可能也是未来开发点之一。欢迎讨论

<details>

```yaml
// # 按钮之下的某些键值可覆盖引擎名下的键值
{
    "引擎名": {
        "dname": "引擎显示名字", 
        "addr": "主页URL", 
        "tip": "引擎提示文字",  // # 可选
        "action": "默认操作url", 
        // # 例如，https://search-engine.com/search?q=输入内容，
        // # 则action为https://search-engine.com/search
        "kw_key": "query string中关键字的键名", // # 上例中，此处为q
        "allow_referer": false, // # false(default)/true 可选
        "method": "get/post",  // # 默认为get
        "charset": "UTF-8/gb2312/gb18030/big5/....", // # 默认UTF-8
        "kw_replace": [ [" ", "-"] ] ,  // # 可选，关键字中需要替换的字符，此例将空格替换为'-'
        "kw_format": "格式化关键字{0}后的样子", // # 可选. {0}即常见的%s

        "btns": {  // # 若没有此项，则显示一个"搜索"按钮，点击按钮为默认行动
            "按钮名": {
                "label": "按钮显示文字",
                "btn_tip": "提示文字",
                "params":[   // # 可选，该操作所需的query string中关键字之外的键和值
                    {"key": "键", "val": "值"},
                    // # 例如，https://search-engine.com/search?q=输入内容&option=searchall
                    // # 则 {key: "option", val: "searchall"},
                ],
                "full_url": "http://www.example.com/search/{0}",   // # 可选，使用get method时的整个url
                "use_other_engine": { "engine": "引擎名", "btn": "按钮名" }, // # 可选，使用另一个引擎来操作
            },

        }
    },
    ......
};
```

> 用户使用了JSON自定义引擎后，我们鼓励用户也将数据提交回上游源代码。引擎数据为AGPL自由代码。

> `enginesdata.js`是收录搜索引擎的数据，若要添加搜索引擎使被收录，往这里添加。

</details>

## FAQ

<details>

**Q：我使用大术专搜来搜索时，输入的内容是否会被收集？**

A：不会，我们不收集任何用户输入的内容。输入的内容直接发送到你点击调用的对应网站，无中转

**Q：我的搜索历史储存在哪里？**

A：仅储存在浏览器localStorage中

**Q：你们有网页版本，也有浏览器扩展版本，那么浏览器扩展是可以“离线使用”的吗？**

A: 浏览器扩展的功能是可以“离线使用”的，js等代码都在本地扩展中

</details>

## 技术特色

与其他同类工具相比，这个工具使用JSON格式作为引擎数据库（包括自带的及用户自定义的），因此在引擎数据方面具有强大的灵活性

![tech_diagram](https://gitlab.com/garywill/bigSearch/-/raw/screenshot/tech.png)

除了普通的对某一个搜索引擎进行单一操作外，还具有：

- 对于一个引擎，支持不同的操作（一引擎，多按钮）
- 对用户输入进行字符串格式化
- 调用引擎库中的另一个引擎中的某一按钮动作，以实现对某一本身不支持搜索的网站进行搜索

因此，它**比同类工具更能让技术型人群满意**。

当然，**普通人也完全可以轻松使用**。

## 计划

<details>

- 增加非搜索导航功能
- 兼容OpenSearch
- 尝试支持基于Ajax的搜索（浏览器扩展）
- 在终端内调用的CLI

</details>

## For Developers

### 国际化

<details>

因为目前只有2种语言，尚未使用任何框架，只用了一个简单函数实现多语言。

对于要多语言的字符串（单独是英文也行），使用JS函数`i18n()`，其输入参数可以是：

- 一个字符串数组（仅中文及英文两种语言时用）。`[0]`内为中文，`[1]`内为英文
- 一个Object如 `{zh: "这是中文, en: "这是英文", fr: "这是法文"}`

该函数执行时会返回对应语言的一个字符串

如果你想添加一个仅针对某一语言用户的搜索引擎，可以在引擎数据中使用`visible_lang`，以使它只对某语言可见。

</details>

### 历史、代码状况、许可证

<details>

这工具的代码一部分最早可追溯到2008年左右。2015年首次发布在网上可公开使用。2020年代初，才发现webExtension和JS已经标准化，于是做出了浏览器扩展版本。（是的，慢慢地发展，不是全职的）

核心部分有过重构。尽管UI部分有些代码不能叫很好，但**这个东西一直很好用**。喜欢还请不吝Star🌟。

已给了搜索引擎数据`enginesdata.js`AGPL自由许可（欢迎来添加引擎数据哦💚。或者，你觉得有什么比AGPL更适合这些数据的许可🤝）。若需要整个项目的自由许可，欢迎讨论🧡（open an issue）。

[Change log](https://addons.mozilla.org/firefox/addon/big-search/versions/)

</details>
