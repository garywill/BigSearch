[![firefox](https://img.shields.io/amo/v/big-search?style=flat-square&color=success)](https://addons.mozilla.org/firefox/addon/big-search/) [![chrome](https://img.shields.io/chrome-web-store/v/ojcnjeigmgjaiolalpapfnmmhdmpjhfb?style=flat-square&color=success)](https://chrome.google.com/webstore/detail/big-search/ojcnjeigmgjaiolalpapfnmmhdmpjhfb)

<!--readme_lang_switch begin-->
English | [中文](https://github.com/garywill/BigSearch/blob/master/src/README_zh.md)
<!--readme_lang_switch end-->

# Big Search

Handily use / switch **any one** or **multiple** (uninterruptedly) **search engines** (or search any websites).

Friendly to novices, satisfying to experts. For daily, entertainment & work.

Includes **basic features** that a multi-engine web search tool should have:
- Built-in Google,DuckDuckGo,Youtube,eBay,Github etc
- GET/POST
- Custom engines

and so on. <ins><u>**Besides** above basic features, it **can also**✨: </u></ins>
- 🖋️ Single-line or **multi-line** text
- ⌨️ Every search step can be done by just keyboard, without mouse. It's UI has built-in **Vimium-like** feature. Keys can quickly call different search engines ([details](#vem-feature-built-in-vimium-like))
- 🖥️ Desktop (browser extension / web app) and mobile (web app)
- 🔎 **Even works with** websites that **don't** provide GET/POST interface (so-called **In-page-Ajax-render** websites) (see [FAQ](#FAQ) below)
- 🔎 Do many operations at once by one button. Cross-engine search calling
- 💪 User **JSON programatical** advanced customization (**GUI** easy editing also). **Great flexibility**  in engine data & search method ([details](#Specification-of-Editing-Engines-Data-and-Special-Search-Methods))

and so on... Go on for readme

![signboard](https://gitlab.com/garywill/bigSearch/-/raw/screenshot/signboard.jpg)

<p align="center">
Search everywhere 🗺️ for everything 👨‍💻. Breadth & Focus.<br>
</p>

<details>
<summary><b>Table of Contents</b></summary>

<!--ts-->
   * [Start to Install &amp; Use](#start-to-install--use)
   * [Basic Screenshots, Demo, Video](#basic-screenshots-demo-video)
   * [Features](#features)
      * [Basic](#basic)
      * [More](#more)
      * [Even more: What's special about it](#even-more-whats-special-about-it)
      * [Vem feature (built-in Vimium-like)](#vem-feature-built-in-vimium-like)
      * [Safety &amp; Privacy](#safety--privacy)
   * [FAQ](#faq)
         * [Q: What is "In-page-Ajax-render" ?](#q-what-is-in-page-ajax-render-)
   * [List of engines](#list-of-engines)
   * [Similar tools &amp; methods comparison](#similar-tools--methods-comparison)
   * [How to edit search engines (GUI or JSON)](#how-to-edit-search-engines-gui-or-json)
      * [Examples](#examples)
         * [Short Format](#short-format)
         * [Full Format](#full-format)
      * [Specification of Editing Engines Data and Special Search Methods](#specification-of-editing-engines-data-and-special-search-methods)
         * [Specifications](#specifications)
         * [Instructions for searching In-page-Ajax-render websites](#instructions-for-searching-in-page-ajax-render-websites)
   * [For Developers](#for-developers)
<!--te-->

</details>

## Start to Install & Use

Ways to use:

1. Browser extension (**recommended**)
   - [Firefox Addon ![](https://img.shields.io/amo/v/big-search?style=flat-square&color=success)](https://addons.mozilla.org/firefox/addon/big-search/)
   - [Chrome Addon ![](https://img.shields.io/chrome-web-store/v/ojcnjeigmgjaiolalpapfnmmhdmpjhfb?style=flat-square&color=success)](https://chrome.google.com/webstore/detail/big-search/ojcnjeigmgjaiolalpapfnmmhdmpjhfb) or [download .crx](https://gitlab.com/garywill/releaseapps-dl/-/tree/main). For: Google Chrome, Microsoft Edge, Brave, Vivaldi, Opera etc.

2. Web App: For demo purpose. Web app can't function fully like extension. Web app can be used on mobile browsers.  [http://acsearch.tk ![](https://img.shields.io/website?down_message=repairing&style=flat-square&up_color=blue&url=http%3A%2F%2Facsearch.tk)](http://acsearch.tk)
   

## Basic Screenshots, Demo, Video

| Use Extension   |  Breadth & Focus   | UI style choosable               |  
| --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| ![en](https://gitlab.com/garywill/bigSearch/-/raw/screenshot/en.png) | ![breadth](https://gitlab.com/garywill/bigSearch/-/raw/screenshot/breadth.jpg)  | ![themes](https://gitlab.com/garywill/bigSearch/-/raw/screenshot/themes.jpg)   | 
| Context selection search | Different UI adaptions                                                       | Vem (Vimium-like)  |
| ![context](https://gitlab.com/garywill/bigSearch/-/raw/screenshot/context.png) | ![3ui](https://gitlab.com/garywill/bigSearch/-/raw/screenshot/3ui.webp) | ![vem](https://gitlab.com/garywill/bigSearch/-/raw/screenshot/vem.webp) |
| Edit search engines  | Special search methods, flexibility & extensibility |  | 
| ![edit](https://gitlab.com/garywill/bigSearch/-/raw/screenshot/edit.png) | ![edit-add](https://gitlab.com/garywill/bigSearch/-/raw/screenshot/edit-add.png) |  | 

![demo_gif](https://gitlab.com/garywill/bigSearch/-/raw/screenshot/demo.gif)

[Video of full introduction & instructions (Youtube)](https://youtu.be/u_DT7gpliKM) (choose the chapter you want to watch): 

## Features

### Basic

- 🔎 Use **any** search engines or inquery websites (multiple uninterruptedly) from one UI. Any that support GET/POST. (60+ built-in)
- 🔎 **User** custom search engine ([details](#How-to-edit-search-engines-GUI-or-JSON)) (syncronizable in extension)
- 🔎 Use **browser-installed** search engines (browser extension, so can directly use those you've added into browser, Firefox only)

### More

- 🖋️ Single-line or **multi-line** text input & send
  > Useful when e.g. want to translate article
- 🗂️ Search engines **categorization**
- 📋 Save (locally), **reuse** and manage search history (won't save when in incognito mode). Reusing method: double-click behavior
  - In single-line edit: replace input box text
  - In multi-line edit: insert to cursor
- 🖱️ Quickly use **selected text** (single-line or multi-line) as search term
  > - No in Firefox incognito mode ([bug 1380812](https://bugzilla.mozilla.org/show_bug.cgi?id=1380812))
  > - On Chrome, after clicking context menu item, click the icon on toolbar (or use keyboard shortcut) ([defect of Chrome](https://stackoverflow.com/questions/54189283/chrome-extension-open-popup-from-contentscript-file#comment95207111_54189283))
- ⌨️ Configurable **keyboard shortcuts**. Default keys (may need changing manually):
  - Open popup. Firefox: `Ctrl+Alt+S`   Chrome & others:`Ctrl+Shift+S` 
  - Set selected text as search term (then use "open popup" key). Firefox: `Ctrl+Alt+D`  Chrome & others:`Ctrl+Shift+D`
  > [change on Firefox](https://bug1303384.bmoattachments.org/attachment.cgi?id=9051647) | change on Chrome: `chrome://extensions/shortcuts` 
- 🖥️ UI adapted multiply: **Desktop** (browser extension or web app) and **mobile** (web app only). Extention can show UI in: toolbar button popup UI, standalond tab, or sidebar (browser native)

### Even more: What's special about it

- ⌨️ Vem feature: Built-in **Vimium-like** feature. You can use keys to quickly call different search engines ([details](#vem-feature-built-in-vimium-like))
- 🔎 **Even works with** websites that **don't** provide GET/POST interface (so-called In-page-Ajax-render websites) ([details](#Instructions-for-searching-In-page-Ajax-render-websites))
- 🔎 Do many operations at once by one button
- ✨ Good-looking, powerful & **lightweight** ([details](#Third-party-libraries-and-components-used))
- 💪 User **JSON programatical** advanced customization (**GUI** easy editing also). Both built-in & user-defined search engines data use same format ([details](#Specification-of-Editing-Engines-Data-and-Special-Search-Methods)). **Great flexibility**  in engine data & search method:
  - 🔲 **Multiple buttons** for **one engine**: more than one operations for one engine. (Buttons inherit data from engine. Some key-value data ​​in button can override the ones in engine name)
  - 📞 **Cross-engine** use: Call another engine (or it's certain button action) to do the action
  - 🔏 String-formatting or character-replacing user's input, according to engine's need. And, charset specifying.
  - 🔎 Combining above two to search websites that don't provide search

### Vem feature (built-in Vimium-like)

If you've used `!bang` or omnibox, they require you to memorize codes.

While, Big Search's Vem mode **visually** gives you convinience & ability to use keyboard to (uninterruptedly) click different search engines' different buttons. Press `Shift+Enter` to enter Vem mode

![vem](https://gitlab.com/garywill/bigSearch/-/raw/screenshot/vemgif.gif)

| Key | Function |
| --- | --- |
| `Shift+Enter` | Finish input and enter Vem mode (used when not in Vem mode) |
| `Shift+Enter` | Opposite to above (used when in Vem mode) |
| `I` | Quit Vem mode and focus inputbox |
| `1` - `9` | Switch catagory (in Vem mode) |
| `A` - `Z` | Press corresponding button (in Vem mode) |
| `J` & `K` | Scroll table down/up |
| more to be added ... |  |

> Above key bindings are not formally determined. May change in the future according to user feedback

Note if new engines added, button sequence may change, so as button key (`A` - `Z`).
  
### Safety & Privacy

- 🛡️ Minimum default permissions. Won't ask for sensitive permissions **until** needed.
- 🛡️ **No injection** to web (except when searching In-page-Ajax-render websites)
- 🛡️ Hide HTTP Referrer by default to protect user privacy
- 🛡️ **Client side** functions and includes data fully. No necessary 3rd-party server. Completely **no** collecting user data
- 🛡️ User custom engine GUI editor is used online (to shrink extension size). If you want extreme security, you can choose to disable communication between them, and use manual edit.

## FAQ

#### Q: What is "In-page-Ajax-render" ?

A: 

General GET/POST search flow is:
1. You input search term and click search button
1. Your browser loads the search term into a GET/POST query then sends it to target URL you specify
1. Your browser opens a new tab and loads the HTML responded by the target website

Big Search's In-page-Ajax-render search is:
1. You input search term and click search button
1. Your browser opens target website page you specified (search term not sent)
1. Big Search injects a simple JS to the page, filling your search term into the text box on page (according to css selector you specified). Then JS triggers clicking the submit button (also according to css selector you specified) action
1. The website page itself then uses Ajax to fetch search results, then your browser renders them on page

The In-page-Ajax-render search feature can be used to search websites that do not provide GET/POST search interface to public (e.g. SPA websites), or those who require random token assigned at a search entrance form.

"In-page-Ajax-render" is short for "**In-page**-submit-form-via-**Ajax**-then-XHR-gets-search-result-then-**render**-and-show-in-page-without-web-frame-navigation"

> This part is also explained in the video description

## List of engines

60+ , currently. [See list of build-in search engines](https://github.com/garywill/BigSearch/blob/list/list.md#list-of-build-in-search-engines-in-big-search)

## Similar tools & methods comparison

[Comparison of open source web searching (multi-engines) tools](https://github.com/garywill/BigSearch/blob/list/list.md)

Experienced users may prefer intuitive horizontal comparison to quickly know what's special. (Also know about others btw)

## How to edit search engines (GUI or JSON)

[Online GUI engine-editing tool (link 1)](https://garywill.github.io/BigSearch/editengine.html) ([link 2](http://acsearch.tk/editengine.php)) 

Generally, use above GUI editor. If you don't want to use GUI (e.g. you are advanced user and want to use advanced features), please go on and read below.

Big Search users can edit search engines programatically. Following paragraphs of this section are about JSON-format engine data specification. For both:

1. User-defined private engines
2. Big Search built-in search engines (`enginesdata.js`)

### Examples

#### Short Format

You only need to write very simple JSON and have basic HTTP knowledge on `GET Method`.

```json
{
    "Google": "https://www.google.com/search?q={0}",
    "Yahoo Search": "https://search.yahoo.com/search?q={0}"
}
```

<details>
<summary>More about short format</summary>

Although above is simple and correct, if you're programmer it's not recommended to use display name as key. We should at least, for example:

```json
{
    "yahoo": {
        "dname": "Yahoo Search",
        "full_url": "https://search.yahoo.com/search?q={0}"
    }
}
```

</details>

#### Full Format

Using full format you have opportunity to use all the features of this tool.

Also, mixing short formatted and full formatted elements is supported.

<details>
<summary>Full format examples</summary>

```json
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

    "label_mbap" : { "lstr": "Cross-engine" },
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

    "label_usaj": { "lstr": "Search In-page-Ajax-render web" },
    "chrome_ext_dev": {
        "dname": "Chrome Ext Dev Doc",
        "addr": "https://developer.chrome.com/docs/extensions/reference/",
        "action": "https://developer.chrome.com/docs/extensions/reference/",
        "ajax": ".search-box__input"
    },

    "label_many": { "lstr": "Many Engines at once" },
    "many_once" : {
        "dname": "Many Engines at once",
        "btns": {
            "gg_ddg": {
                "label": "Google + DDG",
                "use_other_engine": ["google", "duckduckgo"]
            }
        }
    }
}
```

> This part is also explained in the video description

</details>

### Specification of Editing Engines Data and Special Search Methods

#### Specifications

In JSON format.

Engine data in full format can contain following key-values (special search methods included):

<details>
<summary>Specifications</summary>

```yaml
// # Some key-value ​​in the button can override the key-value in the engine name
{
    "engine_name": {
        "dname": "Engine display name",
        "addr": "Homepage URL",  // # optional
        "tip": "Engine tip text", // # optional
        
        "action": "form action url",
        // # For example, https://search-engine.com/search?q=input_content,
        // # The action is https://search-engine.com/search
        "kw_key": "The key name of the keyword in the query string", // # In above example, it is q
        
        "full_url": "http://www.example.com/search/{0}", // # optional. Only when GET method. Will override above two. The entire url 
        
        "method": "get/post", // # optional. default is get
        
        "charset": "UTF-8/gb2312/gb18030/big5/iso-xxxx....", // # optional. default UTF-8 (NOTICE: full_url not compatible with this
        
        "allow_referer": false, // # false(default)/true optional
        
        "kw_replace": [[" ", "-"]], // # Optional, characters that need to be replaced in the search term. In this example, replace spaces with '-'
        "kw_format": "formatted string with {0}", // # optional. {0} is like %s

        "params":[ // # Optional, the key/value other than the keyword in the query string required for this operation. POST method may need
            {"key": "key", "val": "value"},
            // # For example, https://search-engine.com/search?q=input_content&option=searchall
            // # so {key: "option", val: "searchall"},
        ],
        
        "use_other_engine": {   // # optional, use another engine to do the operation.
            "dbname": "bigsearch/user/browser",   // # Optional. Where the engines database come from (3 available databases): BigSearch build-in database (default) / User custom database / Browser-installed database
            "engine": "engine name", 
            "btn": "button name"   // # Optional. Absence will make fallback to the first button
            // # this entire object can be simplified to an engine name string
        },
        // #  (if use array here, then do many operations at once)
        
        "ajax": ......  // # Optional. Read the In-page-Ajax-render websites instructions
            
        "btns": { // # optional. If there is no such item, a "Search" button is displayed, and clicking the button will do the default action
            "Button name": {
                "label": "Button display text",
                "btn_tip": "Tip text", // # optional
                
                "..." : "..." // # here in a btn can be key-value pairs, which will override those in engine
            },
            ....
        }
    },
}
```

> This part is also explained in the video description

</details>

#### Instructions for searching In-page-Ajax-render websites

Some websites doesn't provide GET/POST search (or not respond results in HTML). Visitor need to open their page then input, they then show results via Ajax on their page. (see [FAQ](#FAQ))

Big Search can deal with such In-page-Ajax-render websites (by injecting js to your browser web, to automate inputting, clicking, form submitting). And easy to configure:


Eg 1: Specify the css selector of input box. It will automatically input search term and trigger pressing Enter event.

```json
"ajax": "#search-box-input"
```

Eg 2: Delay 2s -> Input -> Delay 1s -> Trigger clicking button event

```json
"ajax": [2000, "#search-box-input", 1000, "#submit-button"]
```

> This part is also explained in the video description

## For Developers

> We encourage user to submit their customized search engines data to source code after they format as JSON (submit to file `enginesdata.js`)

### What's Next Step

This tool still can be improved to do something more:

- Omnibox
- Be compatible with others e.g. OpenSearch. Add or convert by 1-click

### Technical Diagram

<details>

![tech_diagram](https://gitlab.com/garywill/bigSearch/-/raw/screenshot/tech.png)

</details>

### Third-party libraries and components used

**Fast** and **lightweight**: NO heavy framework or library dependencies. Although it has UI themes of both simplicify & fancy, all main features and UI are pure JS + CSS. ![](https://img.shields.io/github/languages/code-size/garywill/BigSearch)

<details>

- [LZ-UTF8.js](https://github.com/rotemdan/lzutf8.js) (38kB not minified. Data compression library, only for user-custom engines sync)
  
  ```
  Copyright (c) 2021, Rotem Dan
  Released under the MIT license.
  ```
  
- [Foggy Lake](https://www.pexels.com/photo/foggy-lake-2166695/) (37kB webp. Default background photo)
  
  by Quang Nguyen Vinh
  

- [Unicons icon](https://github.com/Iconscout/unicons) (svg)
  
  Unicons by [Iconscout](https://iconscout.com/)
  
</details>

### Globalization

<details>

Because there are currently only 2 languages supported, no framework used yet, only a simple function to implement multi-language. 

For strings that you want it to be multi-language (it's okay to leave it English only, also), use JS function `i18n()`, whose input parameters can be:

- An array of strings (for only Chinese and English 2 languages). `[0]` is Chinese, `[1]` is English
- An Object like `{zh: "This is Chinese, en: "This is English", fr: "This is French"}`

It will return a string of the corresponding language

If you want to add a search engine that only targets users in a certain language, you can use `visible_lang` to make it visible only to a certain language.

</details>

### History, Code Status, and License

<details>

A part of the code of this tool can be traced back to around 2008. Web app published to be usable to the public on Internet in 2015. Not until early 2020s, I found webExtension and JS standarized, so made this tool a browser extension and setup a Github repo for it. (Yes it's developed slowly and gently, not full-time.)

Some code has been ever (and may still getting) refactored. Although there's still some some aged parts, this tool has **always been modern, handy & useful**.

Code is licensed under AGPL.

[Change log](https://addons.mozilla.org/firefox/addon/big-search/versions/) 

</details>
