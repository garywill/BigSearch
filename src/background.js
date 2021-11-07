/*
 * By Big Search / 大术专搜
 * (acsearch.ga, acsearch.tk)
 * 
 * All Rights Reserved for This File
 * If want to use this code, welcome ask original author for FLOSS license
 * Before that, please DON'T use unauthorized code
 * 此文件 版权所有 保留所有权利
 * 若要使用代码，欢迎联系原作者获取 自由软件许可
 * 在取得许可前，请勿使用未授权的代码
 * 
 * Source code: https://github.com/garywill/BigSearch
 */

async function  on_addon_load() {
    
    if ( ! (await get_addon_setting("hl")) &&  
        chrome.i18n.getUILanguage().split('-')[0] == 'zh' 
    )
        await chrome.storage.sync.set({'hl':'zh'});

    
    set_contextmenu();
    
    set_checkupdate();
}

on_addon_load();

////////////////////////////////////

async function set_contextmenu() {
    var selection_menu_creation = {
        contexts: ["selection"],
        id: "menu_search_selected",
        title: "BigSearch for '%s'",
        //icons: {"32": "icon_button.svg"},
        onclick: function (info) {
            //console.log(info.selectionText);
            setStor("input_content", info.selectionText);
            try { chrome.browserAction.openPopup() ; } catch(err) {}
        }
    };
    if (isFirefox)
        selection_menu_creation.icons = {"32": "icon_button.svg"};
        
    chrome.contextMenus.create( selection_menu_creation );

    if (isFirefox)
    {
        chrome.contextMenus.onShown.addListener(function(info, tab) {
            //console.log(info.cookieStoreId);
            //console.log(tab);
            if ( isFirefox && tab.incognito)
                chrome.contextMenus.update("menu_search_selected", { visible: false});
            else
                chrome.contextMenus.update("menu_search_selected", { visible: true});
            
            // Note: Not waiting for returned promise.
            chrome.contextMenus.refresh();
        });
    }
}
//-------

async function set_checkupdate() {
    if ( (await get_addon_setting("checkupdate")) === false )
        return;
    
    parseGotNewsXml();
    
    // for real
    setTimeout( checkNews, 20*60*1000 );
    setInterval( checkNews , 10*60*60*1000 );
    
    // for test
    //setTimeout( checkNews, 6*1000 );
    //setInterval( checkNews , 30*1000 );
    
}

async function checkNews() {
    
    const news_urls = [
        "https://update.versioncheck.workers.dev/news",
        "https://acsearch.cf/appnews.php",
        "https://www.acsearch.ml/news.xml",
        "https://garywill.gitlab.io/releaseapps-dl/news.xml",
        `https://api.allorigins.win/raw?url=${encodeURIComponent('https://gitlab.com/garywill/releaseapps-dl/-/raw/main/news.xml')}`,
        "https://jsonp.afeld.me/?url=https://gitlab.com/garywill/releaseapps-dl/-/raw/main/news.xml",
    ];
    
    
    var url_use_sub = getRandomInt( news_urls.length );
    var news_url = news_urls [ url_use_sub ];
    
    //var news_url = "http://192.168.3.19:12000/appnews.php";
    //console.log("downloading", news_url);
    
    await fetch(news_url).then(response => response.text()).then(textString => {
        var xml = textString;
        
        try{
            const parser = new DOMParser();
            var xmlDoc = parser.parseFromString(xml, "text/xml");

            var xmlBigsearch = xmlDoc.querySelector("news[app=bigsearch-addon]");
            
            const serializer = new XMLSerializer();
            var serXmlStr = serializer.serializeToString(xmlBigsearch) ;
            
            setStor("latest_news_xml",serXmlStr)
            parseGotNewsXml();
        }catch(err) {
            console.warn("Error on parsing downloaded latest news");
            console.warn(err);

            clearShowingNews(true);
        }
    }) .catch(err => {
        console.warn("Error on fetching latest news");
        console.warn(err);
        
        clearShowingNews(true);
    });
}

