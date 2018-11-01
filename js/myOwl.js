//owl stuff

// if (document.readyState == 'loading') {
//   document.addEventListener('DOMContentLoaded', loadOwls);
//   console.log('loading owls later');
// } else {
//   loadOwls();
//   console.log('loading owls now');
// }

document.addEventListener("DOMContentLoaded", function(){
  loadOwls();
});

// window.onload = loadOwls();

function loadOwls() {
  $('#owl_2').owlCarousel( {
    lazyLoad: true,
    lazyLoadEager: 1,
    loop: true,
    rtl: true,
    URLhashListener: false,
    margin: 5,
    items: 4,
    dots: false,
    autoWidth: true,
    autoHeight: false,
    dragEndSpeed: 0.5,
    linked: "#owl_1"
  } );
  $('#owl_1').owlCarousel( {
    lazyLoad: true,
    lazyLoadEager: 1,
    loop: true,
    URLhashListener: false,
    margin: 5,
    items: 4,
    dots: false,
    autoWidth: true,
    autoHeight: false,
    dragEndSpeed: 0.5,
    linked: "#owl_2"
  });
};

//need to reinit on bigger screen?
// var owlOne = $('#owl_1');
// Listen to owl events:
// owlOne.on('dragged.owl.carousel', function(event) {
//   // get owl instance from element
// let owlInstance = owlOne.data('owlCarousel');
// // if instance is existing
// if(owlInstance != null)
//     owlInstance.reinit();
// });
