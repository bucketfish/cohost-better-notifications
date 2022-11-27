document.addEventListener('DOMContentLoaded', function (event) {
  document.getElementById("switch").onclick = toggleswitch;
  document.getElementById("sidebar-switch").onclick = togglesidebar;

  chrome.storage.sync.get('enabled', function (data) {
    if (data.enabled == false) {
      document.getElementById("switch").checked = false
    }
  });

  chrome.storage.sync.get('sidebar', function (data) {
    if (data.sidebar == false) {
      document.getElementById("sidebar-switch").checked = false
    }
  });
});

function toggleswitch() {
  if (document.getElementById("switch").checked) {
    chrome.storage.sync.set({ "enabled": true });
    // document.getElementById("switch").checked = false;
  } else {
    chrome.storage.sync.set({ "enabled": false });
    // document.getElementById("switch").checked = true
  }
}

function togglesidebar() {
  if (document.getElementById("sidebar-switch").checked) {
    chrome.storage.sync.set({ "sidebar": true });
    // document.getElementById("switch").checked = false;
  } else {
    chrome.storage.sync.set({ "sidebar": false });
    // document.getElementById("switch").checked = true
  }
}
