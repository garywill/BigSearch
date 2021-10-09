/*
 * By Big Search / 大术专搜
 * (acsearch.ga, acsearch.tk)
 * 
 * The code of this file is released under：
 *     1. GNU AGPL (GNU Affero General Public License)
 *     2. Our (Big Search) statement:
 *          1) AGPL doesn't have infect to other files of Big Search.
 *              Other files can be other license or copyright status.
 *          2) If you use this file or any part of its data in any form 
 *          (including but not limited to converting data format, 
 *          compressing code, compiling link, non-compiling link, 
 *          script call, URL-link using, using any part of data, etc.), 
 *          then your entire project using this file is AGPL licensed.
 * 
 * 此文件的代码在这些许可协议下发布：
 *     1. GNU AGPL (GNU Affero General Public License)
 *     2. 我们（大术专搜）的声明：
 *          1) AGPL不对大术专搜的其他文件产生作用，其他文件可以是别的许可证或版权状态。
 *          2) 如果你以任意形式（形式包括但不限于转换数据格式、压缩代码、编译链接、
 *              非编译链接、脚本调用、URL调用、取用部分数据 等）使用了此文件或其中
 *              任意部分数据，则你使用了此文件的整个项目皆为AGPL许可。
 * 
 * Source code: https://github.com/garywill/bigSearch
 */

let catas;
let sEngines;

