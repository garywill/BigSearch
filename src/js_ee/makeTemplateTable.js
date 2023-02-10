
// onrd.push( function() {
//     makeTemplateTable();
// });
function makeTemplateTable() {
    $("#addRow_templatesTable")[0].innerHTML = INTABLE_HTML;
}
        
const INTABLE_HTML = `
<tr><td colspan="2"><b>Simple</b></td><tr>
            <tr>
                <td><button class="btn btn-primary btn_adding_templ" data-bs-dismiss="modal" v-on:click="addRowByTemplate(rindex2add,'simple')">Engine (simple GET method)</button></td>
                <td>An HTTP GET method search engine. <br>E.g. <code>https://www.google.com/search?q={0}</code></td>
            </tr>
            <tr>
                <td><button class="btn btn-primary btn_adding_templ" data-bs-dismiss="modal" v-on:click="addRowByTemplate(rindex2add,'labelrow')">Label row</button></td>
                <td>A label row</td>
            </tr>
            <tr>
                <td><button class="btn btn-primary btn_adding_templ" data-bs-dismiss="modal" v-on:click="addRowByTemplate(rindex2add,'fav')">Link to build-in engine</button></td>
                <td>Add a Big Search build-in engine link.<br>Notice you don't have to add link from here.<br>Use the build-in engines listing table below.</td>
            </tr>
<tr><td colspan="2"><b>Full format templates</b> (this part's editting GUI is still in construction. User need to edit in JSON)</td><tr>
            <tr>
                <td><button class="btn btn-primary btn_adding_templ" data-bs-dismiss="modal" v-on:click="addRowByTemplate(rindex2add,'post')">Engine (POST method)</button></td>
                <td>
                    Engine in HTTP POST method. With additional form key-value pairs.<br>
                    E.g. :<br>
<pre><code class="fenced-code-block">"method": "post",
"action": "https://example.com/search",
"kw_key": "q",
"params": [
    {"key": "catagory_id", "val": "5"},
    {"key": "search_more", "val": "yes"}
]</code></pre>
 
                </td>
            </tr>
            <tr>
                <td><button class="btn btn-primary btn_adding_templ" data-bs-dismiss="modal" v-on:click="addRowByTemplate(rindex2add,'cross')">Cross-engine search</button></td>
                <td>
                    Use a universal search engine (e.g. google) to <br>search a website (e.g. iTunes) that doesn't provide search<br>
                    E.g. 1 :<br>
<pre><code class="fenced-code-block">"kw_format": "{0} site:apple.com/*app",
"use_other_engine": "google"</code></pre>
                    E.g. 2 :<br>
                    
                    
<pre><code class="fenced-code-block">"kw_format": "{0} site:apple.com/*app",
"use_other_engine": { "dbname": "bigsearch", "engine": "google", "btn": "search" }</code></pre>
                Default <code>dbname</code> is <code>bigsearch</code>. Otherwise value can be <code>user</code> / <code>browser</code>.<br>
                With or without specifying button. Defaultly uses the first button.<br>
                </td>
            </tr>
            <tr>
                <td><button class="btn btn-primary btn_adding_templ" data-bs-dismiss="modal" v-on:click="addRowByTemplate(rindex2add,'many')">Many engines at once</button></td>
                <td>
                    Search many engines at once<br>
                    E.g. 1 :<br>
<pre><code class="fenced-code-block">"use_other_engine": [ "google", "duckduckgo" ]</code></pre><br>
                    E.g. 2 :<br>
<pre><code class="fenced-code-block">"use_other_engine": [
    "yahoo",  
    { "dbname": "bigsearch", "engine": "google", "btn": "search" },
    { "dbname": "bigsearch", "engine": "duckduckgo" },
    { "dbname": "user", "engine": "my_engine_8" }
]</code></pre><br>
                <code>use_other_engine</code> can be an object/string (one engine) or an array (use many engines at once).<br>
                </td>
            </tr>
            <tr>
                <td><button class="btn btn-primary btn_adding_templ" data-bs-dismiss="modal" v-on:click="addRowByTemplate(rindex2add,'ajax')">Search In-page-Ajax-render website</button></td>
                <td>
                    Some websites doesn't accept GET or POST.<br>Visitor need to open their page and input, then they show search results on page via Ajax.<br>Big Search browser extension supports searching in such In-page-Ajax-render websites.<br>Use element(s) querySelector<br>
                    E.g. 1 :<br>
<pre><code class="fenced-code-block">"ajax": "#search-box-id"</code></pre><br>
                    E.g. 2 : Delay 2s -> Input -> Delay 1s -> Trigger clicking button event<br>
<pre><code class="fenced-code-block">"ajax": [2000, "#search-box-input", 1000, "#submit-button"]</code></pre><br>
                </td>
            </tr>
        
`;

 
