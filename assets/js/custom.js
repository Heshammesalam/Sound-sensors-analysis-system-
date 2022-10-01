$(document).ready(function () {
    ////loader
    var width = 100,
    perfData = window.performance.timing, // The PerformanceTiming interface represents timing-related performance information for the given page.
    EstimatedTime = -(perfData.loadEventEnd - perfData.navigationStart),
    time = parseInt((EstimatedTime/1000)%60)*100;

// Loadbar Animation
$(".loadbar").animate({
  width: width + "%"
}, time);

// Loadbar Glow Animation
$(".glow").animate({
  width: width + "%"
}, time);

// Percentage Increment Animation
var PercentageID = $("#precent"),
    start = 0,
    end = 100,
    durataion = time;
    animateValue(PercentageID, start, end, durataion);
    
function animateValue(id, start, end, duration) {
  
  var range = end - start,
      current = start,
      increment = end > start? 1 : -1,
      stepTime = Math.abs(Math.floor(duration / range)),
      obj = $(id);
    
  var timer = setInterval(function() {
    current += increment;
    $(obj).text(current + "%");
      //obj.innerHTML = current;
    if (current == end) {
      clearInterval(timer);
    }
  }, stepTime);
}

// Fading Out Loadbar on Finised
setTimeout(function(){
  $('.preloader-wrap').fadeOut(300);
}, time);

///show password
let showPass = document.getElementById("show-pass");
let form = document.querySelectorAll("input");
let sub = document.getElementById("submit");

// if value are empty stop sending 

sub.addEventListener("click", function(e){
    if(form[0].value === "" || form[1].value === ""){
        e.preventDefault();
    }
});

/// toggle password 

showPass.addEventListener("click",function(){
    if(this.classList[1] === "fa-eye-slash"){
        this.classList.remove("fa-eye-slash");
        this.classList.add("fa-eye");
        form[1].type = "text";
    }else{
        this.classList.remove("fa-eye");
        this.classList.add("fa-eye-slash");
        form[1].type = "password";
    }
})

//setting-menu
(function() {
  // Bind Click event to the drop down navigation button
  document.querySelector('.nav-button').addEventListener('click', function() {
    /*  Toggle the CSS closed class which reduces the height of the UL thus 
        hiding all LI apart from the first */
    this.parentNode.parentNode.classList.toggle('closed')
  }, false);
})();


});