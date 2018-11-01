function ajax_get(url, callback) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      console.log('responseText: ');
      try {
        var data = JSON.parse(xmlhttp.responseText);
      } catch(err) {
        console.log(err.message + " in " + xmlhttp.responseText);
        return err.message;
      }
      callback(data);
    }
  };
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

//to read redirect URLs
let urlResponse = 'none';

function readUrl(url, callback=console.log) {
  let xhrUnsplash = new XMLHttpRequest();
  xhrUnsplash.onreadystatechange = function() {
    if (xhrUnsplash.readyState == 4 && xhrUnsplash.status == 200) {
      try {
        urlResponse = xhrUnsplash.responseURL;
        //console.log(urlResponse);
      } catch(err) {
        console.log(err.message + " in " + xhrUnsplash.responseText);
        return;
      }
      callback(xhrUnsplash.responseURL);
    };
  };
  xhrUnsplash.open('GET', url, true);
  xhrUnsplash.send(null);
}

function promiseUrl(url) {
  return new Promise((resolve, reject) => {
    readUrl(url, u => resolve(u));
  })
}

//unsplash stuff

const owlItems = document.querySelectorAll(".item");
const catPics = document.querySelectorAll(".cat-img")

//gotta get dev credentials to force new images there
let unsplashRnd = function() {
  return 'https://source.unsplash.com/random/'+Math.floor((Math.random()*5)+298)+'x'+Math.floor((Math.random()*5)+198);
}

//randomizes my 3 pics
async function setCatImageUrl(pics=catPics) {
  for await (pic of pics) {
    pic.setAttribute("src", await promiseUrl(unsplashRnd()));
    // console.log(pic.getAttribute("src"));
  }
}

//randomizes target picture
async function setImgUrl(img) {
  img.setAttribute("src", await promiseUrl(unsplashRnd()));
  // console.log(img.getAttribute("src"));
}

function updateResponsive() {
  //// TODO: idk
}
// window.addEventListener("resize", updateResponsive);

//scrollmagic anims

let scrollCtrl = new ScrollMagic.Controller();

let sidebar3d = new ScrollMagic.Scene({
  duration: 500,
  triggerElement: "#topSeparator",
  offset: -50,
  triggerHook: "onLeave",
  reverse: true,
  tweenChanges: true
})
.setTween('.sidebar-background', {transform: "translateX(-10px) rotateX(-1deg) rotateY(-15deg) rotateZ(0.5deg)"})
// .addIndicators({name: "1 (duration 500)"})
.addTo(scrollCtrl);

let iTimeline = new TimelineMax();
let itween1 = TweenMax.to("#i1", 1, {transform: "translateX(10px) rotateY( 15deg ) scale(0.95)"});
let itween2 = TweenMax.to("#i2", 1, {transform: "scale(0.95)"});
let itween3 = TweenMax.to("#i3", 1, {transform: "translateX(-10px) rotateY( -15deg ) scale(0.95)"});
iTimeline.add(itween1, 0);
iTimeline.add(itween2, 0);
iTimeline.add(itween3, 0);
// items3d.setTween(iTimeline);

let items3d = new ScrollMagic.Scene({
  duration: 400,
  triggerElement: ".features",
  offset: -100,
  triggerHook: "onCenter",
  reverse: true,
  tweenChanges: true
})
// .addIndicators({name: "2 (duration 400)"})
.addTo(scrollCtrl);

// let sTimeline = new TimelineMax();
// let stween2 = TweenMax.from(".sidebar-background", 2, {className: "+=sidebar-pulse-1"});
// sTimeline.add(stween2);

// $(document).ready(items3d.setTween(iTimeline));

//switch to other page
function swapPage(n, anim=true) {
  let pages = document.querySelectorAll('.showcase')
  for (page of pages) {
    if (page.id == `page${n}`) {
      page.style.opacity = "";
      page.style.height = "";
      page.style.position = "";
      page.style.left = "";
    }
    else {
      page.style.opacity = "0";
      page.style.height = "0";
      page.style.position = "absolute";
      page.style.left = "-9999px";
    }
  }
  let links = document.querySelectorAll('.menu-wrapper li')
  for (link of links) {
    if (link.classList.contains(`link-p${n}`)) {
      link.classList.add('current')
    }
    else {
      link.classList.remove('current')
    }
  }
  if (anim) {
    // let ta = new TimelineMax()
    // let t1 = TweenMax.from(".sidebar-background", 1, {boxShadow: "inset 0 0 20px 60px rgba(255, 100, 0, 1)", immediateRender: false})
    // let t2 = TweenMax.from(".sidebar-background", 2, {boxShadow: "inset 0 0 20px 60px rgba(255, 50, 0, 1)", immediateRender: false})
    // ta.add(t1, 0)
    // ta.add(t2, 1)
    //doesn't work yet
    let t1 = TweenMax.from(".sidebar-background", 1, {boxShadow: "inset 0 0 20px 60px rgba(255, 50, 0, 1)", immediateRender: true, onComplete:clearAnim})
  }
  function clearAnim() {
    TweenLite.set(".sidebar-background", {boxShadow:"none"})
  }
}

$(document).ready(swapPage(1, false));
$(document).ready(setCatImageUrl());
window.onload = items3d.setTween(iTimeline);
