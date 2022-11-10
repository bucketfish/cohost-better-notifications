var reloadbutton

function personlink(name) {
  return "https://cohost.org/" + name.substring(1)
}

function dothings() {
  var enabled

  // check whether extension is on
  chrome.storage.sync.get('enabled', function(data) {
    enabled = data.enabled;

  if (enabled){
    const grid = document.getElementsByTagName("body")[0];

    // create sidebar
    var sidebar
    if (document.getElementById("bn-sidebar") == null){
      sidebar = document.createElement("div");
      sidebar.id = "bn-sidebar"
    }
    else {
      sidebar = document.getElementById("bn-sidebar")
    }


    var notifs = {} // each post: like, rp
    var follows = []

    // big list of days
    const biglist = document.getElementsByTagName("section")[0].children;

    for (const each of biglist){
      if (each.tagName == "button") {continue}; // ignore 'load more' button lol. it's not a day
      var list = each.children;

      for (var i = 1; i < list.length; i++){

        // split each notif into vars
        const cur = list[i];
        var info = cur.children[0].children[2].children[0].innerText;
        var person = info.split(" ")[0]
        var action = info.substr(info.indexOf(" ") + 1);

        if (action == "liked your post" || action == "shared your post") {
          var content = cur.children[0].children[2].children[1].innerHTML;

          // save the content into notifs[]
          if (!notifs[content]){
            notifs[content] = {
              "liked": [],
              "shared": []
            }
          }
          if (action == "liked your post"){ notifs[content]["liked"].push(person); }
          if (action == "shared your post"){ notifs[content]["shared"].push(person); }
        }

        // save follows into separate array
        if (action == "followed you") { follows.push(person);}
      }
    }





    // console.log(follows)

    // now we have the data. format them into the sidebar

    // follows first
    var follow_text = ""
    if (follows.length > 0){
      follow_text = '<div class="bn-notif bn-item"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" class="h-6 w-6 flex-none"><path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"></path></svg><div class="bn-notif-text">'
      for (person of follows){
        if (person == follows[0]) {
          follow_text += '<a class="font-bold hover:underline" href="' + personlink(person) + '">' + person + '</a>';
        } else {
          follow_text += ', <a class="font-bold hover:underline" href="' + personlink(person) + '">' + person + '</a>';
        }
      }
      follow_text += " followed you </div></div>"
    }

    // the rest of the notifications
    var injecttext = ""
    for (const [key, value] of Object.entries(notifs)) {
      var liked = value["liked"]
      var shared = value["shared"]

      var liked_text = ''

      // format liked
      for (const person of liked) {
        if (person == liked[0]) {
          liked_text += '<a <a class="font-bold hover:underline" href="' + personlink(person) + '">' + person + '</a>';
        } else {
          liked_text += ', <a <a class="font-bold hover:underline" href="' + personlink(person) + '">' + person + '</a>';
        }
      }

      if (liked.length > 0) {
        liked_text += ' liked your post <div class="bn-text">“' + key + '”</div>';
        injecttext += '<div class="bn-notif bn-item"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" class="h-6 w-6 flex-none"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path></svg><div class="bn-notif-text">' + liked_text + '</div> </div>'
      }


      // format shared
      var shared_text = ""

      for (const person of shared) {
        if (person == shared[0]) {
          shared_text += '<a <a class="font-bold hover:underline" href="' + personlink(person) + '">' + person + '</a>';
        } else {
          shared_text += ', <a <a class="font-bold hover:underline" href="' + personlink(person) + '">' + person + '</a>';
        }
      }

      if (shared.length > 0) {
        shared_text += ' shared your post <div class="bn-text">“' + key + '”</div>'
        injecttext += '<div class="bn-notif bn-item"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" class="h-6 w-6 flex-none"><path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"></path></svg><div class="bn-notif-text">' + shared_text + '</div></div>'
      }

    }

    // add it all together
    sidebar.innerHTML = '<div class="bn-date-box"><div class="bn-date bn-item"><button id="bn-reload">reload</button><span>cohost better notifications</span></div>' + follow_text + injecttext + "</div> <style>.cursor-pointer.flex-col.bg-white.p-3.text-notBlack:not(:has(p)) {display: none;}</style>"


    // insert into page
    grid.insertBefore(sidebar, grid.children[0])

    reloadbutton = document.getElementById("bn-reload")
    reloadbutton.onclick = dothings
  }

  });

}

// do the thing *slightly* later than page load, because the notifs wouldn't have loaded yet
setTimeout(dothings(), 100);
