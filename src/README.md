English | [中文](https://github.com/garywill/BigSearch/blob/master/src/README_zh.md)

[![firefox](https://img.shields.io/amo/v/big-search?style=flat-square&color=success)](https://addons.mozilla.org/firefox/addon/big-search/) [![chrome](https://img.shields.io/chrome-web-store/v/ojcnjeigmgjaiolalpapfnmmhdmpjhfb?style=flat-square&color=success)](https://chrome.google.com/webstore/detail/big-search/ojcnjeigmgjaiolalpapfnmmhdmpjhfb) [![](https://img.shields.io/badge/dynamic/json?labelColor=dimgray&style=flat-square&color=inactive&label=ms%20edge%20%28NO%20update%29&prefix=v&query=%24.version&url=https%3A%2F%2Fmicrosoftedge.microsoft.com%2Faddons%2Fgetproductdetailsbycrxid%2Fpdmlapcmibobkkchijgfeongemmepkbc)](https://microsoftedge.microsoft.com/addons/detail/pdmlapcmibobkkchijgfeongemmepkbc) ![](https://img.shields.io/github/languages/code-size/garywill/BigSearch)

# Big Search

Handily use / switch **any one** or **multiple** (uninterruptedly) **search engines** (or search any websites) via a **flexible tool**.

<p align="center">
Search everywhere 🗺️ for everything 👨‍💻. Breadth & Focus.<br>
With some <b>special technical features</b> also.
</p>

![signboard](https://gitlab.com/garywill/bigSearch/-/raw/screenshot/signboard.jpg)

<!--ts-->
   * [Start to install &amp; use](#start-to-install--use)
   * [Basic Features Demo and Screenshots](#basic-features-demo-and-screenshots)
   * [Features](#features)
      * [Basic](#basic)
      * [More](#more)
      * [Even more: What's special about it](#even-more-whats-special-about-it)
      * [Safety &amp; Privacy](#safety--privacy)
   * [List of engines](#list-of-engines)
   * [Similar tools &amp; methods comparison](#similar-tools--methods-comparison)
   * [How to edit search engines](#how-to-edit-search-engines)
      * [Examples](#examples)
         * [Short Format](#short-format)
         * [Full Format](#full-format)
      * [Specification of Editing Engines Data](#specification-of-editing-engines-data)
         * [Specifications](#specifications)
         * [Ajax Instructions](#ajax-instructions)
   * [For Developers](#for-developers)
      * [What's Next Step](#whats-next-step)
      * [Technical Diagram](#technical-diagram)
      * [Third-party libraries and components used](#third-party-libraries-and-components-used)
      * [Globalization](#globalization)
      * [History, Code Status, and License](#history-code-status-and-license)
<!--te-->

## Start to install & use

Ways to use:

1. Browser extension (**recommended**)
   - [Firefox Addon ![](https://img.shields.io/amo/v/big-search?style=flat-square&color=success)](https://addons.mozilla.org/firefox/addon/big-search/)
   - [Chrome Addon ![](https://img.shields.io/chrome-web-store/v/ojcnjeigmgjaiolalpapfnmmhdmpjhfb?style=flat-square&color=success)](https://chrome.google.com/webstore/detail/big-search/ojcnjeigmgjaiolalpapfnmmhdmpjhfb) or [download .crx](https://gitlab.com/garywill/releaseapps-dl/-/tree/main). For: Google Chrome, Microsoft Edge, Brave, Vivaldi, Opera etc.

2. Web App: For demo purpose. Web app can't function fully like extension. Web app can be used on mobile browsers
   - Main site: [https://acsearch.ga ![](https://img.shields.io/website?down_message=repairing&style=flat-square&up_color=blue&url=https%3A%2F%2Facsearch.ga)](https://acsearch.ga)
   - Standby site: [http://acsearch.tk ![](https://img.shields.io/website?down_message=repairing&style=flat-square&up_color=blue&url=http%3A%2F%2Facsearch.tk)](http://acsearch.tk)
   
## Basic Features Demo and Screenshots

| Use Extension                                                                     | UI Styles, Simplicity or Fancy                                                          |   |
| --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| ![en](https://gitlab.com/garywill/bigSearch/-/raw/screenshot/en.jpg)   | ![themes](https://gitlab.com/garywill/bigSearch/-/raw/screenshot/themes.jpg)   |   |
| Context selection search | Try web app without install                                                       | Mobile (testing) (web app)  |
| ![context](https://gitlab.com/garywill/bigSearch/-/raw/screenshot/context.png) | ![web](https://gitlab.com/garywill/bigSearch/-/raw/screenshot/web.jpg) | ![mobile](https://gitlab.com/garywill/bigSearch/-/raw/screenshot/mobile.jpg) |
| Edit search engines  | Special search methods, flexibility & extensibility |  | 
| ![edit](https://gitlab.com/garywill/bigSearch/-/raw/screenshot/edit.png) | ![edit-add](https://gitlab.com/garywill/bigSearch/-/raw/screenshot/edit-add.png) |  | 

![demo_gif](https://gitlab.com/garywill/bigSearch/-/raw/screenshot/demo.gif)

## Features

### Basic

- 🔎 Use any search engines or inquery websites (multiple simultaneously) from one page. Any websites that support **GET/POST** request. 
  > E.g: Google, DuckDuckGo, Youtube, eBay, Github etc. Or the stock of a supermarket near your home (if it supports). Customizable. 50+ built-in.
- 🔎 **User** adding custom-defined search engine ([details](#How-to-edit-search-engines)) (syncronizable in extension)
- 🔎 Support using **browser-installed** search engines (browser extension, so can directly use those you've added into browser, Firefox only)

### More

- 🖋️ Single-line or **multi-line** text edit/input and sending
  > Useful when for e.g. you want to have article paragraphs translated
- 🗂️ Search engines **categorization**
- 📋 Save, **reuse** and manage your input history (only saved locally in the browser localStorage)
- 🖱️ Quickly use user **selected text** on webpage as search term (browser extension, context menu) 
  > - No in Firefox incognito mode ([bug 1380812](https://bugzilla.mozilla.org/show_bug.cgi?id=1380812))
  > - On Chrome, after clicking context menu item, click the icon on toolbar (or use keyboard shortcut) ([defect of Chrome](https://stackoverflow.com/questions/54189283/chrome-extension-open-popup-from-contentscript-file#comment95207111_54189283))
- ⌨️ **Keyboard shortcut** (browser extension) 
  - Open popup. Firefox: `Ctrl+Alt+S`   Chrome & others：`Ctrl+Shift+S` 
  - Set selected text as search term (then use open popup). Firefox: `Ctrl+Alt+D`  Chrome & others：`Ctrl+Shift+D`
  > [change on Firefox](https://bug1303384.bmoattachments.org/attachment.cgi?id=9051647) | change on Chrome: `chrome://extensions/shortcuts` 
- 🖥️ Support both **desktop** (browser extension & web app) and **mobile** (web app only) devices

### Even more: What's special about it

- 🔎 **Even works with** those Ajax-only websites that **don't** provide GET/POST interface to public ([details](#Ajax-Instructions))
- 🔎 Do many operations at once by one button
- ✨ Good-looking, powerful and **lightweight** ([details](#Third-party-libraries-and-components-used))
- 💪 Uses **JSON** as unified search engines database (both built-in and user-defined). Has strong **flexibility** in engine data: ([details](#Specification-of-Editing-Engines-Data))
  - 🔲 **Multiple buttons** for **one engine**: more than one operations for one engine. (Buttons inherit data from engine. Some key-value data ​​in button can override the ones in engine name)
  - 📞 **Cross-engine** use: Call another engine (or it's certain button action) to do the action
  - 🔏 String-formatting or character-replacing user's input, according to engine's need
  - 🔎 Combining above two to search websites that don't support search

### Safety & Privacy

- 🛡️ Minimum default permissions. Won't ask for sensitive permissions **until** needed. (browser extension)
- 🛡️ Pure **client-side** tool functions fully. No necessary server. **No** collecting user's input or ad analyzing. (browser extension and web app)
- 🛡️ Hide HTTP Referrer by default to protect user privacy.
- 🛡️ Browser extension **does not inject** anything to web sites. (except when using Ajax-only engine)

## List of engines

[See list of build-in search engines](https://github.com/garywill/BigSearch/blob/list/list.md#list-of-build-in-search-engines-in-big-search)

## Similar tools & methods comparison

[Comparison of open source web searching (multi-engines) tools](https://github.com/garywill/BigSearch/blob/list/list.md)

Experienced users may prefer intuitive horizontal comparison, to quickly know what's special about it

## How to edit search engines

Ordinary users who only use basic features can directly use our [online gui engine-editing tool (link1)](https://acsearch.ga/editengine.php) ([link2](http://acsearch.tk/editengine.php)).

Following paragraphs of this section are about JSON-format engine data specification. Using JSON you can use all features of this tool. The method is for both:

1. User-defined private engines
2. Big Search built-in search engines (`enginesdata.js`)

### Examples

#### Short Format

You only need to write very simple JSON and have basic HTTP knowledge on `GET Method`.

```yaml
{
    "Google": "https://www.google.com/search?q={0}",
    "Yahoo Search": "https://search.yahoo.com/search?q={0}"
}
```

#### Full Format

Using full format you have opportunity to use all the features of this tool.

Also, mixing short formatted and full formatted elements is supported.

<details>
<summary>Full format examples</summary>

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
    },

    "label_usaj": { "lstr": "Engine with Ajax" },
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

</details>

### Specification of Editing Engines Data

#### Specifications

In JSON format.

Engine data in full format can contain following key-values:

<details>
<summary>Specifications</summary>

```yaml
// # Some key-value ​​in the button can override the key-value in the engine name
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
                "use_other_engine": {   // # optional, use another engine to do the operation. (if use array here, then do many operations by a button at once)
                    "dbname": "bigsearch/user/browser",   // # Optional. Where the engines database come from (3 available databases): BigSearch build-in database (default) / User custom database / Browser-installed database
                    "engine": "engine name", 
                    "btn": "button name"   // # Optional. Absence will make fallback to the first button
                },
                "ajax": ......  // # Optional. Read the Ajax Instructions for detail
            },
        }

    },
    ......
};
```

</details>

#### Ajax Instructions

Some websites doesn't accept GET or POST. Visitor need to open their page and input, then they show search results on page via Ajax.

Big Search browser extension supports searching in such Ajax-only websites. And very easy to configure.

<details>

<summary>Ajax instructions</summary>

Eg 1: Specify the querySelector of input box. It will automatically input search term and trigger pressing Enter event.

```yaml
"ajax": "#search-box-input"
```

Eg 2: Delay 2s -> Input -> Delay 1s -> Trigger clicking button event

```yaml
"ajax": [2000, "#search-box-input", 1000, "#submit-button"]
```

</details>

## For Developers

> We encourage user to submit their customized search engines data to us after they format as JSON. Search engines data is AGPL licensed FLOSS.

> If you want some search engines to be included by us, add/submit it to `enginesdata.js`. It is the core data of Big Search.

### What's Next Step

This tool still can be improved to do something more:

- Improve the online editing-engine GUI (vue)
- Omnibox
- Browser (native) sidebar panel (before that need to change UI. Need responsive)
- Desktop stanalone app, opening URL with user-assigned browser
- Mobile native app (any idea?)
- Add non-search navigation feature
- Be compatible with others e.g. OpenSearch. Add or convert by 1-click
- Be able to be used via CLI in terminal (nodejs)

### Technical Diagram

<details>

![tech_diagram](https://gitlab.com/garywill/bigSearch/-/raw/screenshot/tech.png)

</details>

### Third-party libraries and components used

**Fast** and **lightweight**: NO heavy framework or library dependencies. Although it has UI themes of both simplicify & fancy, all main features and UI are pure JS + CSS. ![](https://img.shields.io/github/languages/code-size/garywill/BigSearch)

<details>

- [LZ-UTF8.js](https://github.com/rotemdan/lzutf8.js) (81kB not minified. Data compression library, only for user-custom engines sync)
  
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

Have given the engines data `enginesdata.js` AGPL FLOSS license (so welcome adding data 🌱. Or, if you know any license properer for this data 🍀). Feel free to discuss (open an issue) if want FLOSS license for this whole project 💚.

[Change log](https://addons.mozilla.org/firefox/addon/big-search/versions/) 

</details>
