/*
 * Big Search (大术专搜)
 *     https://github.com/garywill/BigSearch
 *     https://addons.mozilla.org/firefox/addon/big-search/
 *     https://chrome.google.com/webstore/detail/big-search/ojcnjeigmgjaiolalpapfnmmhdmpjhfb
 * 
 * Licensed under AGPL (GNU Affero General Public License)
 */


async function  on_addon_load() {
   
    if ( ! (await get_addon_setting("hl")) &&  
        chrome.i18n.getUILanguage().split('-')[0] == 'zh' 
    )
        await chrome.storage.sync.set({'hl':'zh'});

    
    set_contextmenu();
    
    set_sidebar_panel(); 
    
    setContextMenuOrKeyShortcutCopyBehavior() 
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

async function open_or_switchTo_stab_inThisWindow(curTab)
{
    if (isFirefox) { 
        await chrome.tabs.query(
            {
                url:chrome.runtime.getURL('home.html'), 
                currentWindow: true
            },
            onGotResults 
        ) ;
    }
    else if (isChrome) {
        if (! curTab) {
            console.debug( "curTab is false, need to query");
            await chrome.tabs.query({currentWindow:true, active: true}, function(r) { curTab = r[0] } ) ;
        }
        
        if (!curTab) {
            console.debug(" curTab is still none. returning. ");
            return;
        }
        
        var wid = curTab.windowId ;
        // wid = await (new Promise((resolve, reject) => {
        //     chrome.tabs.get(curTab.id, function(win) { resolve (win.windowId) ; } ) ;
        // } ) ) ;
        console.debug("current active window id", wid);
        
            
        chrome.runtime.onMessage.addListener( parseStabsReportThemselves );
        var timeoutId ;
        timeoutId = setTimeout( function () { 
            chrome.runtime.onMessage.removeListener( parseStabsReportThemselves );
            timeoutId = null;
            onGotResults([]);
        }, 100 );
        
        async function parseStabsReportThemselves (request, sender, sendResponse) {
            console.debug("receive message ",  request, sender);
            if ( chrome.runtime.id === sender.id 
                && request['from'] == 'home.html'
                && request['from_showas'] == 'stab' 
            )
            {
                if (sender.tab ) {
                    var senderWid = sender.tab.windowId ;
                    console.debug("sender window id", senderWid);
                    if ( wid > 0 && senderWid > 0 && senderWid === wid ) {
                        chrome.runtime.onMessage.removeListener( parseStabsReportThemselves );
                        clearTimeout(timeoutId);
                        tmeoutId = null;
                        onGotResults( [ sender.tab ] );
                    }
                }
            }
        }
        chrome.runtime.sendMessage ( { 
            from : "background",
            to: "home.html", 
            to_showas: "stab", 
            evt: "open_or_switchTo_stab_inThisWindow", 
            command: "stabs_report_yourselfs",
        } );
    }
    
    async function onGotResults(result) {
        if (!result.length>0)
        {
            chrome.tabs.create( { url: chrome.runtime.getURL('home.html'), active: true, index: 0  } ) ;
        }
        else
        {
            const tabAlready = result[0];
            chrome.tabs.update(tabAlready.id, { active: true }) ;
        } 
    }
    
}

//-----------------------

var onMenuClickFunc_open = function() { console.warn("onMenuClickFunc_open not set") ; } ;
async function set_contextmenu() {
    var enContextMenu = await get_addon_setting_local('enContextMenu') ;
    if (enContextMenu === false )
        return;
    
    var selection_menu_creation = {
        contexts: ["selection"],
        id: "menu_search_selected",
        title: "BigSearch for '%s'",

    };
    if (isFirefox)
        selection_menu_creation.icons = {"32": "icon_button.png"};
    
    chrome.contextMenus.onClicked.addListener( onContextMenuClick );
        
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
    
    var setting_contextMenuBehavior = await get_addon_setting_local('contextMenuBehavior') ;
    switch (setting_contextMenuBehavior)
    {
        case "sidebar":
            onMenuClickFunc_open = function() {  chrome.sidebarAction.open() ; } ;
            break;
        case "stab":
            onMenuClickFunc_open = async function(tabMenued) { await open_or_switchTo_stab_inThisWindow(tabMenued) ; } ;
            break;
        case "popup":
        default:
            onMenuClickFunc_open = function() { 
                // NOTE !!!! NOTICE !!  ` openPopup ` not allow above have ` await ` 
                if (mv>=3) 
                    chrome.action.openPopup() ; 
                else 
                    chrome.browserAction.openPopup() ;  
            } ;
            break;
    }
    
    
}

    
async function onContextMenuClick(info, tab)
{
    if (info.menuItemId === "menu_search_selected" )
    {
        // console.debug(" contextmenu onclick", info, tab);
        
        try {  onMenuClickFunc_open(tab) ;  } catch(err) { console.warn(err) }
        try {  onMenuClickOrKeyFunc_copy(info.selectionText) ;  } catch(err) { console.warn(err) }
        
        await set_stored_input_content( info.selectionText);   // NOTE TODO Chrome mv3 no localStorage
        chrome.runtime.sendMessage( {
            from : "background",
            to: "home.html", 
            evt: "menu_search_selected clicked", 
            command: "setInputBoxToText",
            text: info.selectionText
        } );
    } 
}

// ---------------------

var onMenuClickOrKeyFunc_copy = function() { console.warn("onMenuClickOrKeyFunc_copy not set") ; } ;
async function setContextMenuOrKeyShortcutCopyBehavior() 
{
    var setting_copyOnContextMenuOrKey = await get_addon_setting_local('copyOnContextMenuOrKey') ;
    if (setting_copyOnContextMenuOrKey)
        onMenuClickOrKeyFunc_copy = function(str) { 
            // NOTE !!!! NOTICE !!  ` permissions.request ` not allow above have ` await ` 
            chrome.permissions.request( { permissions: ['clipboardWrite'] } , r=>console.log(r) );
            navigator.clipboard.writeText(str) ;
        } ;
    else 
        onMenuClickOrKeyFunc_copy = function() { console.debug("not copying") } ;
}    

//--------------------

chrome.commands.onCommand.addListener(async function (command, tab) { // 'tab' is only in mv3
    if (command == "selection_as_search_then_open_popup")
        try { 
            // NOTE !!!! NOTICE !!  ` openPopup ` not allow above have ` await ` 
            if (mv>=3) 
                chrome.action.openPopup() ; 
            else 
                chrome.browserAction.openPopup() ;  
        } catch(err) { console.warn(err) }
    else if (command == "selection_as_search_then_open_sidebar")
        try { chrome.sidebarAction.open() ; } catch(err) { console.warn(err) }
        
    if (command.startsWith("selection_as_search")) {
        
        // console.debug("onCommand selection_as_search");
        
        // NOTE !!!! NOTICE !!  ` permissions.request ` not allow above have ` await ` 
        await chrome.permissions.request({ permissions: ["activeTab"] });
        
        if (mv >= 3)
        {
            // NOTE !!!! NOTICE !!  ` permissions.request ` not allow above have ` await ` 
            await chrome.permissions.request({ permissions: ["scripting"] });

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
    
    if (command == "selection_as_search_then_open_stab"
        || command == "open_stab" )
        await open_or_switchTo_stab_inThisWindow(tab);
    
});
async function callback__selection_as_search (results)
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
        try {  onMenuClickOrKeyFunc_copy(selected_text) ;  } catch(err) { console.warn(err) }
        
        await set_stored_input_content( results[0]);  // TODO localStorage is not usable in mv3 service worker. Usable in mv2 background
        
        chrome.runtime.sendMessage( {
            from : "background",
            to: "home.html", 
            evt: "user commanded selection_as_search", 
            command: "setInputBoxToText",
            text: selected_text
        } );
        
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
    

    
//     console.debug("getSelectionText() return:", text);
    return text;
}
