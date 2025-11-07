


const latestSectionScrollTop = () => {
  let rightCol = document.getElementById("right-col");
  if(rightCol){

  var stickyHeight = rightCol?.offsetHeight;
  var viewportHeight = window.innerHeight;
  var headerHeight = document.querySelector(".gh-header").offsetHeight;
  viewportHeight = viewportHeight - headerHeight;
  var stop = window.innerHeight - stickyHeight;
  // var top = Math.abs(stop)

  if (stickyHeight > viewportHeight) {
      document.getElementById("right-col").style.top = stop + "px";
  } else {
      stop = headerHeight;
      document.getElementById("right-col").style.top = stop + "px";
  }
}
}

try{
const slides = document.querySelector('.slides');
var slideWidth = 200
let currentSlide = 0;
function goToSlide(index) {
  currentSlide = index;
  let scrollValue = slideWidth * currentSlide;
  let totalWidth = slides?.children.length * slideWidth;
  // Reset to the first slide if currentSlide exceeds the total number of slides
  if (scrollValue >= totalWidth) {
    currentSlide = 0;
    scrollValue = 0;
    document.querySelector('.prev').style.display ='none'

  }

  slides?.scrollTo({
    left: scrollValue,
    behavior: 'smooth'
  });}
document.querySelector('.prev').addEventListener('click', () => {
  if (currentSlide > 0) {
    goToSlide(currentSlide-1);
  }
  else{
    document.querySelector('.prev').style.display ='none'
  }
});

document.querySelector('.next').addEventListener('click', () => {
  document.querySelector('.prev').style.display ='block'
    goToSlide(currentSlide +1);
  
});
}catch(err){
}
export { latestSectionScrollTop  };
 

