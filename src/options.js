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

