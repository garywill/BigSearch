

function i18n(arr)
{
    //console.log("P2 ", window.lang);
    if ( Array.isArray(arr) )
    {
        if ( window.lang == "zh" && arr[0] !== undefined )
            return arr[0];
        else if ( window.lang == "en" && arr[1] !== undefined )
            return arr[1];
        else if ( typeof(arr[1]) === "string" )
            return arr[1];
        else if ( typeof(arr[0]) === "string" )
            return arr[0];
    }
    else if (typeof(arr) === "object")
    {
        if (arr[window.lang] !== undefined)
            return arr[window.lang];
        else if (arr.en !== undefined)
            return arr.en;
        else (arr.zh !== undefined)
            return arr.zh
    }
    else if (typeof(arr) === "string"){
        return arr;
    }
     
    return "i18n_no";
}

document.addEventListener('DOMContentLoaded', async (event) => {

    window.lang = "en";
    init_data();

    var str="";

    Object.keys(catas).forEach( function( cata, cata_index ) {
        if ( isVisible(catas[cata]) )
        {
            str += "- **" + catas[cata]['label'] + "**: ";
            
            //str += "  - ";
            var engines_dnames = [];
            catas[cata].engines.forEach( function(row) {
                if (row['type'] != "engine")
                    return;
                    
                engine = row['name'];
                if (isVisible(row))
                {
                    engines_dnames.push( sEngines[engine]['dname'] );
                }
            });
            str += engines_dnames.join(' | ');
            str += "\n";
        }
    });

    window.lang = "zh";
    init_data();
    str += "\n\n\n";
    
    Object.keys(catas).forEach( function( cata, cata_index ) {
        if ( isVisible(catas[cata]) )
        {
            var engines_dnames = [];
            catas[cata].engines.forEach( function(row) {
                if (row['type'] != "engine")
                    return;
                    
                engine = row['name'];
                if (is_zh(row) || is_zh(catas[cata]))
                {
                    engines_dnames.push( sEngines[engine]['dname'] );
                }
            });
            
            if ( engines_dnames.length > 0  ) 
            {
                str += "- **" + catas[cata]['label'] + "**： ";
                //str += "  - ";
                str += engines_dnames.join('、');
                str += "\n";
            }
        }
    });
    
    document.body.innerHTML = "<pre>" + str + "</pre>";
    
});

function is_zh(obj)
{
    if (!obj.visible_lang ) return false;
    
    if (typeof(obj.visible_lang) === "string")
    {
        if (obj.visible_lang.startsWith("zh")) return true;
        else return false;
    }
    else
    {
        
    }
    
    return false
}


