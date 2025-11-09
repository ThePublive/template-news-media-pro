var elem = document.getElementById('main.js');
var link_color = elem.getAttribute('link_color')
var web_story_logo = elem.getAttribute('web_story_logo');
var gallery_logo = elem.getAttribute('gallery_logo');
var enable_native_legacy_var = elem.getAttribute('enable_native_legacy_ui')
var is_paywall_enabled_var = elem.getAttribute('paywall_is_enabled')
let main_actual_domain = elem.getAttribute('actual_domain')
var is_paywall_enabled = (is_paywall_enabled_var == '1' || is_paywall_enabled_var=='True') ? true : false
var enable_native_legacy_ui = (enable_native_legacy_var == '1' || enable_native_legacy_var=='True') ? true : false

function get_video_icon() {
  return `<svg xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink" width="100%" height="100%"
            viewBox="0 0 71.393 71.393" style="margin: auto;">
            <defs>
                <filter id="Path_12" x="0" y="0" width="71.393" height="71.393"
                        filterUnits="userSpaceOnUse">
                    <feGaussianBlur stdDeviation="1" result="blur"/>
                    <feFlood flood-opacity="0.161"/>
                    <feComposite operator="in" in2="blur"/>
                    <feComposite in="SourceGraphic"/>
                </filter>
                <filter id="Path_13" x="21.557" y="14.418" width="40.418"
                        height="46.557" filterUnits="userSpaceOnUse">
                    <feGaussianBlur stdDeviation="3" result="blur-2"/>
                    <feFlood flood-opacity="0.161"/>
                    <feComposite operator="in" in2="blur-2"/>
                    <feComposite in="SourceGraphic"/>
                </filter>
            </defs>
            <g id="Icon_feather-play-circle" data-name="Icon feather-play-circle"
            transform="translate(8 4)">
                <g transform="matrix(1, 0, 0, 1, -8, -4)" filter="url(#Path_12)">
                    <path id="Path_12-2" data-name="Path 12"
                        d="M64.393,33.7A30.7,30.7,0,1,1,33.7,3,30.7,30.7,0,0,1,64.393,33.7Z"
                        transform="translate(5 1)" fill="none" stroke="#fff"
                        stroke-linecap="round" stroke-linejoin="round"
                        stroke-width="4"/>
                </g>
                <g transform="matrix(1, 0, 0, 1, -8, -4)" filter="url(#Path_13)">
                    <path id="Path_13-2" data-name="Path 13"
                        d="M15,12,33.418,24.279,15,36.557Z"
                        transform="translate(17.56 10.42)" fill="none" stroke="#fff"
                        stroke-linecap="round" stroke-linejoin="round"
                        stroke-width="4"/>
                </g>
            </g>
        </svg>`
} 

function setCookie(name, value, days) {
  // Create a date object
  const date = new Date();
  
  // Set the expiration date by adding the specified number of days
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  
  // Format the date to UTC string for the cookie expiration
  const expires = "expires=" + date.toUTCString();
  
  // Set the cookie with name, value, and expiration date
  document.cookie = name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/";
}

function get_live_icon(items){
  try{
    return `
    <div class="live-blog-icon ${items.live_block_cssclass}">
      <span >
          LIVE
      </span>
    </div>
    `
  }catch(err){
    console.log('live log',err)
    return ``
  }
}

