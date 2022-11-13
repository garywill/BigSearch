
var mtm = null;
async function do_stati()
{
    if (window.run_env != "http_web" ) { // browser addon
        if ( ( await get_addon_setting('noaddonstatistics') ) == true ||  // user disable stati
            chrome.extension.inIncognitoContext   // user in private mode
        )
        {  
            return; 
        }
    }
    
    if (getStor("beatnowhere") === "true")  // user disable stati
        return ;
    
        
    if (window.run_env == "http_web") {
    }
    else
    {
        document.querySelector("img#stati_51").src = "https://ia.51.la/go1?id=21129037&pvFlag=1";
        
        mtm = {
            // generate random string everytime
            chardb: '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
            rand_str: function(n) {  
                var s = [];
                for (var i=0; i<n; i++) {
                    s.push( Array.from(mtm.chardb) [ getRandomInt(mtm.chardb.length -1) ] );
                }
                return s.join('');
            },
            mtm_url: 'https://acsearch.cf/mpx/matomo.php' ,
            fake_url: 'https://acsearch.cf/BigSearch.addon/'
                + 'UA/' + navigator.userAgent.replaceAll('/', '_').replaceAll(' ','-').replaceAll(';','') , // browser type
            fake_title: 'Big Search Addon '
                + chrome.runtime.getManifest()['version']   // adddon version
                + ' [' + chrome.i18n.getUILanguage() + '] '  // language
                + `${localStorage['theme'] ? ' [' + localStorage['theme'] + '] ': ''}` // in-addon theme
                + '(' + (await getInstallType()) + ')' // install from web store or not
            ,
            page_pg: function() {
                mtm.pvid = mtm.rand_str(6); // generate random string everytime
                mtm.uid = (getRandomInt( parseInt('fffffffffffffff',16) ) + parseInt('1000000000000000',16)).toString(16) ; // generate random string everytime
                try{
                    fetch(
                        mtm.mtm_url + `?rec=1&pv_id=${mtm.pvid}&_id=${mtm.uid}&rand=${getRandomInt(100)}&action_name=${mtm.fake_title}&url=${mtm.fake_url}&idsite=7`
                    , { mode: 'no-cors' } );
                }catch(err){}
                mtm.inited = true;  // wouldn't reach here if user disable stati
            },
            goevent: function(dbname) {
                if (!mtm.inited)
                    return;  // user disable stati
                try{
                    fetch(
                        mtm.mtm_url + `?rec=1&pv_id=${mtm.pvid}&_id=${mtm.uid}&rand=${getRandomInt(100)}&idsite=7&e_c=clickbtn&e_a=go&e_n=${dbname}&e_v=${Object.keys(usercustom_engines).length}` // user using build-in, browser-in, or custom ?
                    , { mode: 'no-cors' } );
                }catch(err){}
            }
            
        };
        
        mtm.page_pg(); // wouldn't reach here if user disable stati
    }
    
}
   

async function stati_goclicked (obj) {
    
    const dbname = obj.getAttribute("dbname");
    const e = obj.getAttribute("e");
    const b = obj.getAttribute("b");
    
    if ( window.run_env == "http_web" &&  dbname == "bigsearch" )
    {
    }
        
    
    if ( window.run_env != "http_web" ) {
        if ( ( await get_addon_setting('noaddonstatistics') ) !== true ) { // user disable or not
            
            mtm.goevent(dbname);
        }
    }
}