// called when 
//  1. after successfully getting news 
//  2. on addon loaded (possibly updated)
async function parseGotNewsXml()  
{
    clearShowingNews(false);
    
    const xml = getStor("latest_news_xml");
    
    if (!xml)
        return;
    
    const parser = new DOMParser();
    var newsDoc;
    newsDoc = parser.parseFromString(xml, "text/xml");
    
    
    var filters = newsDoc.documentElement.querySelectorAll("filter") ;
    for (var i=0; i<filters.length; i++) {
        
        if ( filters[i].getAttribute("version") )
        {
            const cur_ver = chrome.runtime.getManifest()['version'] ;
            const [op, cmp_ver] = filters[i].getAttribute("version").split(' ');
            if (op == "lt")  // lt = less than
            {
                if ( compareVer(cur_ver, cmp_ver) != -1 )
                    continue;
            }
            else if (op == "le")  // le = less than or equal
            {
                if ( compareVer(cur_ver, cmp_ver) > 0 )
                    continue;
            }
        }
        
        if ( filters[i].getAttribute("browsertype") == "chromium" )
        {
            if ( ! isChrome ) 
                continue;
        }
        else if ( filters[i].getAttribute("browsertype") == "firefox" )
        {
            if ( ! isFirefox )
                continue;
        }
        else if ( filters[i].getAttribute("browsertype") == "chrome-store" )
        {
            if ( ! isFromStore(".google.com") )
                continue;
        }
        else if ( filters[i].getAttribute("browsertype") == "edge-store" )
        {
            if ( ! isFromStore(".microsoft.com") )
                continue;
        }
        else if ( filters[i].getAttribute("browsertype") == "opera-store" )
        {
            if ( ! isFromStore(".opera.com") )
                continue;
        }
        
        if ( filters[i].getAttribute("installtype") == "hosted" )
        {
            if ( ( await ifNotStore() ) !== true )
                continue;
        }
        
        
        parse_news(filters[i]);

        break;
    }
    
    async function parse_news( news_filter_tag ) 
    {
        //console.log("passed filter");
        //console.log(news_filter_tag.outerHTML);
        
        if ( news_filter_tag.querySelector("switch") &&
            news_filter_tag.querySelector("switch").getAttribute("show") == "false" 
        ) 
        {
            clearShowingNews(false);
            return;
        }
        
        const lang = (await get_addon_setting("hl")) ;
        var text = "";
        if ( ! lang ) // language not set. use default language
        {
            text = news_filter_tag.querySelector(`lang[lang=en]`).getAttribute("text") ;
        }else {
            if ( news_filter_tag.querySelector(`lang[lang=${lang}]`) )
                text =  news_filter_tag.querySelector(`lang[lang=${lang}]`).getAttribute("text") ;
            else 
                text =  news_filter_tag.querySelector(`lang[lang=en]`).getAttribute("text") ;
        }
        
        if ( text )
        {
            setStor("news_text", text);
            
            if ( news_filter_tag.querySelector("link") && 
                news_filter_tag.querySelector("link").getAttribute("link") 
            )
                setStor("news_link", news_filter_tag.querySelector("link").getAttribute("link") );
        }
        
        //console.log( getStor('news_text') );
        //console.log( getStor('news_link') );
        
    }
    
    // https://stackoverflow.com/a/53387532/10617713
    // Function returns:
    // 0 : a = b
    // 1 : a > b
    // -1 : a < b
    function compareVer(a, b)
    {
        function prep(t)
        {
            return ("" + t)
            //treat non-numerical characters as lower version
            //replacing them with a negative number based on charcode of first character
            .replace(/[^0-9\.]+/g, function(c){return "." + ((c = c.replace(/[\W_]+/, "")) ? c.toLowerCase().charCodeAt(0) - 65536 : "") + "."})
            //remove trailing "." and "0" if followed by non-numerical characters (1.0.0b);
            .replace(/(?:\.0+)*(\.-[0-9]+)(\.[0-9]+)?\.*$/g, "$1$2")
            .split('.');
        }
        a = prep(a);
        b = prep(b);
        for (var i = 0; i < Math.max(a.length, b.length); i++)
        {
            //convert to integer the most efficient way
            a[i] = ~~a[i];
            b[i] = ~~b[i];
            if (a[i] > b[i])
                return 1;
            else if (a[i] < b[i])
                return -1;
        }
        return 0;
    }
    
    async function ifNotStore() {
        if ( isFromStore(".google.com") || isFromStore(".microsoft.com") || isFromStore(".opera.com") )
            return false;
        
        if (isFirefox && browser.runtime.getManifest()['browser_specific_settings'] 
                && browser.runtime.getManifest()['browser_specific_settings']['gecko']
                && browser.runtime.getManifest()['browser_specific_settings']['gecko']['update_url']
        )
            return true;
        
        if ( (await getInstallType() ) != "normal" ) 
            return true;

        if (isFirefox && chrome.runtime.id != "{45a03d78-2183-4d73-afe4-cfda260d1308}")
            return true;
        
        if (isChrome && chrome.runtime.id == "gaalgfdodackblpbckbllfghldhhmehb")
            return true;
        

    }
    
    function isFromStore(storeDomain) {
        const buildin_update = chrome.runtime.getManifest()['update_url'] ;
        if ( typeof ( buildin_update ) == "string" ){
            const buildin_update_host = buildin_update.split('/')[2];
            if ( buildin_update_host.endsWith(storeDomain) )
                return true;
        }
        return false;
    }
    
    
}

function clearShowingNews(if_del_xml=false) {
    if (if_del_xml)
        delStor("latest_news_xml");
    
    delStor("news_text");
    delStor("news_link");
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