latest_articles_template = (items)=>{
  return `
        <a href="${ items.absolute_url }" aria-label="${ items.title }" style="color:black;">
          <div class="latest-news">
            <div class="l-cover  ${enable_native_legacy_ui ? '' : 'aspect-ratio'}" loading="lazy">
              <span class="featured-icon right-side-logo ${items.video_block_cssclass}">
                ${get_video_icon()}
              </span>
              <span class="featured-icon right-side-logo ${items.gallery_block_cssclass}">
                <img alt="logo" src="${gallery_logo}">
              </span>
              <span class="featured-icon right-side-logo ${items.web_story_block_cssclass}">
                <img class="featured-icon-img" alt="web-stroy-logo" src="${web_story_logo}">
              </span>
              ${get_live_icon(items)}
              <img layout="responsive" class="image  aspect-ratio cover ${enable_native_legacy_ui ? '' : 'aspect-ratio'}" width="134" height="80" src="${items.banner_url }" style="object-fit:cover; ${get_image_style_from_meta_data(items?.media_file_banner)}" alt="${ items?.media_file_banner?.alt_text ?? items.title }" >
            </div>
            <p class="desc">${ items.title }</p>
          </div>
        </a>

`
}

latest_articles = (post_key)=>{
  $.ajax({
    method:'get',
    url:`https://${main_actual_domain}/get_right_posts`,
    dataType: 'json',
    success: function(res){
      var post_items = res.items
      var counter = 0
      var latest_articles = ""
      for(let i = 0 ; i < post_items.length ;i++){

      
        if(post_key == post_items[i].id){
          continue
        }
        
        latest_articles += latest_articles_template(post_items[i])
        counter += 1
        if(counter > 2){
          break
        }
      }
      if (document.getElementById('latest_stories')) document.getElementById('latest_stories').innerHTML += latest_articles;
    }
  })
}

// change font color(black/white) on the basis of BG color
contrast_color=(color,classname)=>{
    
  color = color.split("#")[1] || color;
  var rgb = []
  for(let i=0; i<color.length;i+=2){
    rgb.push(parseInt(color[i] + color[i+1], 16));
  }

    var c = 'rgb('+rgb[0]+','+rgb[1]+','+rgb[2]+')';
    
    var o = Math.round(((parseInt(rgb[0]) * 299) + (parseInt(rgb[1]) * 587) + (parseInt(rgb[2]) * 114)) /1000);
    
    if(o > 125) {
        $('.'+classname).css('color', 'black');
    }else{ 
        $('.'+classname).css('color', 'white');
    }
}
latest_ticker = (post_key)=>{
  $.ajax({
    method:'get',
    url:`https://${main_actual_domain}/get_right_posts`,
    dataType: 'json',
    success: function(res){
      
      var post_items = res.items
      if(post_items.length > 0){
        for(let i = 0 ; i < post_items.length ; i++){
          if(post_key == post_items[i].id){
            continue
          }
        var ticker_item = ""

        ticker_item += `<a href="${post_items[i].legacy_url}" aria-label="${post_items[i].title}"><div class="ticker__item">${post_items[i].title}</div></a>`
                          
       
      $('#latestnews_ticker').append(ticker_item)
        }
      }
    }
  })
  }
$(document).ready(function() {
    $(window).scroll(function () {
        var stickyHeight = $('#right-col').height();
        var viewportHeight = $(window).height();
        var headerHeight = $('.header-class ').height();
        viewportHeight = viewportHeight - headerHeight;
        var stop =  $(window).height()- stickyHeight ;
        // var top = Math.abs(stop)
    if( stickyHeight > viewportHeight  ){
          $("#right-col").css("top", stop+'px')
    }
    else{
      stop = headerHeight 
      $("#right-col").css("top", stop+'px')
    }
      });
      contrast_color(link_color,'breaking_label')

      static_page_links()
      $("#news_letter_body").click(function(){
        window.location = "/"
      })
})

