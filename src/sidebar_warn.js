

async function start()
{
    if (await get_addon_setting("insistSidebar") === true)
        document.location.href = realSidebarUrl; 
    
    for (btn of document.querySelectorAll(".btn_insist_sidebar") )
    {
        btn.onclick = async function() {
            
            await chrome.storage.sync.set({'insistSidebar': true});
            
            document.location.href = realSidebarUrl; 
        }
    }
    
    if (await get_addon_setting("hl")) 
        window.lang = await get_addon_setting("hl");
    else
        window.lang = "en";
    
    rm_not_userlang();
}
start();
