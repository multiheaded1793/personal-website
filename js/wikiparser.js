// ---- Wiki articles
let wikiTarget = ''; //plaintext
let searchInput = '';
const pageRequestOptions = 'action=parse&format=json&origin=*&prop=text|headhtml&wrapoutputclass=mw-text-wrapper&pst=1&disablelimitreport=1&disableeditsection=1&disabletoc=1&mobileformat=1&contentformat=application%2Fjson&contentmodel=json&redirects';
let wiki_url = '';
let wikiCatPlain = '';
let wikiEncode = function(e) {return encodeURIComponent(e);}
let stylesheetElem = '';
let catPageSet = new Set();
let subcatSet = new Set();
let maxSubcats = 1000;

//the basics

//set wikipedia API url according to given plaintext title
function setWikiPageUrl() {
  wiki_url = 'https://en.m.wikipedia.org/w/api.php?';
  wiki_url += pageRequestOptions;
  wiki_url += '&page='+wikiEncode(wikiTarget);
  wiki_url += document.getElementById('checkIntroOnly').checked ? '&section=0' : '';
  console.log('url set to:' + wiki_url)
}

async function getArticle (url) {
  let promiseStyle = (data) => new Promise((resolve, reject) => {
    let headInfo = (new DOMParser()).parseFromString(data.parse.headhtml["*"], 'text/html') ;
    stylesheetElem = headInfo.querySelectorAll('link[rel="stylesheet"]');
    for (style of stylesheetElem) { console.log('WSTYLE: https://en.m.wikipedia.org'+style.href) }
    let phpStyleRequest = "https://en.m.wikipedia.org/w/load.php?debug=yes&lang=en&modules=ext.cite.styles%7Cmediawiki.hlist%7Cmediawiki.ui.button%2Cicon%7Cskins.minerva.base.reset%2Cstyles%7Cskins.minerva.content.styles%7Cskins.minerva.content.styles.images%7Cskins.minerva.icons.images%7Cskins.minerva.tablet.styles&only=styles&skin=minerva";
    ripStyle(phpStyleRequest);
    resolve(data);
  });
  let insertContent = (data) =>  new Promise((resolve, reject) => {
    let rawContent = data.parse.text["*"];
    let amended = amendAll(rawContent);
    document.querySelector(".mw-content-text").innerHTML = amended;
    document.getElementById("control-target-name").innerHTML = data.parse.title;
    // document.querySelectorAll(".wiki-content-area").classList.add("wiki-content-loaded");
    $(".mw-text-wrapper").mCustomScrollbar({
      live: true,
      theme: "minimal-dark",
      callbacks:{
        onUpdate:function(){
          if (window.innerWidth < 559) {
            $(".mw-text-wrapper").mCustomScrollbar("disable");
          }
        }
      }
    });
    console.log("loading scrollbar");
    resolve();
  });
  return await ajax_get(url).then(data => {
    promiseStyle(data).then(insertContent(data)).then(document.querySelector(".wiki-content-area").classList.add("wiki-content-loaded"));
  });
}

let catPageArray = [];
let subcatArray = [];
let cat_tree = {};
cat_tree[0] = {};
cat_tree[0].title = wikiEncode(wikiCatPlain);
cat_tree[0].subcat = [];

function resetTrees() {
  catPageArray = [];
  catPageSet.clear();
  subcatArray = [];
  subcatSet.clear();
  cat_tree = {};
  cat_tree[0] = {};
  cat_tree[0].title = wikiEncode(wikiCatPlain);
  console.log("search root: " + cat_tree[0].title);
  cat_tree[0].subcat = [];
}

//simulate a delay
const wait = (ms, log=true) => new Promise((resolve) => setTimeout(() => {
  if (log) { console.log("waited for " + ms) };
  resolve();
}, ms));

//category parser and randomizer
//todo: only send a combined request for pages and categories!!! why did I even separate them?!
//todo: stagger big parallel loads

let recursiveCatList = async function (currentCat, cont='', depth=0) {
  const maxDepth = document.getElementById('recursionDepth').value;
  if (!currentCat.subcat) {
    currentCat.subcat = [];
  };
  let promiseCat = async function (currCat=currentCat, offset=cont) {
    document.getElementById('loadingS').innerHTML++;
    let cat_url = 'https://en.wikipedia.org/w/api.php?';
    cat_url += 'action=query&list=categorymembers&cmtype=subcat&format=json&origin=*';
    cat_url += '&cmtitle='+currCat.title;
    console.log("cat title "+currCat.title);
    cat_url += '&cmcontinue='+offset;
    return await ajax_get(cat_url).then(data => {
      console.log(data.query);
      try {
        offset = data.continue ? data.continue.cmcontinue : '';
        for (member of data.query.categorymembers) {
          if (!subcatSet.has(member.title)) {
            subcatArray.push(member);
            currCat.subcat.push(member);
            subcatSet.add(member.title);
          }
        }
        document.getElementById('loadingS').innerHTML--;
        return(offset)
      }
      catch(err) { //will improve on this
        console.log("subcat list error" + err);
        document.getElementById('loadingS').innerHTML--;
        return('')
      }
    })
  };
  // await wait(10, false);
  //I have to stagger the requests somehow
  await promiseCat().then(await async function(offset) {if (offset!=='') {
    console.log('scrolling through cat, string '+offset);
    recursiveCatList(currentCat, offset);
  }}).then(await getPagesInCat(currentCat)).then(await async function() {
    document.getElementById('subcatsLoaded').innerHTML = subcatArray.length;
    if (currentCat.subcat.length > 0 && subcatArray.length < maxSubcats && depth < maxDepth) {
      // mapping array to run in parallel if it's not too much at once - otherwise use for...of
      if (currentCat.subcat.length < 20) {
        const promisesDown = currentCat.subcat.map(sub => recursiveCatList(sub,'',depth+1));
        await Promise.all(promisesDown);
        console.log("parallel, d"+(depth+1));
      }
      else {
        for (sub of currentCat.subcat) {
          await wait(20, false);
          await recursiveCatList(sub,'',depth+1);
          console.log("serial, d"+(depth+1));
        }
      }
    }
    else {
      console.log("END CAT")
    }
  })
  //will figure out return statement later
};


