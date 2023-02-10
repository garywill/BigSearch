async function on_optionpage_load() {

    //settings = await chrome.storage.sync.get([], (result) => {return result;}) || [];
    settings = await get_addon_setting();

    // -----------------------------
    
    if (settings['hl']) 
        document.getElementById("lang-selector").value = settings['hl'];

    document.getElementById("lang-selector").addEventListener("change",function () {
        chrome.storage.sync.set({"hl": document.getElementById("lang-selector").value  });
    });

    // --------------------------
    
    var setting_enContextMenu = await get_addon_setting_local('enContextMenu') ;
    
    if (setting_enContextMenu !== false)
        document.getElementById("cbox_enContextMenu").checked = true;
    
    document.getElementById("cbox_enContextMenu").addEventListener("change", function () {
        chrome.storage.local.set({"enContextMenu" : document.getElementById("cbox_enContextMenu").checked });
    });
    
    // ------------------
     
    var setting_contextMenuBehavior = await get_addon_setting_local('contextMenuBehavior') ;
    
    if (!setting_contextMenuBehavior)
        setting_contextMenuBehavior = "popup";
    
    document.querySelector(`#form_contextMenuBehavior input[name=contextmenu_behavior][value=${setting_contextMenuBehavior}]`).checked = true;
    
    Array.from (document.querySelectorAll("#form_contextMenuBehavior input[name=contextmenu_behavior]") ).forEach (function(ele) {
        ele.addEventListener("change", function () {
            if (ele.checked) {
                chrome.storage.local.set( { contextMenuBehavior : ele.value } );
            } 
        });
    });
    
    // -----------------
    var setting_copyOnContextMenuOrKey = await get_addon_setting_local('copyOnContextMenuOrKey') ;
    
    if (setting_copyOnContextMenuOrKey === true)
        document.getElementById("cbox_copyOnContextMenuOrKey").checked = true;
    
    document.getElementById("cbox_copyOnContextMenuOrKey").addEventListener("change", function (event) {
        chrome.storage.local.set({"copyOnContextMenuOrKey" : event.target.checked});
        
        if (event.target.checked)
            chrome.permissions.request( { permissions: ['clipboardWrite'] } , r=>console.log(r) );
    });
    
    // --------------------------
    

        
    if (settings['checkupdate'] === true) 
        document.getElementById("cbox_shownew").checked = true ;
    
    document.getElementById("cbox_shownew").addEventListener("change", function () {
        chrome.storage.sync.set({"checkupdate": document.getElementById("cbox_shownew").checked });
    });
    
    
    // --------------------------
    
    if (settings['noaddonstatistics'] === true) 
        document.getElementById("checkbox-nostatistics").checked = true;

    document.getElementById("checkbox-nostatistics").addEventListener("change", function () {
        //console.log("checkbox changed");
        chrome.storage.sync.set({"noaddonstatistics": document.getElementById("checkbox-nostatistics").checked });

    });
    
    if (settings['disable_editguicom'] === true) 
        document.getElementById("checkbox-disable-editguicom").checked = true;

    document.getElementById("checkbox-disable-editguicom").addEventListener("change", function () {
        chrome.storage.sync.set({"disable_editguicom": document.getElementById("checkbox-disable-editguicom").checked });
    });
    
    document.getElementById("curver").textContent = chrome.runtime.getManifest()['version'] ;
}

on_optionpage_load();