function SidebarToggle(){
  var sidebar_open = false
  $(".sidebar-button").click(function(){
    if(sidebar_open){
      $("#mySidenav").css("transform","translateX(-100%)")
      $('body').css("overflow","auto")
      sidebar_open = false
    }
    else{
      sidebar_open = true
      $("#mySidenav").css("transform","translateX(0%)")
      $('body').css("overflow","hidden")
      $("#sidebar-close").css("transform","translateX(0%)")
      $("#sidebar-cross").css("transform","rotate(270deg)")

    }
   
  }) 
}
$(document).ready(function (){
  SidebarToggle(".sidebar-button","#mySidenav")


  $('.dropdown_button').click(function(){
    if($(this).find(".dropdown_menu").css("display")=='block'){
      $(this).find('.menu_bar-dropdown-icon').css({"transform":"rotate(-90deg)" ,"transition" :"all 0.2s ease-in-out"})
      $(this).find(".dropdown_menu").css("display","none")
    }
   else{
    $('.dropdown_menu').css("display","none")
    $('.menu_bar-dropdown-icon').css({"transform":"rotate(-90deg)" ,"transition" :"all 0.2s ease-in-out"})
    $(this).find('.menu_bar-dropdown-icon').css({"transform":"rotate(0deg)" ,"transition" :"all 0.2s ease-in-out"})
    $(this).find(".dropdown_menu").css("display","block")
   }})
})
function handleFormSubmitCommon(formId, buttonClass,messageClass) {
  document.querySelector(buttonClass).addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default form submission
    var form = document.querySelector(formId);
    var formData = new FormData(form);

    // Remove any existing occurrences of the key "group_ids"
    formData.delete('group_ids');

    // Select all input elements with the name "group_ids"
    var groupIdsInputs = form.querySelectorAll('input[name="group_ids"]:checked');

    // Create an array to store the values
    var groupIdsArray = [];

    // Iterate over each input element and push its value to the array
    groupIdsInputs.forEach(function(input) {
        groupIdsArray.push(input.value);
    });

    // Convert the array to a comma-separated string
    var groupIdsString = groupIdsArray.join(',');

    // Append the comma-separated string to the formData
    formData.append('group_ids', groupIdsString);
    fetch('/amp_subscribe_to_newsletter', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      var messageElement = document.querySelector(`${messageClass} p`);
      messageElement.textContent = data.message;
      form.reset();
    })
    .catch(error => {
      console.error('Error:', error);
    });
  });
}

static_page_links =()=>{
  $.ajax({
  method:'get',
  url:`https://${main_actual_domain}/get_static_pages`,
  dataType: 'json',
  success: function(res){
    var static_pages = res.items.static_pages
    if(static_pages){
      for(let i=0; i<static_pages.length ; i++){
        var static_page_link = ""
        static_page_link += `<li><a href="/page/${static_pages[i].slug}" aria-label="${static_pages[i].name}">${static_pages[i].name}</a></li>`

        $("#static_page_link").append(static_page_link)
      }
    }
    else{
      console.error("static pages error")
    }
  }
  })
}

try{
  handleFormSubmitCommon('#right_col_subscribe', '.right_subscribe_submit_btn','.newsletter_msg_right');
}
catch(err){}

try{
  handleFormSubmitCommon('.footer-news-letter-form', '.footer_subscribe_submit_btn', '.footer-newsletter .newsletter_msg');
}
catch(err){
  console.log('error-in-newsletter-form',err);
}
window.get_image_style_from_meta_data = function get_image_style_from_meta_data(media_obj){
  try{
    if(!media_obj || !media_obj?.meta_data) 
      return "";
    
    let meta_data = media_obj?.meta_data;
    if (typeof meta_data === "string") 
      meta_data = JSON.parse(meta_data);
  
    if(!meta_data?.css_object_fit || !meta_data?.css_object_position)
      return "";
  
    return `object-fit: ${meta_data?.css_object_fit}; object-position: ${meta_data?.css_object_position};`
  } catch(err){
    console.log(`get_image_style_from_meta_data Error:`,err)
    return ""
  }
}


check_paid_user = ()=>{
  fetch(`https://${main_actual_domain}/reader/details`)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    if(data?.reader_detail?.authorised && data?.reader_detail?.status){
      setCookie('hide_ads',1,7)
    }
  })
  .catch(err => {
    console.log(err);
  });
}
document.addEventListener('DOMContentLoaded', function() {
  if (is_paywall_enabled) {
    check_paid_user()
  }
});


// Function to get a cookie value by its name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}