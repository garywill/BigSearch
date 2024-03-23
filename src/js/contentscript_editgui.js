
init();

async function init() 
{
    if (await get_addon_setting("disable_editguicom") === true) 
        return;


    console.log("content  script");

    window.addEventListener("message", async function(event) {
        if (event.source == window && 
            event.data.app && event.data.app == "bigsearch-edit" &&
            event.data.direction && event.data.direction == "page-to-content"
        ) 
        {
            const recMessage = event.data.message;
            
            if (recMessage == "getVersion" ) {
                window.postMessage({
                    direction: "content-to-page",
                    app: "bigsearch-edit",
                    bsAddonVersion: chrome.runtime.getManifest()['version']
                }, document.location.href);
                return;
            }
            
            if (recMessage == "getAddonBuildin") {
                var got_addon_lang = await get_addon_setting("hl");
                if (got_addon_lang) 
                    window.lang = got_addon_lang;
                else
                    window.lang = "en";
                init_data();
                window.postMessage({
                    direction: "content-to-page",
                    app: "bigsearch-edit",
                    addonBuildin: {catas: catas, sEngines:sEngines}, 
                    lang: window.lang, 
                }, document.location.href);
                return;
            }
            
            console.log("Content script received message event:\n" , event);
            
            if (recMessage == "getAddonUsercustom") {
                window.postMessage({
                    direction: "content-to-page",
                    app: "bigsearch-edit",
                    addonUsercustom: await addon_read_usercustom_engines()
                }, document.location.href);
            }
            
            if (recMessage == "setExtUsercustom" || recMessage == "setAddonUsercustom") {
                var saveresult = await addon_save_json_to_usercustom(event.data.usercustomJson);
                
                if (saveresult)
                    window.postMessage({
                        direction: "content-to-page",
                        app: "bigsearch-edit",
                        message: "text",
                        messageContent: {status: "success" , text: "Successfully saved to extension\n\nTips: We recommend you to also manually save a copy of your custom engines data JSON in a file in your hard disk"}
                    }, document.location.href);
                else
                    window.postMessage({
                        direction: "content-to-page",
                        app: "bigsearch-edit",
                        message: "text",
                        messageContent: {status: "fail" , text: "Failed to save your data\n\nWere you trying to save a too large data? The limitation is about 20-30 kB.\n\nContact developer if you still have problems."}
                    }, document.location.href);
                    
            }
        }
    });
    
}