//TODO: only use sets

let getPagesInCat = async function (currentCat, cont='') {
  let promisePage = async function (currCat=currentCat, offset=cont) {
    document.getElementById('loadingT').innerHTML++;
    let cat_url = 'https://en.wikipedia.org/w/api.php?';
    cat_url += 'action=query&list=categorymembers&cmtype=page&format=json&origin=*';
    cat_url += '&cmtitle='+currentCat.title;
    cat_url += '&cmcontinue='+offset;
    return await ajax_get(cat_url).then((data) => {
      try {
        for (member of data.query.categorymembers) {
          if (!member.title.includes('List of'||'Template'||'Portal:') && !catPageSet.has(member.title)) {
            catPageArray.push(member.title);
            catPageSet.add(member.title);
          }
        };
        offset = data.continue ? data.continue.cmcontinue : '';
        document.getElementById('loadingT').innerHTML--;
        return(offset)
      }
      catch(err) {
        document.getElementById('loadingT').innerHTML--;
        console.log("page list error" + err)
        return('')
      }
    })
  };

  // await wait(75);
  await promisePage().then(async function(ofst) {
    document.getElementById('titlesLoaded').innerHTML = catPageArray.length;
    if (ofst!=='') {
      await getPagesInCat(currentCat, ofst);
      console.log("loading more titles in " + currentCat.title);
    }
    else {
      //return statement?
    }
  })
};


//user interface

//look up specified page
function pageButton() {
  TweenMax.from("#wikiWidget", 0.6, {boxShadow: "inset 0 0 20px 60px rgba(255, 135, 0, 0.8)"})
  let titleInput = document.getElementById('pageSearchField');
  wikiTarget = titleInput.value;
  setWikiPageUrl();
  getArticle(wiki_url);
}
document.getElementById('searchButton').addEventListener('click', pageButton, false);

//preload, then choose at random
async function randomButton() {
  if (catPageArray.length > 0) {
    randomInCat();
  }
  else {
    let catInput = document.getElementById('catSearchField');
    wikiCatPlain = "Category:"+catInput.value;
    resetTrees();
    await recursiveCatList(cat_tree[0]);
    randomInCat();
  }
}

//preload only
async function preloadButton() {
  TweenMax.from("#wikiWidget", 0.4, {boxShadow: "inset 0 0 20px 60px rgba(255, 85, 0, 0.8)"})
  document.getElementById('debugRandomPick').disabled = true;
  document.getElementById('loadingS').innerHTML='';
  document.getElementById('loadingT').innerHTML='';
  let catInput = document.getElementById('catSearchField');
  wikiCatPlain = "Category:"+catInput.value;
  resetTrees();
  try {
    await recursiveCatList(cat_tree[0])
    console.log("all done");
  }
  catch(err) {
    console.log("preloader error "+err)
  }
  finally {
    document.getElementById('debugRandomPick').disabled = false;
  }
}
document.getElementById('debugPreloadCat').addEventListener('click', preloadButton, false);

//random from the preloaded list above
function randomInCat() {
  let randomPageTitle = catPageArray[Math.floor(Math.random()*catPageArray.length)];
  wikiTarget = randomPageTitle;
  console.log(wikiTarget);
  setWikiPageUrl();
  getArticle(wiki_url);
}

document.getElementById('debugRandomPick').addEventListener('click', randomInCat, false);

//rips style from target php, then wraps it to only be used in the wiki content pane
function ripStyle(phpStyleRequest) {
  $.get(phpStyleRequest, function(data, status) {
    console.log("Dynamic style: yes\nStatus: " + status);
  }, "text").then(data => document.querySelector('.dynamicStyle').innerHTML = wrapStyle(data));
}

function wrapStyle(style) {
  if (!style.split("{")[0].includes("@")) {
    style = ".mw-text-wrapper " + style;
  }
  style = style.replace(/\}\s*(?=\S)(?!@)(?!\})/gm, "\}\n\n.mw-text-wrapper ");
  style = style.replace(/[\{](\s*)(?=.+\{)/g, "\{\n\t.mw-text-wrapper ");
  style = style.replace(/,\s*/gm, ",\n.mw-text-wrapper ");
  style = style.replace(new RegExp(escapeRegExp("url(\/w"), "gm"), "url(https:\/\/en.m.wikipedia.org\/w");
  return style
}

//amends html of a wiki article
function amendAll(str) {
  str = str.replace(new RegExp(escapeRegExp("src=\""), "gm"), "src=\"https:");
  str = str.replace(new RegExp(escapeRegExp("href=\""), "gm"), "href=\"https:");
  str = str.replace(new RegExp(escapeRegExp("https:\/wiki"), "gm"), "https:\/\/en.wikipedia.org\/wiki");
  str = str.replace(new RegExp(escapeRegExp("url(\/w"), "gm"), "url(https:\/\/en.wikipedia.org\/w");
  str = str.replace(new RegExp(escapeRegExp("srcset=\""), "gm"), "srcset=\"https:");
  str = str.replace(new RegExp(escapeRegExp(", \/\/upload"), "gm"), ", https:\/\/upload");
  return str;
}

const wikiHTML = document.querySelector(".mw-content-text");


//todo: featured of the day - generate month and year randomly, split month's page by <hr> to get ready sections?

//load style CSS via REST -- not now

//END