function init_data() {
    
catas = {
    "general": {
        label: i18n(["通用搜索", "General"]),
        engines: [
            { type:"label", lstr:"陆内" , visible_lang: "zh"},
            { type:"engine", name:"baidu", visible_lang: "zh"},
            { type:"engine", name:"sogou", visible_lang: "zh"},
            { type:"engine", name:"360so", visible_lang: "zh"},
            { type:"label", lstr:i18n(["陆外", "Global"]), visible_lang: "zh"},
            { type:"engine", name:"bing"},
            { type:"engine", name:"google"},
            { type:"engine", name:"yahoo"},
            { type:"engine", name:"yandex"},
            { type:"engine", name:"duckduckgo"},
            { type:"engine", name:"startpage"},
            { type:"engine", name:"ecosia"},
            { type:"engine", name:"qwant"},
            { type:"engine", name:"findx"},
            { type:"engine", name:"metager"},
            { type:"engine", name:"swisscows"},
        ],
    },
    "program": {
        label: i18n(["电脑程序", "Programing"]),
        engines: [
            { type:"engine", name:"github"},
            { type:"engine", name:"mdn"},
            { type:"engine", name:"stackexchange"},
            { type:"engine", name:"alternativeto"},
            { type:"label", lstr:"Windows"},
            { type:"engine", name:"choco"},
            { type:"engine", name:"scoop"},
            { type:"engine", name:"cygwin"},
            { type:"label", lstr:"Linux"},
            { type:"engine", name:"homebrew"},
            { type:"engine", name:"docker"},
            { type:"engine", name:"flathub"},
            { type:"engine", name:"snapcraft"},
            { type:"engine", name:"nix"},
            { type:"engine", name:"guix"},
            
        ],
    }, 
    "mobileapp": {
        label: i18n(["手机应用", "Mobile Apps"]),
        engines: [
            { type:"label", lstr:"Android"},
            { type:"engine", name:"fdroid"},
            { type:"engine", name:"izzyondroid_fdroid"},
            { type:"engine", name:"google_play"},
            { type:"engine", name:"apkdl"},
            { type:"engine", name:"apkmirror"},
            { type:"engine", name:"apk-dl"},
            { type:"engine", name:"apkpure"},
            { type:"engine", name:"freeapk"},
            { type:"engine", name:"appsapk"},
            { type:"engine", name:"androidpicks"},
            { type:"engine", name:"androidapksfree"},
            { type:"engine", name:"evozi"},
            { type:"label", lstr:"iOS"},
            { type:"engine", name:"itunesapps_baidu", visible_lang: "zh"},
            { type:"engine", name:"itunesapps"},
        ],
    }, 
    "media": {
        label: i18n(["音视频图", "Multimedia"]),
        engines: [
            { type:"label", lstr:"陆内" , visible_lang: "zh" },
            { type:"engine", name:"baidu_media" , visible_lang: "zh" },
            { type:"engine", name:"bilibili" , visible_lang: "zh" },
            { type:"engine", name:"music163" , visible_lang: "zh" },
            { type:"label", lstr:"陆外" , visible_lang: "zh" },
            { type:"engine", name:"google_media"},
            { type:"engine", name:"youtube"},
        ],
    },
    "translate": {
        label: i18n(["中外译查", "Translates"]),
        engines: [
            { type:"engine", name:"youdao" , visible_lang: "zh"},
            { type:"engine", name:"baidu_translate" , visible_lang: "zh"},
            { type:"engine", name:"cambridge"},
            { type:"engine", name:"google_translate"},
            { type:"engine", name:"bing_dict" , visible_lang: "zh"},
        ],
    }, 
    "academy": {
        label: i18n(["资料论文", "Knowledge"]),
        engines: [
            { type:"label", lstr:"陆内学术", visible_lang: "zh"},
            { type:"engine", name:"cnki", visible_lang: "zh"},
            { type:"engine", name:"wanfang", visible_lang: "zh"},
            { type:"engine", name:"cssci", visible_lang: "zh"},
            { type:"label", lstr:i18n(["海外学术", "Global Academic"])},
            { type:"engine", name:"webofscience"},
            { type:"engine", name:"ei"},
            { type:"engine", name:"ieee"},
            { type:"label", lstr:i18n(["资料搜索引擎", "Knowledge Search Engines"])},
            { type:"engine", name:"google_scholar"},
            { type:"engine", name:"baidu_xuesu", visible_lang: "zh"},
            { type:"engine", name:"bing_ac"},
            { type:"engine", name:"wikip_zh", visible_lang: "zh"},
            { type:"engine", name:"wikip_en", visible_lang: "en"},
        ],
    },
    "han": {
        label: "漢語",
        visible_lang: "zh",
        engines: [
            { type:"engine", name:"zdic"},
            { type:"engine", name:"ccamc"},
            { type:"engine", name:"moedict"},
        ],
    }, 
    "buy": {
        label: i18n(["网上购物", "Shopping"]),
        engines: [
            { type:"label", lstr:i18n(["陆内", "Mainland of China"]), visible_lang: "zh"},
            { type:"engine", name:"taobao", visible_lang: "zh"},
            { type:"engine", name:"jd", visible_lang: "zh"},
            { type:"engine", name:"weipinhui", visible_lang: "zh"},
            { type:"engine", name:"dangdang", visible_lang: "zh"},
            { type:"engine", name:"suning", visible_lang: "zh"},
            { type:"label", lstr:i18n(["陆外", "Global"]), visible_lang: "zh"},
            { type:"engine", name:"tmall_global"},
        ],
    },
    "finance": {
        label: i18n(["财经", "Finance"]),
        visible_lang: "zh",
        engines: [
            { type:"engine", name:"investing"},
            { type:"engine", name:"xueqiu"},
            { type:"label", lstr:i18n(["区块链", "Blockchain"])},
            { type:"engine", name:"feixiaohao"},
            { type:"engine", name:"aicoin"},
            
        ],
    }, 
};

sEngines = {
    "baidu": {
        "dname": "百度",
        "addr": "https://www.baidu.com",
        "action": "https://www.baidu.com/s",
        "kw_key": "wd",
        "btns": {
            "sch": {
                "label": "百度一下"
            }
        }
    },
    "sogou": {
        "dname": "搜狗搜索",
        "addr": "https://www.sogou.com",
        "action": "https://www.sogou.com/web",
        "kw_key": "query",
        "btns": {
            "sch": {
                "label": "搜狗搜索"
            }
        }
    },
    "360so": {
        "dname": "360搜索",
        "addr": "https://www.so.com/",
        "action": "https://www.so.com/s",
        "kw_key": "q"
    },
    "bing": {
        "dname": i18n(["必应", "Bing"]),
        "addr": "https://www.bing.com",
        "action": "https://www.bing.com/search",
        "kw_key": "q",
        "btns": {
            "sch": {
                "label": "中国版搜索",
                "visible_lang": "zh",
                "action": "https://cn.bing.com/search",
                "params": [
                    {key:"ensearch", val:"0"}
                ]
            },
            "sch_global": {
                "label": i18n(["Search (Global)", "Search"]),
                "params": [
                    {key: "ensearch", val: "1"}
                ]
            }
        }
    },
    "google": {
        dname: "Google",
        addr: "https://www.google.com",
        action: "https://www.google.com/search",
        kw_key: "q",
        btns: {
            "search": {
                label: "Google Search"
            },
            "lucky": {
                label: "I'm Feeling Lucky",
                params: [
                    {key:"btnI", val: "1"}
                ]
            }
        }
    },
    "yahoo": {
        dname: "Yahoo Search",
        addr: "https://search.yahoo.com",
        action: "https://search.yahoo.com/search",
        kw_key: "q"
    },
    "yandex": {
        "dname": "Yandex",
        "addr": "https://www.yandex.com/",
        "action": "https://www.yandex.com/search/",
        "kw_key": "text"
    },
    "duckduckgo": {
        "dname": "DuckDuckGo",
        "addr": "https://duckduckgo.com/",
        "action": "https://duckduckgo.com/",
        "kw_key": "q"
    },
    "startpage": {
        "dname": "StartPage",
        "addr": "https://www.startpage.com/",
        "action": "https://www.startpage.com/do/search",
        "kw_key": "query"
    },
    "ecosia": {
        "dname": "Ecosia",
        "addr": "https://www.ecosia.org",
        "action": "https://www.ecosia.org/search",
        "kw_key": "q"
    },
    "qwant": {
        "dname": "Qwant",
        "addr": "https://www.qwant.com/",
        "action": "https://www.qwant.com/",
        "kw_key": "q"
    },
    "findx": {
        "dname": "Findx",
        "addr": "https://www.findx.com/",
        "action": "https://www.findx.com/search",
        "kw_key": "q"
    },
    "metager": {
        "dname": "MetaGer",
        "addr": "https://metager.org/",
        "action": "https://metager.org/meta/meta.ger3",
        "kw_key": "eingabe",
        "btns": {
            "Search": {
                "label": "Search",
                "params": [
                    {
                        "key": "focus",
                        "val": "web"
                    }
                ]
            }
        }
    },
    "swisscows": {
        "dname": "Swisscows",
        "addr": "https://swisscows.com",
        "action": "https://swisscows.com/web",
        "kw_key": "query",
        "btns": {
            "sch": {
                "label": "Search",
            },
            "sch_noregion": {
                "label": "Search (Region off)",
                "params": [
                    {
                        "key": "region",
                        "val": "iv"
                    }
                ]
            },
            "sch_cn": {
                "label": "搜索zh-CN",
                visible_lang: "zh",
                "params": [
                    {
                        "key": "region",
                        "val": "zh-CN"
                    }
                ]
            },
            "sch_en_us": {
                "label": "Search en-US",
                "params": [
                    {
                        "key": "region",
                        "val": "en-US"
                    }
                ]
            },
        }
    },
    "taobao": {
        "dname": "淘宝天猫",
        "addr": "https://www.taobao.com/",
        "action": "https://s.taobao.com/search",
        "d_addi_html": [{ "text": "精品优惠入口", "href": "https://ai.taobao.com/?pid=mm_325950067_1186300468_109886250042" , "tip": "点击进入淘宝官方精品优惠主页面。要搜索精品及优惠券，输入后点击右列中的“精品优惠”" }],
        //"d_addi_html": "<a title='点击进入淘宝官方精品优惠主页面。要搜索精品及优惠券，输入后点击右列中的“精品优惠”' href='https://ai.taobao.com/?pid=mm_325950067_1186300468_109886250042'>精品优惠入口</a>",
        "kw_key": "q",
        "allow_referer": true,
        "btns": {
            "atb": {
                "label": "精品优惠",
                "dname": "淘宝",
                "addr": "https://ai.taobao.com/?pid=mm_325950067_1186300468_109886250042",
                "action": "https://ai.taobao.com/search/index.htm",
                "kw_key": "key",
                "btn_tip": "淘宝官方的精品优惠搜索，可搜索到优惠券",
                "params": [
                    {
                        "key": "pid",
                        "val": "mm_325950067_1186300468_109886250042"
                    }
                ]
            },
            "sch": {
                "label": "普通",
                "dname": "淘宝",
            },
            "shop": {
                "label": "店铺",
                "dname": "淘宝",
                "action": "https://shopsearch.taobao.com/search",
            },
            "tmall": {
                "label": "仅天猫",
                "dname": "天猫",
                "addr": "https://www.tmall.com/",
                "action": "https://list.tmall.com/search_product.htm",
                "charset": "gb18030",
                "kw_key": "q",
    
            },
            "old": {
                "label": "二手",
                "dname": "淘宝",
                "params": [
                    {
                        "key": "tab",
                        "val": "old"
                    },
                ]
            }
        }
    },
    "jd": {
        "dname": "京东",
        "addr": "https://www.jd.com/",
        "action": "https://search.jd.com/Search",
        "kw_key": "keyword",
        "btns": {
            "sch": {
                "label": "搜索",
                "params": [
                    {"key": "enc","val": "utf-8" }
                ],
            }
        }
    },
    "weipinhui": {
        "dname": "唯品会",
        "addr": "https://www.vip.com/",
        "action": "https://category.vip.com/suggest.php",
        "kw_key": "keyword",
        "btns": {
            "sch": {
                "label": "搜索",
                "params": [
                    {key: "ff", val: "235|12|1|1" },
                ],
            }
        }
    },
    "dangdang": {
        "dname": "当当网",
        "addr": "http://www.dangdang.com/",
        "action": "http://search.dangdang.com",
        "charset": "gb18030",
        "kw_key": "key",
        "params_share": {
            "act": "input"
        },
        "btns": {
            "sch": {
                "label": "全部分类"
            },
            "book": {
                "label": "图书",
                "params": [
                    {
                        "key": "catagory_path",
                        "val": "01.00.00.00.00.00"
                    },
                    {
                        "key": "type",
                        "val": "01.00.00.00.00.00"
                    }
                ]
            },
            "book_file": {
                "label": "电子书",
                "params": [
                    {
                        "key": "catagory_path",
                        "val": "98.00.00.00.00.00"
                    },
                    {
                        "key": "type",
                        "val": "98.00.00.00.00.00"
                    }
                ]
            },
            "audio": {
                "label": "音像",
                "params": [
                    {
                        "key": "catagory_path",
                        "val": "03.00.00.00.00.00"
                    },
                    {
                        "key": "type",
                        "val": "03.00.00.00.00.00"
                    }
                ]
            },
            "video": {
                "label": "影视",
                "params": [
                    {
                        "key": "catagory_path",
                        "val": "05.00.00.00.00.00"
                    },
                    {
                        "key": "type",
                        "val": "05.00.00.00.00.00"
                    }
                ]
            }
        }
    },
    "suning": {
        "dname": "苏宁易购",
        "addr": "https://www.suning.com/",
        "full_url": "https://search.suning.com/{0}/"
    },
    "tmall_global": {
        "dname": i18n(["天猫国际", "TMall"]),
        "addr": "https://www.tmall.hk/",
        "action": "https://list.tmall.hk/search_product.htm",
        "kw_key": "q",
        "allow_referer": true,
        "btns": {
            "sch": {
                "label": i18n(["搜索", "Search"]),

            }
        }
    },
    "youdao": {
        "dname": "有道词典",
        "addr": "https://dict.youdao.com",
        "action": "https://dict.youdao.com/search",
        "kw_key": "q",
        "btns": {
            "lookup": {
                "label": "查询"
            }
        }
    },
    "baidu_translate": {
        "dname": "百度翻译",
        "addr": "https://fanyi.baidu.com/",
        "btns": {
            "trans_ch": {
                "label": "译为中文",
                "full_url": "https://fanyi.baidu.com/#en/zh/{0}"
            },
            "trans_en": {
                "label": "译为英文",
                "full_url": "https://fanyi.baidu.com/#zh/en/{0}"
            }
        }
    },
    "cambridge": {
        "dname": "Cambridge Dictionary",
        "addr": i18n([ "https://dictionary.cambridge.org/zhs/", "https://dictionary.cambridge.org"]) ,
        "btns": {
            "en_zh": {
                "label": "英汉",
                "visible_lang": "zh",
                "full_url": "https://dictionary.cambridge.org/zhs/词典/英语-汉语-简体/{0}"
            },
            "en": {
                "label": i18n( ["英英", "English"] ),
                "full_url": "https://dictionary.cambridge.org/dictionary/english/{0}"
            },
            
        }
    },
    "google_translate": {
        "dname": "Google Translate",
        "addr": "https://translate.google.com/",
        "action": "https://translate.google.com/",
        "kw_key": "text",
        "btns": {
            "to_zh": {
                "label": "译为中文",
                "visible_lang": "zh",
                "params": [
                    {key: "hl", val: "zh-CN"},
                    {key: "op", val: "translate"},
                    {key: "sl", val: "auto"},
                    {key: "tl", val: "zh-CN"},
                ]
            },
            "to_en": {
                "label": i18n(["译为英文", "to English"]),
                "params": [
                    {key: "hl", val: "zh-CN"},
                    {key: "op", val: "translate"},
                    {key: "sl", val: "auto"},
                    {key: "tl", val: "en-US"},
                ]
            },
            "web_to_zh": {
                "label": "网页译为中文",
                "visible_lang": "zh",
                "btn_tip": "输入网址，将整个网页译为中文",
                "action": "https://translate.google.com/translate",
                "kw_key": "u",
                "params": [
                    {key: "hl", val: "zh-CN"},
                    {key: "sl", val: "auto"},
                    {key: "tl", val: "zh-CN"},
                ],
            },
            "web_to_en": {
                "label": i18n(["网页译为英文", "Web to English"]),
                "btn_tip": "Input a URL. Translate web into English",
                "action": "https://translate.google.com/translate",
                "kw_key": "u",
                "params": [
                    {key: "hl", val: "en"},
                    {key: "sl", val: "auto"},
                    {key: "tl", val: "en"},
                ],
            }
        }
    },
    "bing_dict": {
        "dname": "必应词典",
        "addr": "https://cn.bing.com/dict/?mkt=zh-cn",
        "action": "https://cn.bing.com/dict/search",
        "kw_key": "q",
        "btns": {
            "sch": {
                "label": "查询"
            }
        }
    },
    "cnki": {
        "dname": "中国知网",
        "addr": "https://cnki.net",
        "action": "https://kns.cnki.net/kns8/defaultresult/index",
        "kw_key": "kw",
        //"method": "post",
        "btns": {
            "subject": {
                "label": "主题",
                "params": [
                    { key: "action" , val: "scdbsearch" },
                    { key: "txt_1_sel" , val: "SU$%=|" },
                    { key: "ua" , val: "1.11" },
                ]
            },
            "keyword": {
                "label": "关键词",
                "params": [
                    { key: "action" , val: "scdbsearch" },
                    { key: "txt_1_sel" , val: "KY$%=|" },
                    { key: "ua" , val: "1.11" },
                ]
            },
            "author": {
                "label": "作者",
                "params": [
                    { key: "action" , val: "scdbsearch" },
                    { key: "txt_1_sel" , val: "AU$%=|" },
                    { key: "ua" , val: "1.11" },
                ]
            },
            "abstract": {
                "label": "摘要",
                "params": [
                    { key: "action" , val: "scdbsearch" },
                    { key: "txt_1_sel" , val: "AB$%=|" },
                    { key: "ua" , val: "1.11" },
                ]
            },
            "doi": {
                "label": "DOI",
                "params": [
                    { key: "action" , val: "scdbsearch" },
                    { key: "txt_1_sel" , val: "DOI$%=|" },
                    { key: "ua" , val: "1.11" },
                ]
            },
            "allcontent": {
                "label": "全文",
                "params": [
                    { key: "action" , val: "scdbsearch" },
                    { key: "txt_1_sel" , val: "FT$%=|" },
                    { key: "ua" , val: "1.11" },
                ]
            },
        }
    },
    "wanfang": {
        "dname": "万方数据",
        "addr": "http://www.wanfangdata.com.cn/",
        "action": "http://www.wanfangdata.com.cn/search/searchList.do",
        "kw_key": "searchWord",
        "btns": {
            "sch": {
                "label": "检索全部",
                "params": [
                    { key: "searchType" , val: "all" },
                ]
            },
            "author": {
                "label": "作者",
                "kw_format": "作者:{0}",
                "params": [
                    { key: "searchType" , val: "all" },
                ]
            },
            "keyword": {
                "label": "关键词",
                "kw_format": "关键词:{0}",
                "params": [
                    { key: "searchType" , val: "all" },
                ]
            },
            "abstract": {
                "label": "摘要",
                "kw_format": "摘要:{0}",
                "params": [
                    { key: "searchType" , val: "all" },
                ]
            },
        }
    },
    "cssci": {
        "dname": "CSSCI",
        "addr": "http://cssci.nju.edu.cn/",
        "action": "http://cssci.nju.edu.cn/ly_search_view.html",
        "kw_key": "title",
        "btns": {
            "sch": {
                "label": "搜索",
                "kw_format": "{0}   15",
                "params": [
                    {
                        "key": "pagenum",
                        "val": "20"
                    },
                    {
                        "key": "order_type",
                        "val": "nian"
                    },
                    {
                        "key": "order_px",
                        "val": "DESC"
                    }
                ]
            }
        }
    },
    "webofscience": {
        "dname": "Web of Science",
        "addr": "https://apps.webofknowledge.com",
        "action": "https://apps.webofknowledge.com/UA_GeneralSearch.do",
        "kw_key": "value(input1)",
        "btns": {
            "sch": {
                "label": "Search",
                "params": [
                    {
                        "key": "value(select1)",
                        "val": "TS"
                    },
                    {
                        "key": "fieldCount",
                        "val": "1"
                    },
                    {
                        "key": "action",
                        "val": "search"
                    },
                    {
                        "key": "product",
                        "val": "UA"
                    },
                    {
                        "key": "search_mode",
                        "val": "GeneralSearch"
                    },
                    {
                        "key": "period",
                        "val": "Range Selection"
                    },
                    {
                        "key": "range",
                        "val": "ALL"
                    }
                ]
            }
        }
    },
    "ei": {
        "dname": "EI",
        "addr": "https://www.engineeringvillage.com/search/quick.url",
        "action": "https://www.engineeringvillage.com/search/submit.url",
        "kw_key": "searchWord1",
        "btns": {
            "sch": {
                "label": "Search",
                "params": [
                    {
                        "key": "CID",
                        "val": "searchSubmit"
                    },
                    {
                        "key": "searchtype",
                        "val": "Quick"
                    },
                    {
                        "key": "catagory",
                        "val": "quicksearch"
                    },
                    {
                        "key": "database",
                        "val": "1"
                    }
                ]
            }
        }
    },
    "ieee": {
        "dname": "IEEE Xplore",
        "addr": "https://ieeexplore.ieee.org",
        "action": "https://ieeexplore.ieee.org/search/searchresult.jsp",
        "kw_key": "queryText"
    },
    "google_scholar": {
        "dname": "Google Scholar",
        "addr": "https://scholar.google.com",
        "action": "https://scholar.google.com/scholar",
        "kw_key": "q"
    },
    "baidu_xuesu": {
        "dname": "百度学术",
        "addr": "https://xueshu.baidu.com",
        "action": "https://xueshu.baidu.com/s",
        "kw_key": "wd",
        "btns": {
            "sch": {
                "label": "全部文献"
            },
            "journal": {
                "label": "期刊",
                "params": [
                    {
                        "key": "filter",
                        "val": "sc_type={1}"
                    }
                ]
            },
            "confe": {
                "label": "会议",
                "params": [
                    {
                        "key": "filter",
                        "val": "sc_type={3}"
                    }
                ]
            },
            "degree": {
                "label": "学位",
                "params": [
                    {
                        "key": "filter",
                        "val": "sc_type={2}"
                    }
                ]
            },
            "wk": {
                "label": "百度文库",
                "dname": "百度文库",
                "addr": "https://wenku.baidu.com/",
                "action": "https://wenku.baidu.com/search",
                "charset": "gb18030",
                "kw_key": "word"
            },
            "bk": {
                "label": "百度百科",
                "dname": "百度百科",
                "addr": "https://baike.baidu.com",
                "action": "https://baike.baidu.com/search/word",
                "kw_key": "word",
            }
        }
    },
    "bing_ac": {
        "dname": i18n(["必应学术", "Bing Academic"]),
        "addr": "https://www.bing.com/academic",
        "action": "https://www.bing.com/academic/search",
        "kw_key": "q"
    },
    "wikip_zh": {
        "dname": "维基百科",
        "addr": "https://zh.wikipedia.org/zh/Wikipedia:%E9%A6%96%E9%A1%B5",
        "action": "https://zh.wikipedia.org/w/index.php",
        "kw_key": "search",
        "btns": {
            "go": {
                "label": "进入",
                full_url: "https://zh.wikipedia.org/wiki/{0}"
            },
            "search": {
                "label": "搜索",
                "params": [
                    {
                        "key": "fulltext",
                        "val": "1"
                    }
                ]
            },
            "go_en": {
                "label": "Go",
                "use_other_engine": {
                    "engine": "wikip_en",
                    "btn": "go"
                }
            },
            "sch_en": {
                "label": "Search",
                "use_other_engine": {
                    "engine": "wikip_en",
                    "btn": "search"
                }
            }
        }
    },
    "wikip_en": {
        "dname": "Wkipedia",
        "addr": "https://en.wikipedia.org/wiki/Main_Page",
        "action": "https://en.wikipedia.org/w/index.php",
        "kw_key": "search",
        "btns": {
            "go": {
                "label": "Go"
            },
            "search": {
                "label": "Search",
                "params": [
                    {
                        "key": "fulltext",
                        "val": "1"
                    }
                ]
            }
        }
    },
    "fdroid": {
        "dname": "F-Droid",
        "addr": "https://f-droid.org/",
        "tip": "专门收录开源应用的平台",
        "action": "https://search.f-droid.org/",
        "kw_key": "q"
    },
    "izzyondroid_fdroid": {
        "dname": "IzzyOnDroid F-Droid",
        "addr": "https://apt.izzysoft.de/fdroid/",
        "action": "https://apt.izzysoft.de/fdroid/index.php",
        "method": "post",
        "kw_key": "searchterm",
        "tip": "一个兼容并收录了几个不同（官方与第三方）F-Droid格式的仓库的网站。它本身也维护一个仓库",
        "btns": {
            "izzyondroid": {
                "label": "IzzyOnDroid",
                "params": [
                    {key: "doFilter", val: "Go!"},
                    /*
                    {key: "limit", val: "10"},
                    {key: "cat", val: ""},
                    {key: "license", val: ""},
                    {key: "boolanti", val: ""},
                    {key: "radd", val: ""},
                    {key: "rup", val: ""},
                    {key: "ibuild", val: ""},
                    */
                ]
            },
            "fdroid": {
                "label": "F-Droid",
                "action": "https://apt.izzysoft.de/fdroid/index.php?repo=main",
                "params": [
                    {key: "doFilter", val: "Go!"},
                ]
            },
            "fdroidarchive": {
                "label": "F-Droid Archive",
                "action": "https://apt.izzysoft.de/fdroid/index.php?repo=archive",
                "params": [
                    {key: "doFilter", val: "Go!"},
                ]
            },
            "guardian": {
                "label": "Guardian",
                "action": "https://apt.izzysoft.de/fdroid/index.php?repo=guardian",
                "params": [
                    {key: "doFilter", val: "Go!"},
                ]
            },
            "kali": {
                "label": "Kali Nethunter",
                "action": "https://apt.izzysoft.de/fdroid/index.php?repo=kali",
                "params": [
                    {key: "doFilter", val: "Go!"},
                ]
            },
            "nit": {
                "label": "Nit",
                "action": "https://apt.izzysoft.de/fdroid/index.php?repo=nit",
                "params": [
                    {key: "doFilter", val: "Go!"},
                ]
            },
        }
    },
    "apkdl": {
        "dname": "APKDL",
        "addr": "https://apkdl.net",
        "action": "https://apkdl.net/search",
        "kw_key": "q"
    },
    "google_play": {
        "dname": "Google Play Apps",
        "addr": "https://play.google.com/store/apps",
        "action": "https://play.google.com/store/search",
        "kw_key": "q",
        "btns": {
            "app": {
                "label": "Apps",
                "params": [
                    {
                        "key": "c",
                        "val": "apps"
                    }
                ]
            },
            "freeapp": {
                "label": "Free Apps",
                "params": [
                    {
                        "key": "c",
                        "val": "apps"
                    },
                    {
                        "key": "price",
                        "val": "1"
                    }
                ]
            }
        }
    },
    "apkmirror": {
        "dname": "APKMirror",
        "addr": "https://www.apkmirror.com",
        "action": "https://www.apkmirror.com/",
        "kw_key": "s",
        "btns": {
            "apks": {
                "label": "APKs",
                "params": [
                    {
                        "key": "searchtype",
                        "val": "apk"
                    }
                ]
            },
            "apps": {
                "label": "APPs",
                "params": [
                    {
                        "key": "searchtype",
                        "val": "app"
                    }
                ]
            }
        }
    },
    "apk-dl": {
        "dname": "APK-DL",
        "addr": "https://apk-dl.com/",
        "action": "https://apk-dl.com/search",
        "kw_key": "q"
    },
    "apkpure": {
        "dname": "APKPure",
        "addr": "https://apkpure.com",
        "action": "https://apkpure.com/cn/search",
        "kw_key": "q"
    },
    "freeapk": {
        "dname": "Freeapk",
        "addr": "https://freeapk.mobi",
        "full_url": "https://freeapk.mobi/search/{0}/"
    },
    "appsapk": {
        "dname": "AppsApk",
        "addr": "https://www.appsapk.com/",
        "action": "https://www.appsapk.com/",
        "kw_key": "s"
    },
    "androidpicks": {
        "dname": "Android Picks",
        "addr": "https://androidpicks.com/",
        "action": "https://androidpicks.com/",
        "kw_key": "s"
    },
    "androidapksfree": {
        "dname": "AndroidAPKsFree",
        "addr": "https://androidapksfree.com/",
        "action": "https://androidapksfree.com/",
        "kw_key": "s"
    },
    "evozi": {
        "dname": "Evozi APK Downloader",
        "tip": "这是一个输入APK包名（如com.tencent.mm）来生成下载链接的网站",
        "addr": "https://apps.evozi.com",
        "action": "https://apps.evozi.com/apk-downloader/",
        "btns": {
            "pkg_n": {
                "label": "Generate Download Link",
                "btn_tip": "输入APK包名（如com.tencent.mm），获取下载链接",
                "method": "get",
                "kw_key": "id"
            }
        }
    },
    "itunesapps": {
        dname: "iTunes Apps (Google)",
        addr: "https://www.apple.com/itunes/charts/free-apps/",
        kw_format: "{0} site:apple.com/*app",
        btns: {
            "Search Apps": {
                label: "Search Apps",
                use_other_engine: {
                    engine: "google",
                    btn: "search"
                }
            }
        }
    },
    "itunesapps_baidu": {
        "dname": "iTunes Apps (百度)",
        "addr": "https://www.apple.com/itunes/charts/free-apps/",
        "kw_format": "site:(apps.apple.com) {0}",
        "btns": {
            "Search Apps": {
                "label": "搜索Apps",
                "use_other_engine": {
                    "engine": "baidu",
                    "btn": "sch"
                }
            }
        }
    },
    "github": {
        "dname": "Github",
        "addr": "https://github.com",
        "action": "https://github.com/search",
        "kw_key": "q",
        "btns": {
            "repo": {
                "label": "Repo",
                "params": [
                    {
                        "key": "type",
                        "val": "repositories"
                    }
                ]
            },
            "code": {
                "label": "Code",
                "params": [
                    {
                        "key": "type",
                        "val": "code"
                    }
                ]
            },
            "users": {
                "label": "Users",
                "params": [
                    {
                        "key": "type",
                        "val": "users"
                    }
                ]
            },
        }
    },
    "mdn": {
        "dname": "MDN",
        "addr": "https://developer.mozilla.org",
        "action": "https://developer.mozilla.org/search",
        "kw_key": "q",
        "btns": {
            "search": {
                "label": "Search",
            },
            "sch_google": {
                "label": "Search (Google)",
                "kw_format": "{0} site:developer.mozilla.org/en-US",
                "use_other_engine": {
                    "engine": "google",
                    "btn": "search",
                }
            },
            /*
            "archived": {
                "label": "Archived (Google)",
                "kw_format": "{0} site:developer.mozilla.org/en-US/docs/Archive",
                "use_other_engine": {
                    "engine": "google",
                    "btn": "search",
                }
            },
            "jsm": {
                "label": "Legacy JS Modules (Google)",
                "kw_format": "{0} site:developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules",
                "use_other_engine": {
                    "engine": "google",
                    "btn": "search",
                }
            },
            */
        }
    },
    "stackexchange": {
        "dname": "StackExchange",
        "addr": "https://stackexchange.com/",
        "action": "https://stackexchange.com/search",
        "kw_key": "q"
    },
    
    "docker": {
        "dname": "Docker Hub",
        "addr": "https://hub.docker.com/",
        "action": "https://hub.docker.com/search/",
        "kw_key": "q",
        "btns": {
            "Search": {
                "label": "Search",
                "params": [
                    {
                        "key": "type",
                        "val": "image"
                    }
                ]
            }
        }
    },
    "flathub": {
        dname: "Flathub",
        addr: "https://flathub.org/apps",
        action: "https://flathub.org/apps/search",
        btns: {
            "Search": {
                label: "Search",
                full_url: "https://flathub.org/apps/search/{0}"
            }
        }
    },
    "homebrew": {
        "dname": "Homebrew",
        "addr": "https://formulae.brew.sh/",
        "btns": {
            "go": {
                "label": "Go",
                "full_url": "https://formulae.brew.sh/formula/{0}"
            }
        }
    },
    "snapcraft": {
        "dname": "Snapcraft",
        "addr": "https://snapcraft.io/store",
        "action": "https://snapcraft.io/search",
        "kw_key": "q"
    },
    "nix": {
        "dname": "NixOS",
        "addr": "https://search.nixos.org/packages?",
        "kw_key": "query",
        btns: {
            "pkgs": {
                label: "Packages",
                action: "https://search.nixos.org/packages",
            },
        }
    },
    "guix": {
        "dname": "GNU Guix packages",
        "addr": "https://guix.gnu.org/packages/",
        "action": "https://ci.guix.gnu.org/search",
        "kw_key": "query"
    },
    "alternativeto": {
        "dname": "AlternativeTo",
        "addr": "https://alternativeto.net/",
        "action": "https://alternativeto.net/browse/search",
        "kw_key": "q",
        "btns": {
            "Find Apps": {
                "label": "Find Apps",
                "kw_replace": [
                    [
                        " ",
                        "-"
                    ]
                ],
                "full_url": "https://alternativeto.net/software/{0}"
            },
            "Search": {
                "label": "Search"
            }
        }
    },
    "zdic": {
        dname: "汉典",
        addr: "https://www.zdic.net",
        btns: {
            "search": {
                label: "汉字词",
                full_url: "https://www.zdic.net/hans/{0}",
            },
        }
    },
    "ccamc": {
        dname: "古今文字集成",
        addr: "http://www.ccamc.co",
        tip: "一個集古今文字释義、字形更革、音韻演變之大全的大型在線辭書\n兼收錄其他少數民族的語言文字資料，如西夏文、契丹文、女真文、八思巴文",
        btns: {
            "search": {
                label: "漢字詞",
                btn_tip: "输入简体或繁体时，得的文字解释可能不同",
                action: "http://www.ccamc.co/cjkv.php",
                kw_key: "cjkv",
            },
        }
    },
    "moedict": {
        dname: "萌典",
        addr: "https://www.moedict.tw",
        tip: "萌典共收錄十六萬筆國語、兩萬筆臺語、一萬四千筆客語條目\n原始資料來源為教育部《重編國語辭典修訂本》\n兩岸詞典由中華文化總會提供\n輸入繁體可獲得最佳結果",
        btns: {
            "guoyu": {
                label: "國語辭典",
                full_url: "https://www.moedict.tw/{0}",
            },
            "cntw": {
                label: "兩岸詞典",
                full_url: "https://www.moedict.tw/~{0}",
            },
        }
    },
    "choco": {
        dname: "Chocolatey",
        addr: "https://chocolatey.org/packages",
        action: "https://chocolatey.org/packages",
        kw_key: "q",
        btns: {
            "sch": {
                label: "Search packages",
            },
            "sch_all": {
                label: "Search all packages",
                "params": [
                    {
                        "key": "moderationStatus",
                        "val": "all-statuses"
                    },
                    {
                        "key": "prerelease",
                        "val": "true"
                    },
                ],
            },
        }
    },
    "scoop": {
        dname: "Scoop Search Apps",
        addr: "https://scoop-docs.vercel.app/apps/",
        action: "https://scoop-docs.vercel.app/apps/",
        kw_key: "query",
    },
    "cygwin": {
        dname: "Cygwin packages",
        addr: "https://cygwin.com/packages/",
        action: "https://cygwin.com/cgi-bin2/package-grep.cgi",
        kw_key: "grep",
        btns: {
            "sch64": {
                label: "Search x86_64",
                "params": [
                    {
                        key: "arch",
                        val: "x86_64"
                    },
                ],
            },
            "sch_all": {
                label: "Search x86",
                params: [
                    {
                        key: "arch",
                        val: "x86_64"
                    },
                ],
            },
        }
    },
    "feixiaohao": {
        dname: "非小号",
        addr: "https://www.feixiaohao.com/",
        action: "https://www.feixiaohao.com/search/",
        kw_key: "word",
    },
    "aicoin": {
        dname: "AICoin",
        addr: "https://www.aicoin.cn/",
        action: "https://www.aicoin.cn/search",
        kw_key: "s",
    },
    "investing": {
        dname: "英为财情",
        addr: "https://cn.investing.com",
        action: "https://cn.investing.com/search/",
        kw_key: "q",
        btns: {
            "sch": {
                label: "所有结果",
            },
            "quotes": {
                label: "行情",
                params: [
                    {
                        key: "tab",
                        val: "quotes"
                    },
                ],
            },
            "news": {
                label: "新闻",
                params: [
                    {
                        key: "tab",
                        val: "news"
                    },
                ],
            },
            "articles": {
                label: "分析",
                params: [
                    {
                        key: "tab",
                        val: "articles"
                    },
                ],
            },
        }
    },
    "xueqiu": {
        dname: "雪球",
        addr: "https://xueqiu.com",
        action: "https://xueqiu.com/k",
        kw_key: "q",
        btns: {
            "sch": {
                label: "综合",
            },
            "stock": {
                label: "股票",
                full_url: "https://xueqiu.com/k?q={0}#/stock",
            },
            "timeline": {
                label: "讨论",
                full_url: "https://xueqiu.com/k?q={0}#/timeline",
            },
            "portfolio": {
                label: "组合",
                full_url: "https://xueqiu.com/k?q={0}#/portfolio",
            },
        }
    },
    "baidu_media": {
        "dname": "百度",
        "addr": "https://www.baidu.com",
        "btns": {
            "video": {
                "label": "视频",
                "kw_key": "query",
                "action": "https://haokan.baidu.com/web/search/page",
            },
            "image": {
                "label": "图片",
                "kw_key": "word",
                "action": "https://image.baidu.com/search/index",
                "params": [
                    { "key": "tn", "val": "baiduimage" },
                    { "key": "ie", "val": "utf-8" },
                ],
            },
        }
    },
    "bilibili": {
        "dname": "哔哩哔哩",
        "addr": "https://www.bilibili.com",
        "action": "https://search.bilibili.com/all",
        "kw_key": "keyword",
        "btns": {
            "all": {
                "label": "综合",
            },
            "video": {
                "label": "视频",
                "action": "https://search.bilibili.com/video",
            },
            "live": {
                "label": "直播",
                "action": "https://search.bilibili.com/live",
            },
            "user": {
                "label": "用户",
                "action": "https://search.bilibili.com/upuser",
            },
            "article": {
                "label": "专栏",
                "action": "https://search.bilibili.com/article",
            },
        }
    },
    "music163": {
        "dname": "网易云音乐",
        "addr": "https://music.163.com",
        "action": "https://music.163.com/#/search/m/",
        "kw_key": "s",
        "btns": {
            "song": {
                "label": "单曲",
                "full_url": "https://music.163.com/#/search/m/?s={0}&type=1"
            },
            "singer": {
                "label": "歌手",
                "full_url": "https://music.163.com/#/search/m/?s={0}&type=100"
            },
            "album": {
                "label": "专辑",
                "full_url": "https://music.163.com/#/search/m/?s={0}&type=10"
            },
            "video": {
                "label": "视频",
                "full_url": "https://music.163.com/#/search/m/?s={0}&type=1014"
            },
            "lyrics": {
                "label": "歌词",
                "full_url": "https://music.163.com/#/search/m/?s={0}&type=1006"
            },
        }
    },
    "google_media": {
        "dname": "Google",
        "addr": "https://www.google.com",
        "action": "https://www.google.com/search",
        "kw_key": "q",
        "btns": {
            "video": {
                "label": "Videos",
                "params" : [
                    { "key": "tbm", "val": "vid" }
                ]
            },
            "image": {
                "label": "Images",
                "params" : [
                    { "key": "tbm", "val": "isch" }
                ]
            }
        }
    },
    "youtube": {
        dname: "Youtube",
        addr: "https://www.youtube.com/",
        action: "https://www.youtube.com/results/",
        kw_key: "search_query",
    },
};

}


