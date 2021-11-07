English | [中文](https://github.com/garywill/BigSearch/blob/master/src/README_zh.md)

# Big Search

Handily use **any one** or **multiple** search engines (or search any websites) via a **flexible tool**.

Cross-browser tool. Highly customizable.

We used to do web search step by step. 🐢

We now can do web search efficiently and concurrently. 🚀

![signboard](https://gitlab.com/garywill/bigSearch/-/raw/screenshot/signboard.png)

## To use

Ways to use:

1. Web: Main site https://acsearch.ga | Standby site http://acsearch.tk

   Can be used in different types of browsers. Suitable for both desktop and mobile.
   
   > Remember to read the tips in homepage

2. Browser extension (**recommended**)

   Fully function. More convenient to use multiple search engines at once, without interruption, by continuously clicking.
   
   - [Firefox Addon](https://addons.mozilla.org/firefox/addon/big-search/) 
   
   - [Download .crx](https://gitlab.com/garywill/releaseapps-dl/-/tree/main)  for:
     - Google Chrome, Microsoft Edge etc.
     - Brave, Vivaldi, Opera etc.
     
     > Now Google is charging $5 for a Chrome Store developer account, and I haven't figured out how to pay, due to my region. It would be great if someone willing to help. 
   
   - Microsoft Edge： Please download .crx to install (like Chrome). The Edge Store can't get updates (~~[Edge Store](https://microsoftedge.microsoft.com/addons/detail/big-search/pdmlapcmibobkkchijgfeongemmepkbc)~~)
     
     > A little-known fun fact: Microsoft bans such multi-search addon from being on Edge Store

## Screenshots and Demo

| Screenshots                                                                     |                                                                                           |                                                                                   |                                                                                         |
| ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Extension UI                                                                    | Context selection search                                                                  | Use on web without install                                                        | Mobile UI (web)                                                                         |
| ![screenshot_en](https://gitlab.com/garywill/bigSearch/-/raw/screenshot/en.png) | ![screenshot_context](https://gitlab.com/garywill/bigSearch/-/raw/screenshot/context.png) | ![screenshot_web](https://gitlab.com/garywill/bigSearch/-/raw/screenshot/web.png) | ![screenshot_mobile](https://gitlab.com/garywill/bigSearch/-/raw/screenshot/mobile.png) |

[Watch demo video](https://www.youtube.com/watch?v=hn5BkviAyvQ)

Solve all needs between browsers and search engines. Easily make best use of different web search engines or inquery systems. Or, use as universal web searching home, portal for people expecting good search quality & breadth.

## List of engines

[See list of build-in search engines](https://github.com/garywill/BigSearch/blob/list/list.md#list-of-build-in-search-engines-in-big-search)

## Similar tools comparison

[Comparison of open source web searching (multi-engines) tools](https://github.com/garywill/BigSearch/blob/list/list.md)

## Features

- 🛡️ Safety
  - 🛡️ Minimun default permissions. Won't ask for sensitive permissions until needed. (Browser extension)
  - 🛡️ Pure client-side tool functions fully. No necessary server. No collecting user's input. (Both web and extension)
  - 🛡️ Hide HTTP Referrer by default to protect user privacy.
  - 🛡️ No injection to web. (Browser extension)
- 🔎 Able to collect any (and have collected many) different searching or inquery websites and operate them on one page (any website that supports general GET/POST request)
  > E.g: Google, DuckDuckGo, Amazon, eBay, Dictionary, Github, StackOverflow, IEEE, or the holding of the library near your home (easy to customize). Included 40+
- 🔎 User adding custom-defined search engine (even syncronizable between devices via browser account in browser extension)
- 🔎 Support using browser-installed search engines (browser extension. So you can directly use those engines you've added into browser. Currently only Firefox provides)
- 📁 Search engines catagory
- 📋 Save, reuse and manage your input history (only saved locally in the browser localStorage)
- 🖱️ Quickly use user selected text on webpage as search term (browser extension, through context menu) 
  > - Not in Firefox incognito mode
  > - On Chrome, after clicking context menu item, click the icon on toolbar
- 🖥️ Support desktop and mobile devices (web version)

## Since the browser itself has search engines which can be used on URL bar, why use this?

1. The browser ones does not support POST
2. This provide ability to **send requests to multuple different engines quickly without retyping or copy-paste**
3. This is cross-browser, and the engines data can be easily migrate
4. Catagory feature allows adding many engines without clutter
5. The history feature makes easy to reuse, tweak and try different search terms, which is **quite essential for getting a desired searching result**
6. From other features we can see this is a more powerful tool 

## How to edit search engines

You only need to write JSON and have basic http request knowledge about GET/POST

### Examples

The examples provided here can be put into the "user custom" area

#### Short Format

```yaml
{
    "Google": "https://www.google.com/search?q={0}",
    "Yahoo Search": "https://search.yahoo.com/search?q={0}"
}
```

#### Full Format

Using full format you have opportunity to use all the features of this tool.

Supports mixing short formatted and full formatted elements.

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

    "label_cptsw" : { "lstr": "Computer Software" },
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
    
    "label_mbap" : { "lstr": "Mobile App" },
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

### Specification of Editing Engines Data

In Json format.

> A few years ago when I was designing this data format, I didn’t know about OpenSearch(xml) and Firefox's `search.json.mozlz4`, so I am considering how to make our format compatible with others, and at the same time retain our features, may also be one of the future development plan. Welcome discussion.

<details>

```yaml
// # Some key/value ​​in the button can override the key/value in the engine name
{
    "engine_name": {
        "dname": "Engine display name",
        "addr": "Homepage URL",
        "tip": "Engine tip text", // # optional
        "action": "default action url",
        // # For example, https://search-engine.com/search?q=input_content,
        // # The action is https://search-engine.com/search
        "kw_key": "The key name of the keyword in the query string", // # In above example, it is q
        "allow_referer": false, // # false(default)/true optional
        "method": "get/post", // # The default is get
        "charset": "UTF-8/gb2312/gb18030/big5/iso-xxxx....", // # default UTF-8
        "kw_replace": [[" ", "-"]], // # Optional, characters that need to be replaced in the search term. In this example, replace spaces with '-'
        "kw_format": "formatted string with {0}", // # optional. {0} is like %s

        "btns": { // # If there is no such item, a "search" button is displayed, and clicking the button will do the default action
            "Button name": {
                "label": "Button display text",
                "btn_tip": "Tip text",
                "params":[ // # Optional, the key/value other than the keyword in the query string required for this operation
                    {"key": "key", "val": "value"},
                    // # For example, https://search-engine.com/search?q=input_content&option=searchall
                    // # so {key: "option", val: "searchall"},
                ],
                "full_url": "http://www.example.com/search/{0}", // # optional, the entire url using get method
                "use_other_engine": {   // # optional, use another engine to do the operation
                    "source": "bigsearch/user/browser",   // # Optional. Where the engines database come from (3 available databases): BigSearch build-in database (default) / User custom database / Browser-installed database
                    "engine": "engine name", 
                    "btn": "button name"   // # Optional. Absence will make fallback to the first button
                }
            },
        }

    },
    ......
};
```

> We encourage user to submit their customized search engines data to us after they use JSON customing. Search engines data is AGPL licensed FLOSS.

> If you want some search engines to be included by us, add/submit it to `enginesdata.js`, it is the core data of Big Search.

</details>

## Our Special Technical Features

Comparing to other similar tools, this tool uses JSON for search engines database (both built-in and user-defined), so it has strong flexibility in engine data.

![tech_diagram](https://gitlab.com/garywill/bigSearch/-/raw/screenshot/tech.png)

In addition to ordinary operations on a certain search engine:

- For one engine, different operations are supported (one engine, multiple buttons)
- String formatting user's inputted keyword
- Call another engine (or engine's certain action) to do the action

Therefore, it is **more satisfying to technician people** comparing to similar tools. 

Of course, it is **also completely easy for ordinary people to use**. 

## Plans

<details>

- Add non-search navigation feature
- Be compatible with OpenSearch
- Figure out Ajax based searching (browser extension)
- Be able to be used by CLI in terminal

</details>

## For Developers

### Globalization

<details>

Because there are currently only 2 languages, no framework used yet, only a simple function to implement multi-language. 

For strings that you want it to be multi-language (it's okay to leave it English only, also), use JS function `i18n()`, whose input parameters can be:

- An array of strings (for only Chinese and English 2 languages). `[0]` is Chinese, `[1]` is English
- An Object like `{zh: "This is Chinese, en: "This is English", fr: "This is French"}`

It will return a string of the corresponding language

If you want to add a search engine that only targets users in a certain language, you can use `visible_lang` to make it visible only to a certain language.

</details>

### Third-party libraries and components used

<details>

- [LZ-UTF8.js](https://github.com/rotemdan/lzutf8.js) (compression)
  
  ```
  Copyright (c) 2021, Rotem Dan
  Released under the MIT license.
  ```
- [Floggy Lake](https://www.pexels.com/photo/foggy-lake-2166695/) (background photo)
  
  by Quang Nguyen Vinh
  
</details>

### History, Code Status, and License

<details>

A part of the code of this tool can be traced back to around 2008. Published to be usable to the public on Internet in 2015. Not until early 2020s, I found webExtension and JS standarized, so made this tool a browser extension. （Yes it's developed slowly and gently. Not full-time)

The core part's code has been ever refactored. Although some UI code is not enough to call awesome, **this tool has always been very useful.** Please be generous giving a star 🌟 if you like it.

Have given the engines data `enginesdata.js` AGPL FLOSS license (so welcome adding data 🌱. Or, if you know any license properer for this data 🍀). Feel free to discuss (open an issue) if want FLOSS license for this whole project 💚.

[Change log](https://addons.mozilla.org/firefox/addon/big-search/versions/) 

</details>
