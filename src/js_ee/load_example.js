/*
 * Big Search (大术专搜)
 *     https://github.com/garywill/BigSearch
 *     https://addons.mozilla.org/firefox/addon/big-search/
 *     https://chrome.google.com/webstore/detail/big-search/ojcnjeigmgjaiolalpapfnmmhdmpjhfb
 * 
 * Licensed under AGPL (GNU Affero General Public License)
 */


function load_example(template) {
    var con = false;
    if ( bs_gui.userJsonArr.length > 0 )
        con = confirm("Do you want to load example into below table? \nThat will override what's currently in the table below.") ;
    else
        con = true;   
    
    if (!con)
        return;
    
    const template_default = `
{
    "l_common" : { "lstr": "Favorite built-in engines" },
    "f_google": { "fav": "google" },
    "f_github": { "fav": "github" },
    "l_my" : { "lstr": "My Engines" },
    "e_my1": {
        "dname": "My Search Engine 1",
        "full_url": "https://example.com/search?q={0}"
    },
    "e_my2": {
        "dname": "My Search Engine 2",
        "full_url": "https://example.com/search?q={0}&all=1"
    }
}
    `;
    
    const template_chi = `
{
  "f_baidu": { "fav": "baidu" },
  "f_google": { "fav": "google" },
  "f_bing": { "fav": "bing" },
  "l_buy": { "lstr": "买买买" },
  "f_taobao": { "fav": "taobao" },
  "f_jd": { "fav": "jd" },
  "l_video": { "lstr": "听听 看看" },
  "f_bili": { "fav": "bilibili" },
  "f_163music": { "fav": "music163" },
  "l_translate": { "lstr": "译译译" },
  "f_youdao": { "fav": "youdao" },
  "f_baidufanyi": { "fav": "baidu_translate" },  
  "f_googletranslate": { "fav": "google_translate" },
  "f_deepl": { "fav": "deepl" }
}
    `;
    
    const template_en = `
{
  "f_google": { "fav": "google" },
  "f_duckduckgo": { "fav": "duckduckgo" },
  "l_video": { "lstr": "Video" },
  "f_youtube": { "fav": "youtube" },
  "f_netflix": { "fav": "netflix" },
  "l_mobile": { "lstr": "Mobile App" },
  "f_googleplay": { "fav": "google_play" },
  "f_fdroid": { "fav": "fdroid" },
  "l_translate": { "lstr": "Translate" },
  "f_googletranslate": { "fav": "google_translate" },
  "f_deepl": { "fav": "deepl" },
  "l_work": { "lstr": "Work" },
  "f_github": { "fav": "github" },
  "f_mdn": { "fav": "mdn" }
}
    `;
    
    const template_adv = `
{
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
  "label_mbap": { "lstr": "Cross-engine" },
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
    "dname": "Many Engines",
    "btns": {
      "gg_ddg": {
        "label": "Google + DDG",
        "use_other_engine": ["google", "duckduckgo"]
      }
    }
  }
}
    `;
    
    var use_template ;
    if (! template || template == "default")
        use_template = template_default;
    else if (template == "chi")
        use_template = template_chi;
    else if (template == "en")
        use_template = template_en;
    else if (template == "adv")
        use_template = template_adv;
    
    $("#user_json_field").val(use_template);
    $("#user_json_field")[0].dispatchEvent(new Event('input'));
    bs_gui.parseUserJson();
}
 
