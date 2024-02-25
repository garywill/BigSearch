/*
 * Big Search (大术专搜)
 *     https://github.com/garywill/BigSearch
 *     https://addons.mozilla.org/firefox/addon/big-search/
 *     https://chrome.google.com/webstore/detail/big-search/ojcnjeigmgjaiolalpapfnmmhdmpjhfb
 * 
 * Licensed under AGPL (GNU Affero General Public License)
 */

console.log('background.js');

async function  on_addon_load() {
   
    if ( ! (await get_addon_setting("hl")) &&  
        chrome.i18n.getUILanguage().split('-')[0] == 'zh' 
    )
        await chrome.storage.sync.set({'hl':'zh'});
    
    
    set_sidebar_panel(); 
    
}

on_addon_load(); // TODO ????  判断是否sw第一次运行 ？ ???

////////////////////////////////////


async function set_sidebar_panel()
{
    if (isFirefox) {
        if (await get_addon_setting("insistSidebar") === true) {
            await browser.sidebarAction.setPanel({panel: realSidebarUrl });
        }
    } else if(isChrome){
        await chrome.sidePanel.setOptions({path: realSidebarUrl}) 
        // Chrome won't open sidebar automatically when install
        // Chrome don't allow sidepanel path having '?'
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
            curTab = (await chrome.tabs.query ( {currentWindow:true, active: true} ) ) [0] ;
        }
        
        if (!curTab) {
            console.debug(" curTab is still none. returning. ");
            return;
        }
        
        var wid = curTab.windowId ;
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
        try{
            chrome.runtime.sendMessage ( { 
                from : "background",
                to: "home.html", 
                to_showas: "stab", 
                evt: "open_or_switchTo_stab_inThisWindow", 
                command: "stabs_report_yourselfs",
            } );
        }catch(err){console.warn(err);} 
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
//======================================

// ---------------------

async function onMenuClickOrKeyFunc_copy(str) { 
    var setting_copyOnContextMenuOrKey = await get_addon_setting_local('copyOnContextMenuOrKey') ;
    if (!setting_copyOnContextMenuOrKey)
        return;
    
    if(isFirefox){
        navigator.clipboard.writeText(str) ; 
    }else if (isChrome) {
        await chrome.offscreen.createDocument({
            url: 'offscreen.html',
            reasons: ["CLIPBOARD"],
            justification: 'Copy text to clipboard'
        });
        
        try{ 
            var r =await chrome.runtime.sendMessage({
                to: 'offscreen', 
                command: 'copy_to_clipboard', 
                text: str, 
            });
            console.log('copy offscreen result:', r);
        }catch(err){console.warn(err);}
        
        await chrome.offscreen.closeDocument( ) ;
    }
} ;

//===================================
// ====== key shortcut command ==========

chrome.commands.onCommand.addListener(async function (command, tab) { // 'tab' is only in mv3+Chrome
    console.log(command);
    if (command == "selection_as_search_then_open_popup")
        try { 
            // NOTE !!!! NOTICE !!  ` openPopup ` not allow above have ` await ` 
            chrome.action.openPopup() ; 
        } catch(err) { console.warn(err) }
    else if (command == "selection_as_search_then_open_sidebar")
        try { 
            // NOTE !!!! NOTICE !!   not allow above have ` await ` 
            if (isFirefox)
                chrome.sidebarAction.open() ; 
            else if (isChrome)
                chrome.sidePanel.open({windowId: tab.windowId});
        } catch(err) { console.warn(err) }
        
    if (command.startsWith("selection_as_search")) {
        
        console.debug("onCommand. Startswith selection_as_search");
        
        // NOTE !!!! NOTICE !!  ` permissions.request ` not allow above have ` await ` 
        console.log (
            await chrome.permissions.request({ permissions: ["activeTab"] })
        );
        
        if (!tab) {
            tab = ( await chrome.tabs.query({currentWindow:true, active: true}) )[0];
        }
        console.log(tab);
        (async function () {
            console.log( "inject getSelectionText, result:", 
                await chrome.scripting.executeScript( {
                    func: getSelectionText, 
                    target: { allFrames: false, tabId: tab.id }, 
                } , callback__selection_as_search )
            ); 
        }) (); 
    }
    
    if (command == "selection_as_search_then_open_stab"
        || command == "open_stab" )
        await open_or_switchTo_stab_inThisWindow(tab);
    
});
async function callback__selection_as_search (results)
{
    console.log(results);
    
    var selected_text;
    
    if (results[0])
        selected_text = results[0].result ;
    
    if (typeof(selected_text) !== "string")
        selected_text = null;
    
    if (selected_text)
    {
        try {  await onMenuClickOrKeyFunc_copy(selected_text) ;  } catch(err) { console.warn(err) }
        
        await set_stored_input_content(selected_text, isChrome?true:false);    
        
        try {
            chrome.runtime.sendMessage( {
                from : "background",
                to: "home.html", 
                evt: "user commanded selection_as_search", 
                command: "setInputBoxToText",
                text: selected_text
            } );
        }catch(err){console.warn(err);}
    }
}

function getSelectionText() { // for inject
    console.log("injected getSelectionText()");
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

// ====== key shortcut command end ==========
// ==========================================



chrome.runtime.onMessage.addListener(  function (request, sender, sendResponse){
    if ( chrome.runtime.id === sender.id 
        && request['to'] == 'background'
        && request['command'] == 'add_ajax_inject_prepare'
    )
    {
        console.log("background got add_ajax_inject_prepare command");
        const ajax = request['ajax'];
        const keyword = request['keyword'];
        const tabid = sender.tab.id;
        console.debug('about to inject to tab id', tabid);
        
        var timeoutId ;
        timeoutId = setTimeout( function () { 
            if (isFirefox)
                chrome.tabs.onUpdated.removeListener(onTabUpdated, {tabId: tabid, properties: [ "status" ] } );
            else if(isChrome)
                chrome.tabs.onUpdated.removeListener(onTabUpdated );
            timeoutId = null;
            console.warn("ajax timeout. tabid", tabid);
        }, 60*1000 );        
        
        async function onTabUpdated(tabId, changeInfo, tab) {
            if (tabId === tabid && (changeInfo.status == 'complete' || changeInfo.TabStatus == 'complete')) {
                clearTimeout(timeoutId);
                await chrome.scripting.executeScript({
                    func: ajax_execute,
                    args: [ajax, keyword], 
                    target: { allFrames: false, tabId: tabid }, 
                });
                console.log("after inject");
                if (isFirefox)
                    chrome.tabs.onUpdated.removeListener(onTabUpdated, {tabId: tabid, properties: [ "status" ] } );
                else if(isChrome)
                    chrome.tabs.onUpdated.removeListener(onTabUpdated );
                
            }
        }
        
        (async () => {
            console.debug("adding onUpdated listener to tab", tabid);
            if (isFirefox)
                await chrome.tabs.onUpdated.addListener(onTabUpdated, {tabId: tabid, properties: [ "status" ] } );
            else if(isChrome)
                await chrome.tabs.onUpdated.addListener(onTabUpdated );
            console.debug("after adding onUpdated listener to tab", tabid);
            
            sendResponse({r:'yes'});
        })();
        
        return true;
    }
});


// =========================================

//==== context menu ===================
// it's said: do menu creation and even listener at top level


var selection_menu_creation = {
    contexts: ["selection"],
    // id: "menu_search_selected",
    title: "BigSearch for '%s'",
    // visible: false , 
};
if (isFirefox)
    selection_menu_creation.icons = {"32": "icon_button.png"};

const menuS = ['popup', 'stab', 'sidebar'];
for (var m of menuS) {
    var menu_to_create = JSON.parse(JSON.stringify(selection_menu_creation));
    menu_to_create.id = "menu_search_selected__" + m ;
    // menu_to_create.title = `BigSearch for '%s' (${m})`; 
    try {chrome.contextMenus.create( menu_to_create ); }catch(err) { }
}

chrome.contextMenus.onClicked.addListener( async function onContextMenuClick(info, tab) {
    console.log("onContextMenuClick()");
    if (info.menuItemId.startsWith( "menu_search_selected__" ) )
    {
        var which_btn = info.menuItemId.split('menu_search_selected__')[1];
        try {  
            switch (which_btn) {
                case "sidebar":
                    // NOTE !!!! NOTICE !!   not allow above have ` await ` 
                    if (isFirefox)
                        chrome.sidebarAction.open() ; 
                else if (isChrome)
                    chrome.sidePanel.open({windowId: tab.windowId});
                break;
                case "stab":
                    await open_or_switchTo_stab_inThisWindow(tab) ; 
                    break;
                case "popup":
                default:
                    // NOTE !!!! NOTICE !!  ` openPopup ` not allow above have ` await ` 
                    chrome.action.openPopup() ; 
                    break;
            }
        } catch(err) { console.warn(err) }
        
        try {
            await onMenuClickOrKeyFunc_copy(info.selectionText) ; 
        } catch(err) { console.warn(err) }
        
        await set_stored_input_content( info.selectionText, isChrome?true:false);    
        
        try{
            chrome.runtime.sendMessage( {
                from : "background",
                to: "home.html", 
                evt: "menu_search_selected clicked", 
                command: "setInputBoxToText",
                text: info.selectionText
            } );
        }catch(err){console.warn(err);} 
    } 
} );



if (isFirefox) {
    chrome.contextMenus.onShown.addListener(async function(info, tab) {
        //console.log(info.cookieStoreId);
        //console.log(tab);
        if ( isFirefox && tab.incognito) {
            for (var m of menuS) { 
                chrome.contextMenus.update("menu_search_selected__" + m, { visible: false});
            }
        }else{
            var enContextMenu = await get_addon_setting_local('enContextMenu') ;
            if (enContextMenu !== false ) {
                
                var behavior = await get_addon_setting_local('contextMenuBehavior') ;
                // console.log("saved menu behavior settings:" , behavior);
                if (!behavior) 
                    behavior = 'popup';
                chrome.contextMenus.update("menu_search_selected__" + behavior, { visible: true});
            } 
            
        } 
        
        // Note: Not waiting for returned promise.
        chrome.contextMenus.refresh();
    });
}


async function del_unneeded_menu() {
    var enContextMenu = await get_addon_setting_local('enContextMenu') ;
    if (enContextMenu !== false ) {
        
        var behavior = await get_addon_setting_local('contextMenuBehavior') ;
        // console.log("saved menu behavior settings:" , behavior);
        if (!behavior) 
            behavior = 'popup';
        for (var m of menuS) {
            // console.debug(m);
            if (m != behavior)
                try { chrome.contextMenus.remove("menu_search_selected__" + m); }catch(err) { }
        } 
    } else {
        chrome.contextMenus.removeAll();
    }
}
del_unneeded_menu();
// ======  context menu end ================