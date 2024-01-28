async function on_optionpage_load() {

    //settings = await chrome.storage.sync.get([], (result) => {return result;}) || [];
    settings = await get_addon_setting();

    // -----------------------------
    (async () => {
        if (settings['hl']) 
            document.getElementById("lang-selector").value = settings['hl'];

        document.getElementById("lang-selector").addEventListener("change",function () {
            chrome.storage.sync.set({"hl": document.getElementById("lang-selector").value  });
        });
    } ) () ;
    
    // ---------------------------
    (async () => {
        var setting_newTabPosition = await get_addon_setting_local('newTabPos');
        
        if (!setting_newTabPosition)
            setting_newTabPosition = 'left-all';
        
        document.getElementById('open-position-selector').value = setting_newTabPosition;
        
        document.getElementById("open-position-selector").addEventListener("change",function () {
            chrome.storage.local.set({"newTabPos" : document.getElementById("open-position-selector").value });
        }); 
        
    } ) () ;

    // --------------------------
    (async () => {
        var setting_enContextMenu = await get_addon_setting_local('enContextMenu') ;
        
        if (setting_enContextMenu !== false)
            document.getElementById("cbox_enContextMenu").checked = true;
        
        document.getElementById("cbox_enContextMenu").addEventListener("change", function () {
            chrome.storage.local.set({"enContextMenu" : document.getElementById("cbox_enContextMenu").checked });
        });
    } ) () ;
    // ------------------
    (async () => {
        var setting_contextMenuBehavior = await get_addon_setting_local('contextMenuBehavior') ;
        
        if (!setting_contextMenuBehavior)
            setting_contextMenuBehavior = 'popup';
        
        document.querySelector(`#form_contextMenuBehavior input[name=contextmenu_behavior][value=${setting_contextMenuBehavior}]`).checked = true;
        
        Array.from (document.querySelectorAll("#form_contextMenuBehavior input[name=contextmenu_behavior]") ).forEach (function(ele) {
            ele.addEventListener("change", function () {
                if (ele.checked) {
                    chrome.storage.local.set( { contextMenuBehavior : ele.value } );
                } 
            });
        });
    } ) () ;
    
    // -----------------
    (async () => {
        var setting_copyOnContextMenuOrKey = await get_addon_setting_local('copyOnContextMenuOrKey') ;
        
        if (setting_copyOnContextMenuOrKey === true)
            document.getElementById("cbox_copyOnContextMenuOrKey").checked = true;
        
        document.getElementById("cbox_copyOnContextMenuOrKey").addEventListener("change", function (event) {
            chrome.storage.local.set({"copyOnContextMenuOrKey" : event.target.checked});
        });
    } ) () ;
    // --------------------------
    (async () => {
        var setting_autoSelectInputText = await get_addon_setting_local('autoSelectInputText') ;
        
        if (setting_autoSelectInputText !== false)
            document.getElementById("cbox_autoSelectInputText").checked = true;
        
        document.getElementById("cbox_autoSelectInputText").addEventListener("change", function (event) {
            chrome.storage.local.set({"autoSelectInputText" : event.target.checked});
        });
    } ) () ;
    // --------------------------
    

    (async () => {
        if (settings['checkupdate'] === true) 
            document.getElementById("cbox_shownew").checked = true ;
        
        document.getElementById("cbox_shownew").addEventListener("change", function () {
            chrome.storage.sync.set({"checkupdate": document.getElementById("cbox_shownew").checked });
        });
    } ) () ;
    
    // --------------------------
    

     (async () => {
        if (settings['disable_editguicom'] === true) 
            document.getElementById("checkbox-disable-editguicom").checked = true;

        document.getElementById("checkbox-disable-editguicom").addEventListener("change", function () {
            chrome.storage.sync.set({"disable_editguicom": document.getElementById("checkbox-disable-editguicom").checked });
        });
    } ) () ;
    
    // ----------------------------------- 
    document.getElementById("curver").textContent = chrome.runtime.getManifest()['version'] ;
}


document.addEventListener("DOMContentLoaded", on_optionpage_load);

