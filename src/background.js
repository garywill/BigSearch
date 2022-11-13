/*
 * By Big Search / 大术专搜
 * (addons.mozilla.org/firefox/addon/big-search/)
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
    
    set_sidebar_panel(); 
}

on_addon_load(); // TODO ????  判断是否sw第一次运行 ？ ???

////////////////////////////////////


async function set_sidebar_panel()
{
    if (await get_addon_setting("insistSidebar") === true)
    {
        await browser.sidebarAction.setPanel({panel: realSidebarUrl });
    }
}

//-----------------------

async function set_contextmenu() {
    var selection_menu_creation = {
        contexts: ["selection"],
        id: "menu_search_selected",
        title: "BigSearch for '%s'",
        //icons: {"32": "icon_button.svg"},

    };
    if (isFirefox)
        selection_menu_creation.icons = {"32": "icon_button.svg"};
    
    if (mv==2)
    {
        selection_menu_creation ['onclick'] = function (info) {
            //console.log(info.selectionText);
            setStor("input_content", info.selectionText);
            try { chrome.browserAction.openPopup() ; } catch(err) {}
        }
    }
    else if (mv>=3)
    {
        chrome.contextMenus.onClicked.addListener( function (info) {
            if (info.menuItemId === "menu_search_selected" )
            {
                console.debug("mv3 contextmenu onclick", info);
                setStor("input_content", info.selectionText);   // NOTE TODO Chrome mv3 no localStorage
                try { chrome.browserAction.openPopup() ; } catch(err) {}
            } 
        } );
    }
        
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

//--------------------

chrome.commands.onCommand.addListener( function (command, tab) { // 'tab' is only in mv3
    if (command == "selection_as_search") {
        
        console.debug("onCommand selection_as_search");
        
        chrome.permissions.request({ permissions: ["activeTab"] });
        
        if (mv >= 3)
        {
            chrome.permissions.request({ permissions: ["scripting"] });

            chrome.scripting.executeScript( {
                func: getSelectionText, 
                target: { allFrames: false, tabId: tab.id }, 
            } , callback__selection_as_search );
        }
        else
        {
            chrome.tabs.executeScript({
                code: '(' + getSelectionText.toString() + ')()',
                allFrames: false,
                matchAboutBlank: true
            }, callback__selection_as_search );
        } 
    }
    
});
function callback__selection_as_search (results)
{
    console.log(results);
    
    var selected_text;
    
    if (mv >= 3)
    {
        if (results[0])
            selected_text = results[0].result ;
    }
    else
        selected_text = results[0];  
    
    if (typeof(selected_text) !== "string")
        selected_text = null;
    
    if (selected_text)
    {
        if (mv==2)
            setStor("input_content", results[0]);  // localStorage is not usable in mv3 service worker. Usable in mv2 background
        // TODO
//         if (isFirefox)
//             browser.browserAction.openPopup() ; // won't allow here
    }
}

function getSelectionText() {
    var activeEl = document;
    do {
        activeEl = activeEl.activeElement;
        //console.log( activeEl);
        if (activeEl.tagName == "IFRAME")
            activeEl = activeEl.contentDocument;
    } while (activeEl.toString() == "[object HTMLDocument]")
    
    var docNode = activeEl.ownerDocument;
    
    var activeElTagName = activeEl.tagName;
    
    var text = null;
    
    if (
        (activeElTagName == "TEXTAREA") || (activeElTagName == "INPUT" &&
        /^(?:text|search|password|tel|url)$/i.test(activeEl.type)) &&
        (typeof activeEl.selectionStart == "number")
    ) {
        text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);
    } else if (docNode.getSelection) {
        text = docNode.getSelection().toString();
    }
    
//     console.debug(localStorage);
//     if (text)
//         localStorage.setItem("input_content", text);  // 'localStorage' in Content Script is the web page's localStorage
    
    
//     console.debug("getSelectionText() return:", text);
    return text;
}
