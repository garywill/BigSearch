/*
 * Big Search (大术专搜)
 *     https://github.com/garywill/BigSearch
 *     https://addons.mozilla.org/firefox/addon/big-search/
 *     https://chrome.google.com/webstore/detail/big-search/ojcnjeigmgjaiolalpapfnmmhdmpjhfb
 * 
 * Licensed under AGPL (GNU Affero General Public License)
 */


async function ajax_execute(ajax, keyword)
{
    console.debug("ajax_execute()");
    const before_start = 100;
    var slow = 20;
    async function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function start_go()
    {
        if ( Array.isArray(ajax) )
        { 
            for (var i=0; i<ajax.length; i++)
            { 
                ajax_arr_ele = ajax[i];
                await proc_ajax_object(ajax_arr_ele, i+1, ajax.length);
                await sleep(slow * 10);
            } 
        } 
        else 
        {
            ajax_arr_ele = ajax;
            await proc_ajax_object(ajax_arr_ele, 1, 1);
        }
    }
    async function proc_ajax_object(ajax_arr_ele, n, N)
    {
        
        if ( typeof(ajax_arr_ele) === "string" )
        {
            var web_element = document.querySelectorAll(ajax_arr_ele)[0];
            if ( web_element.tagName == "TEXTAREA" )
            {
                await doInput(ajax_arr_ele, n==N);
            }
            else if ( web_element.tagName == "INPUT" )
            {
                if ( web_element.getAttribute("type") === null ||
                    ["", "text", "search", "number", "tel", "email", "url", "password", "range", "date", "datetime-local", "time" , "week", "datetime", "hidden"]
                    .includes( web_element.getAttribute("type").toLowerCase() )
                )
                {
                    await doInput(ajax_arr_ele, n==N);
                }
                else if (web_element.getAttribute("type").toLowerCase() == "radio")
                {
                    web_element.checked="checked";
                }
                else if (web_element.getAttribute("type").toLowerCase() == "checkbox")
                {
                    web_element.checked="checked"; // TODO uncheck
                }
                else if (["submit", "button", "reset"]
                    .includes( web_element.getAttribute("type").toLowerCase() )
                )
                {
                    web_element.click();
                }
                // TODO checkbox image file
            }
            else if ( web_element.tagName == "BUTTON" )
            {
                web_element.click();
            }
        }
        else if ( typeof(ajax_arr_ele) === "number" )
        {
            await sleep(ajax_arr_ele);
        }
    }
    
    async function doInput(queryStr, pressEnter=true) 
    {
        
        var web_inputbox;
        
        await sleep(slow * 5);
        web_inputbox = document.querySelectorAll(queryStr)[0];
        web_inputbox.click();
        
        await sleep(slow * 5);
        web_inputbox = document.querySelectorAll(queryStr)[0];
        web_inputbox.focus();
        
        
        await sleep(slow * 5);
        web_inputbox = document.querySelectorAll(queryStr)[0];
        web_inputbox.dispatchEvent ( new KeyboardEvent( "keypress", { key: " ", keyCode: 32, bubbles: true } ) );
        
        await sleep(slow * 5);
        web_inputbox = document.querySelectorAll(queryStr)[0];
        web_inputbox.dispatchEvent ( new KeyboardEvent( "keydown", { key: " ", keyCode: 32, bubbles: true } ) );
        
        await sleep(slow * 1);
        web_inputbox = document.querySelectorAll(queryStr)[0];
        web_inputbox.dispatchEvent ( new KeyboardEvent( "keyup", { key: " ", keyCode: 32, bubbles: true } ) );
        
        await sleep(slow * 2);
        web_inputbox = document.querySelectorAll(queryStr)[0];
        web_inputbox.dispatchEvent ( new Event( "input", { bubbles:true } ) );
        
        await sleep(slow * 2);
        web_inputbox = document.querySelectorAll(queryStr)[0];
        web_inputbox.dispatchEvent ( new Event( "change", { bubbles:true } ) );
        
        
        
        
        await sleep(slow * 5);
        web_inputbox = document.querySelectorAll(queryStr)[0];
        web_inputbox.value = keyword ;
        
        
        
        await sleep(slow * 5);
        web_inputbox = document.querySelectorAll(queryStr)[0];
        web_inputbox.dispatchEvent ( new KeyboardEvent( "keypress", { key: " ", keyCode: 32, bubbles: true } ) );
        
        await sleep(slow * 5);
        web_inputbox = document.querySelectorAll(queryStr)[0];
        web_inputbox.dispatchEvent ( new KeyboardEvent( "keydown", { key: " ", keyCode: 32, bubbles: true } ) );
        
        await sleep(slow * 1);
        web_inputbox = document.querySelectorAll(queryStr)[0];
        web_inputbox.dispatchEvent ( new KeyboardEvent( "keyup", { key: " ", keyCode: 32, bubbles: true } ) );

        await sleep(slow * 2);
        web_inputbox = document.querySelectorAll(queryStr)[0];
        web_inputbox.dispatchEvent ( new Event( "input", { bubbles:true } ) );
        
        await sleep(slow * 2);
        web_inputbox = document.querySelectorAll(queryStr)[0];
        web_inputbox.dispatchEvent ( new Event( "change", { bubbles:true } ) );
        

        
        if (pressEnter) 
        {
            await sleep(slow * 5);
            web_inputbox = document.querySelectorAll(queryStr)[0];
            web_inputbox.dispatchEvent ( new KeyboardEvent( "keypress", { key: "Enter", keyCode: 13, bubbles: true } ) );
            
            await sleep(slow * 5);
            web_inputbox = document.querySelectorAll(queryStr)[0];
            web_inputbox.dispatchEvent ( new KeyboardEvent( "keydown", { key: "Enter", keyCode: 13, bubbles: true } ) );
            
            await sleep(slow * 1);
            web_inputbox = document.querySelectorAll(queryStr)[0];
            web_inputbox.dispatchEvent ( new KeyboardEvent( "keyup", { key: "Enter", keyCode: 13, bubbles: true } ) );
        }
    }

    setTimeout(start_go, before_start);
}
