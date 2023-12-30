/*
 * Big Search (大术专搜)
 *     https://github.com/garywill/BigSearch
 *     https://addons.mozilla.org/firefox/addon/big-search/
 *     https://chrome.google.com/webstore/detail/big-search/ojcnjeigmgjaiolalpapfnmmhdmpjhfb
 * 
 * Licensed under AGPL (GNU Affero General Public License)
 */

var btmDialogToggler;
function init_btmDialogToggler() {
    
    btmDialogToggler = new function btmDialogTogglerClass() {
        
        this.onBtnClick = function() {
            
            var btn_id = this.id;
            if ( btn_id == "btn_donate" ||
                btn_id == (window.run_env == "http_web" ? "btn_webext" : "btn_about") ||
                btn_id == "btn_usage"
            ) {
                var imgs = document.getElementById(btn_id + "_dialog").querySelectorAll("img[nsrc]");
                Array.from(imgs).forEach(function(ele) {
                    if (ele.getAttribute("src") != ele.getAttribute("nsrc") )
                        ele.setAttribute("src", ele.getAttribute("nsrc"));
                });
            }
            
            switch(btn_id)
            {
                case "btn_donate":
                case "btn_about":
                case "btn_usage":
                case "btn_usetip":
                case "btn_theme":
                case "btn_source":
                case "btn_webext":
                    btmDialogToggler.toggle( document.getElementById(btn_id + "_dialog") );
                    Array.from(document.querySelectorAll(".btm_dialog:not(#" + btn_id + "_dialog)")).forEach(function(ele) {
                        ele.style.display = "none";
                    });
                    break;
            }
            
        };
        this.toggle = function(object) {
            
            
            
            if ( !object || getComputedStyle(object).display != "none") {
                this.close(object);
            } else {
                this.open(object);
            }
        };
        this.open = function(object) {
            object.style.display = "block";
            document.body.classList.add("when-btm-open");
        };
        this.close = function(object) {
            document.body.classList.remove("when-btm-open");
            object.style.display = "none";
        };
    }();
}
	
    

function putmail()
{
    str1 = "garywill";
    str2 = "disroot";
    str3 = "org";
    mail = str1 + "@" + str2 + "." + str3;
    
    var ourmail=document.getElementById("ourmail");
    ourmail.href="mailto:" + mail;
    ourmail.appendChild(document.createTextNode(mail));
    
}
