(function() {
  let lastTime = 0;
  let vendors = ['ms', 'moz', 'webkit', 'o'];
  for(let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelRequestAnimationFrame = window[vendors[x]+
      'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function(callback, element) {
      let currTime = new Date().getTime();
      let timeToCall = Math.max(0, 16 - (currTime - lastTime));
      let id = window.setTimeout(function() { callback(currTime + timeToCall); },
        timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };

  if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
}())

let layers = [],
  objects = [],

  world = document.getElementById( 'world' ),
  viewport = document.getElementById( 'viewport' ),

  d = 0,
  p = 400,
  worldXAngle = 0,
  worldYAngle = 0;

viewport.style.webkitPerspective = p;
viewport.style.MozPerspective = p;
viewport.style.oPerspective = p;

generate();

function createCloud() {

  let div = document.createElement( 'div'  );
  div.className = 'cloudBase';
  let x = 256 - ( Math.random() * 512 );
  let y = 256 - ( Math.random() * 512 );
  let z = 256 - ( Math.random() * 512 );
  let t = 'translateX( ' + x + 'px ) translateY( ' + y + 'px ) translateZ( ' + z + 'px )';
  div.style.webkitTransform = t;
  div.style.MozTransform = t;
  div.style.oTransform = t;
  world.appendChild( div );

  for( let j = 0; j < 5 + Math.round( Math.random() * 15 ); j++ ) {
    let cloud = document.createElement( 'img' );
    cloud.style.opacity = 0;
    let r = Math.random();
    let src = '../images/cloud.png';
    ( function( img ) { img.addEventListener( 'load', function() {
      img.style.opacity = .7;
    } ) } )( cloud );
    cloud.setAttribute( 'src', src );
    cloud.className = 'cloudLayer';

    let x = 256 - ( Math.random() * 512 );
    let y = 256 - ( Math.random() * 512 );
    let z = 100 - ( Math.random() * 200 );
    let a = Math.random() * 360;
    let s = .25 + Math.random();
    x *= .2; y *= .2;
    cloud.data = {
      x,
      y,
      z,
      a,
      s,
      speed: .05 * Math.random()
    };
    let t = 'translateX( ' + x + 'px ) translateY( ' + y + 'px ) translateZ( ' + z + 'px ) rotateZ( ' + a + 'deg ) scale( ' + s + ' )';
    cloud.style.webkitTransform = t;
    cloud.style.MozTransform = t;
    cloud.style.oTransform = t;

    div.appendChild( cloud );
    layers.push( cloud );
  }

  return div;
}

window.addEventListener( 'mousewheel', onContainerMouseWheel );
window.addEventListener( 'DOMMouseScroll', onContainerMouseWheel );
window.addEventListener( 'mousemove', onMouseMove );
window.addEventListener( 'touchmove', onMouseMove );

function onMouseMove ( e ) {

  let x = e.clientX || e.touches[ 0 ].clientX;
  let y = e.clientY || e.touches[ 0 ].clientY;

  worldYAngle = -( .5 - ( x / window.innerWidth ) ) * 180;
  worldXAngle = ( .5 - ( y / window.innerHeight ) ) * 180;
  updateView();
  event.preventDefault();

}

function onContainerMouseWheel( event ) {

  event = event ? event : window.event;
  d = d - ( event.detail ? event.detail * -5 : event.wheelDelta / 8 );
  updateView();
  event.preventDefault();

}

function generate() {

  objects = [];

  if ( world.hasChildNodes() ) {
    while ( world.childNodes.length >= 1 ) {
      world.removeChild( world.firstChild );
    }
  }

  for( let j = 0; j < 5; j++ ) {
    objects.push( createCloud() );
  }

}

function updateView() {
  let t = 'translateZ( ' + d + 'px ) rotateX( ' + worldXAngle + 'deg) rotateY( ' + worldYAngle + 'deg)';
  world.style.webkitTransform = t;
  world.style.MozTransform = t;
  world.style.oTransform = t;
}

function update (){

  for( let j = 0; j < layers.length; j++ ) {
    let layer = layers[ j ];
    layer.data.a += layer.data.speed;
    let t = 'translateX( ' + layer.data.x + 'px ) translateY( ' + layer.data.y + 'px ) translateZ( ' + layer.data.z + 'px ) rotateY( ' + ( - worldYAngle ) + 'deg ) rotateX( ' + ( - worldXAngle ) + 'deg ) rotateZ( ' + layer.data.a + 'deg ) scale( ' + layer.data.s + ')';
    layer.style.webkitTransform = t;
    layer.style.MozTransform = t;
    layer.style.oTransform = t;
  }

  requestAnimationFrame( update );

}

update();
