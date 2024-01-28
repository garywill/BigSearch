console.log('offscreen.js');

chrome.runtime.onMessage.addListener(  function (message, sender, sendResponse){
    if ( chrome.runtime.id === sender.id 
        && message['to'] == 'offscreen'
    )
    { 
        if ( message['command'] == 'set_stored_input_content' ) {
            const str = message['inputcontent'];
            localStorage.setItem("input_content", str);
            sendResponse({r: true});
        }
        else if ( message['command'] == 'copy_to_clipboard' ) {
            const text = message['text'];
            // navigator.clipboard.writeText(text) ;  // 没有焦点所以不行
            try{
                // const textEl = document.createElement("textarea"); // doesn't work
                const textEl = document.getElementById("textarea_for_copy");
                textEl.value = text;
                textEl.select();
                document.execCommand('copy');
            }catch(err){
                sendResponse({r: ' ' + err});
                return;
            }
            sendResponse({r: true});
        } 
    } 
});