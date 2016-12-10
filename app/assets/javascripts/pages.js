var fadeOut = function ( el ) {
  el.style.opacity = 1;

  ( function fade() {
    if ( ( el.style.opacity -= .1 ) < 0 ) {
      el.style.display = "none";
    } else {
      setTimeout(function(){
        requestAnimationFrame( fade )
      }, 100);
    }
  })();
};

document.addEventListener("turbolinks:load", function() {
  var doc = document,
      alert = doc.querySelector('.alert');
    
    setTimeout(function() {
         fadeOut( alert );
    }, 1000)
   
});