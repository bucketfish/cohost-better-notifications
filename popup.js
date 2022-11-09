document.addEventListener('DOMContentLoaded', function(event) {
   document.getElementById("switch").onclick = toggleswitch;

   chrome.storage.sync.get('enabled', function(data) {
     if (!data.enabled){
       document.getElementById("switch").checked = false
     }
   });
 });



function toggleswitch() {
  if (document.getElementById("switch").checked) {
    chrome.storage.sync.set({ "enabled": true });
    // document.getElementById("switch").checked = false;
  }
  else {
    chrome.storage.sync.set({ "enabled": false });
    // document.getElementById("switch").checked = true
  }

}
