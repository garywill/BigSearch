window.run_page = "connecting";

var docHrefSearchParams;

var dbname;
var e_name;
var b_name;

var kw;

var data;

document.addEventListener("DOMContentLoaded", async function() {
    var got_addon_lang = await get_addon_setting("hl");
    if (got_addon_lang) 
        window.lang = got_addon_lang;
    else
        window.lang = "en";
    
    init_data();
    
    var docHrefUrlParse = new URL ( document.location.href);
    docHrefSearchParams = docHrefUrlParse.searchParams ;
    
    dbname = docHrefSearchParams.get("dbname");
    e_name = docHrefSearchParams.get("e_name");
    b_name = docHrefSearchParams.get("b_name");
    kw = docHrefSearchParams.get("kw");
    
    if (dbname == "user")
        await read_usercustom_engines();
    
    data = getDataForGo(e_name, b_name, dbname);
    
    go();
    
    display();
    
});

async function go()
{
    if (data.full_url !== undefined)
    {
     
        set_string_format_prototype();
        
        go_full_url(kw, data.full_url, data.charset, data.allow_referer);
        
        return;
    }
    else
    {
        var fparams = [];
        fparams.push( { key: data.kw_key, val: kw } );
        if(data.params !== undefined) {
            data.params.forEach(function(ele){
                fparams.push(ele);
            });
        }
        form_submit(fparams, data.action, data.charset, data.method, data.allow_referer);

    }
    
}

async function display()
{
    rm_not_userlang();
    
    const span_engineDisplayName = document.getElementById("span_engineDisplayName");
    const span_buttonDisplayName = document.getElementById("span_buttonDisplayName");
    const textarea_kw = document.getElementById("textarea_kw");
    
    span_engineDisplayName.textContent = data.dname ;
    span_buttonDisplayName.textContent = data.label;
    textarea_kw.textContent = kw;
    
    document.title = data.dname + ' (' + i18n([ "大术专搜 正连接目标..", "Big Search connecting to.." ]) + ')'
    
//     var click_e;
//     var click_b;
//     
//     click_e = docHrefSearchParams.get("click_e");
//     if (click_e)
//     {
//         click_b = docHrefSearchParams.get("click_b");
//         
//         var click_eObj = 
//     }
    
    setTimeout(function() {
        const btn_retry = document.getElementById("btn_retry") ;
        btn_retry.onclick = go;
        btn_retry.style.visibility = "";
    }, 
    8000);
}


