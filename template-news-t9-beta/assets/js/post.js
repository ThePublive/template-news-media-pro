var elem = document.getElementById('article-js');
var primary_category = elem.getAttribute('primary_category');
var article_type = elem.getAttribute('article_type');
var article_legacy_url = elem.getAttribute('article_legacy_url');
var publisher_actual_domain = elem.getAttribute('publisher_actual_domain') || `https://${window.location.hostname}`;
var post_id = elem.getAttribute('post_id');
var enable_infinite_articles = elem.getAttribute('enable_infinte_article');
var allow_login_wall = elem.getAttribute('allow_login_wall');
var infScrollArticleURLs = []
var infScrollPageIndex = 2
var article_key_string = article_url_string()
var allow_scroll_height = 0.4
var web_story_logo = elem.getAttribute('web_story_logo');
var gallery_logo = elem.getAttribute('gallery_logo');
var hide_full_content= elem.getAttribute('hide_full_content');
var allow_reader_login = elem.getAttribute('allow_reader_login')
var enable_native_legacy_var = elem.getAttribute('enable_native_legacy_ui')
var enable_native_legacy_ui = (enable_native_legacy_ui == '1' || enable_native_legacy_ui=='True') ? true : false
var blog_current_page = 2
let post_access_type = elem.getAttribute('post_access_type') 
let absolute_url = publisher_actual_domain + article_legacy_url
function check_duplicate(nextURL){
  var current_page_path = window.location.pathname.replace(/^.*\/\/[^\/]+/, '')
  if (current_page_path === nextURL){
    return 1
  }
  return 0
}
function updateNextURL( page ) {
  nextURL = infScrollArticleURLs[page]
}

function getCookieValue(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

function article_url_string() {
  var url = window.location.pathname.replace(/^.*\/\/[^\/]+/, '')
  url = url.replaceAll("/","")
    return url
}

function article_url_string_for_title(url) {
  url = decodeURIComponent(url)
  const slugify = str =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  url = slugify(url)
  return url
}

function getAllValues() {
  var inputValues = $('.category_list input').map(function() {
      return {"name":$(this).data('name'),"slug":$(this).val()}
  })
  return inputValues;
}



function getPenPath() {  
  if (this.loadCount == 0){
    this.loadCount = 1
  }
  if ( category_list[ this.loadCount ] ) {
    return `${publisher_actual_domain}/get_category_posts/${category_list[ this.loadCount ].slug}`;
  }
  else{
    return 0
  }
}
// Check if window.visited_pages is not defined or is not an array
if (!window.visited_pages || !Array.isArray(window.visited_pages)) {
  window.visited_pages = []; // Initialize it as an empty array
}

window.visited_pages.push(article_url_string_for_title(absolute_url))
function get_me_the_visited_page(){
  return window.visited_pages
}

$.fn.isInCertainHeight = function() {
  var offset = $(this).offset();
  if (!offset) return false;
  
  var elementTop = offset.top;
  var elementBottom = elementTop + $(this).outerHeight();
  var viewportTop = $(window).scrollTop() + 400;
  var viewportBottom = viewportTop + $(window).height() - 800;
  var viewportBottom_new = viewportTop + $(window).height() - 200;
  return (viewportTop < elementTop && elementTop < viewportBottom) || (viewportTop < elementBottom && elementBottom < viewportBottom_new) || (elementBottom > viewportTop && elementTop < viewportBottom);
};

function infinite_articles(){
  let elem = ''
  elem = document.querySelector('#left-col');
  let infScrollArticle = new InfiniteScroll( elem, {
    // options
    path: function() {
      if(nextURL){
        return `${publisher_actual_domain}${nextURL}`;
      }
      return ''
    },
    append: '.article_main_div',
    prefill: true,
    debug: false, // for prod set this as false
    history: false,
    historyTitle: false,
    scrollThreshold: 1500,
    // checkLastPage: getPenPath
  });
  
  

  infScrollArticle.on( 'load', function( body, path, response ) {
    window.loaded_article_url = publisher_actual_domain + nextURL
    try{
      const elements = body.getElementsByClassName('next_page_hide');
      for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = 'none';
      }
      }
      catch(err){}
    var all_next_divs = body.querySelectorAll('.next_page_show_ads')
    try {
      window.page_counter++;
      for(let i = 0; i<all_next_divs.length;i++){
        const element_id = all_next_divs[i].id.slice(0, -1) // slice last digit from the id to update it
        all_next_divs[i].id = element_id+window.page_counter;
      }
    }

    catch(err) {
      console.log("error is ",err)
    }
    try{
      const hide_ads_cookie_value = getCookieValue("hide_ads");
      if (hide_ads_cookie_value == "1") {
          const divs = body.getElementsByClassName("ads-container");
          for (let i = divs.length - 1; i >= 0; i--) {
            const div = divs[i];
            if (div && div.parentNode) {
              const parent = div?.parentNode
              parent.removeChild(div);
              try{
                const siblings = Array.from(parent?.children).filter(child => child !== div);
  
                // Check if siblings are less than 2
                if (siblings?.length < 2 && parent) {
                  // Update height to auto
                  parent.style.height = 'auto';
                }
              }catch(err){
                console.log('error',err)
              }

            }
          }
      }
    }
    catch(err){
      console.log("hide ads error");
    }
    try{
      window.visited_pages.push(article_url_string_for_title(path))
      // lazy loading all the image for infinite article
      const article_image = body.querySelectorAll('img')
      for(let i=0 ;i<=article_image.length;i++){
        article_image[i]?.setAttribute('loading', 'lazy');
      }
    }
    catch(err){
      console.error("image article break =>",err)
    }
    $('.pulse-container').css("display", "none");

    $('.read-more-article-box').css('display','flex')
    updateNextURL(infScrollArticle.pageIndex)
    infScrollPageIndex = infScrollArticle.pageIndex

    try {
      if(allow_reader_login == 1) {
        // get_next_page_bookmark(body)
        if(allow_login_wall) {
          handle_next_page_login_elements(body)
        }
      }
    }
    catch(err){
      console.error("next page error", err)
    }
  });

  infScrollArticle.on( 'request', function( path, fetchPromise ) {
    if(nextURL){
    $('.top_article_ads').css("display", "flex");
    $('.top_article_ads').css("margin-top", "10px");
      $('.pulse-container').css("display", "flex");
      $('div #infinite_page_loader').css("display", "flex");
    }
  })
  
  infScrollArticle.on( 'last', function( body, path ) {
    $('div #infinite_page_loader').css("display", "none");
    
  }); 
  
}


function article_url_string() {
  var url = window.location.pathname.replace(/^.*\/\/[^\/]+/, '')
  url = url.replaceAll("/","")
    return url
}

$(document).ready(function() {
  if(article_type !== 'CustomPage' && enable_infinite_articles === 'True'){
    get_infinite_articles(primary_category)
  }
  if(article_type === 'LiveBlog'){
    // start polling for blog updates
    setInterval(function(){
      $.get(article_legacy_url, function(data){
      data_html = $.parseHTML(data);
      var update_content = false
      $('.live_blog_icon_update_div').css('display','none')
        for(let i = 1; i<$(data_html).find('#live_blog_updates_'+post_id+'_div li').length;i++){
          if($('.blog_update_unique_class_'+i).attr('id') !== $(data_html).find('.blog_update_unique_class_'+i).attr('id')) {
            update_content = true
            $('.live_blog_icon_update_div span').html('New Update: '+  $(data_html).find('.blog_update_unique_class_'+i+' .update-heading').html())
            $('.live_blog_icon_update_div').css('display','flex')
            // load twitter widget if available when content is updated
            try{
              twttr.widgets.load();
            }catch(err){
              console.log('twttr handled error')
            }
            break
          }
        }
        if(update_content){
          $('#live_blog_updates_'+post_id+'_div').html($(data_html).find('#live_blog_updates_'+post_id+'_div').html());
        }

    });
      // Todo: update the interval time to 15000
    }, 15000)
    load_live_blog(blog_current_page)
  }
});

function load_live_blog(page){
  $.ajax({
    method:'get',
    url:`${publisher_actual_domain}/get-live-blog-updates/${post_id}?page=${page}`,
    dataType: 'json',
    success: function(res){
      var post_items = res.items
      for(let i = 0; i<post_items.length;i++){
        $('#live_blog_updates_'+post_id).append(
          `
          <li id="blog_update_${post_items[i].id}" data-update-time="${ post_items[i].created_at }" data-sort-time="${ post_items[i].created_at }" class="live-blog-li-div update">
            <div class="live-blog-date-title-div">
              <div class="update-date-div">
                <div class="update-date">${ post_items[i].created_at }</div>
                <div class="update-heading">${ post_items[i].blog_title }</div>
              </div>
            </div>
            <div class="update-content">
            ${ post_items[i].blog_content }
            </div> 
          </li>
      `
        );
    }
    if(!res.next){
      $('.blog-update-load-more-button').css('display','none')
    }
  }
})
}

$('.blog-update-load-more-button').on('click', function(){
  blog_current_page++
  load_live_blog(blog_current_page)
})

$(window).on('resize scroll', function() {
  try{
    if(typeof window.adjust_padding == 'function'){window.adjust_padding()}
    url = article_url_string()
    const new_page = get_me_the_visited_page() // this function is to update the visited page
    for(let i=0;i<window.visited_pages.length;i++){
      if($('.article_scroll_post_'+window.visited_pages[i]).isInCertainHeight()){
        const title = $('.article_scroll_post_'+window.visited_pages[i]).data('page-title')
        if(document.querySelector('title').textContent !== title){
          document.querySelector('title').textContent = title;
  
          const state = { title: title };
          const url = $('.article_scroll_post_'+window.visited_pages[i]).data('page-url')
          history.pushState(state, title, `${publisher_actual_domain}${url}`);
        }
      }
    }
  }catch(err){
    console.log('error',err);
  }
});

get_infinite_articles = (primary_category)=>{
  $.ajax({
    method:'get',
    url:`${publisher_actual_domain}/get_infinte_posts/${primary_category}`,
    dataType: 'json',
    success: function(res){
      var post_items = res.pages
      var related_articles = ""
      if(post_items.length > 0){
        $(".related_show").css('display','block')
        var author = {'name':'','slug':''}    
        $('#realted_articles_divider').css('display','block')
        for(let i = 0; i<post_items.length;i++){
          
          if(check_duplicate(post_items[i].url)){
            continue
          }
          infScrollArticleURLs.push(post_items[i].url)
        }
        page = 0
        nextURL = infScrollArticleURLs[page]
        
        infinite_articles()
      }
      else{
        console.error("error")
      }
    }
   
})}


function get_next_page_bookmark(body){
  let id = body.getElementById("article-post-id")?.value;
  if (id === undefined || (typeof id !== "string" && typeof id !== "number") || isNaN(id)) return;
  let form = new FormData()
  form.append('post_id', id);
  fetch(`${publisher_actual_domain}/reader/bookmark`, {
    method: "POST",
    body: form
  }) .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Request failed with status: ' + response.status);
    }
  }) .then(data => {
    if(!data?.authorised) {
      return;
    } 
    let bookmark_state = data?.bookmarked
    if(bookmark_state) {
      document.querySelector(`#remove-bookmark-btn-${id}`).style.display="block"
    } 
    else {
      document.querySelector(`#add-bookmark-btn-${id}`).style.display="block"
    }
    document.getElementById(`bookmark-redirect-btn-${id}`).style.display="none"
  }) .catch((error) => {
    console.log(error)
  });
}


if(allow_login_wall) {
  function handleLoginWallDisplay(show=false){
    if(show){
      if(loginWall?.classList.contains('hide')) {
        loginWall?.classList.remove('hide')
        loginWall?.classList.add('show')
      }
    }else {
      if(loginWall?.classList.contains('show')) {
        loginWall?.classList.remove('show')
        loginWall?.classList.add('hide')
      }
    }
  }
  let loginWall = document.querySelector('.login-wall')
window.addEventListener('load', ()=>{
    
    document.querySelector('.login-wall .login-wall--inner button')?.addEventListener('click', ()=> handleLoginWallDisplay(false))
    document.querySelector('.nav-user-account  button')?.addEventListener('click', ()=> handleLoginWallDisplay(false))
    document.querySelector('.close-sign-up-btn')?.addEventListener('click', ()=> handleLoginWallDisplay(true))

    window.addEventListener('scroll', function() {
      const articleHeight = document.querySelector('#postContent').clientHeight;
      const scrollPosition = window.scrollY;
      const threshold = articleHeight * allow_scroll_height;
      
      if (scrollPosition > threshold) {
        loginWall?.classList.remove('hide');
        loginWall?.classList.add('show');
        loginWall?.classList.remove('loginwall-visible')
      } else if(loginWall?.classList.contains('show') && !loginWall?.classList.contains('loginwall-visible')) {
        loginWall?.classList.add('hide');
        loginWall?.classList.remove('show');
      }
    });
  
} )
}

function show_full_article(e){
  const post_id = e
  $('#article_tag_'+post_id).removeClass("hide_article_content");
  $('#recomened_article_list_'+post_id).removeClass("hide_article_content");
  $('#recomened_article_title_'+post_id).removeClass("hide_article_content");
  $('#newsletter_div_'+post_id).removeClass("hide_article_content");
  $('#article_div_'+post_id+' #postContent').removeClass("cropped");
  $('#article_div_'+post_id+' #postContent').removeClass("hide-full-content");
  $('#desktop_ap_after_article_'+post_id).removeClass("hide_article_content");
  $(this).parent().css("display", "none");
  document.querySelector('#vuukle-module')?.classList.remove("hide_article_content");
}

function handle_next_page_login_elements(body){
  let login_wall_section = document.getElementById('login_Wall_section')
  let is_reader_logged_in = $(`#reader-login-status`).html()
  if(is_reader_logged_in == 1 && login_wall_section) { 
    // handle display of global login wall article
    if(hide_full_content != "false") body.querySelector('#postContent')?.classList.remove("hide-full-content")
  }
}

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

related_articles = (primary_category)=>{
  $.ajax({
    method:'get',
    url: `${publisher_actual_domain}/get_recommended_posts/${primary_category}`,
    dataType: 'json',
    success: function(res){
      var post_items = res.items.recommended_posts
      var related_articles = ""
      if(post_items.length > 0){
        $(".related_show").css('display','block')
        var author = {'name':'','slug':''}    
        $('#realted_articles_divider').css('display','block')
        for(let i = 0; i<post_items.length;i++){
          if(post_items[i].contributors.length > 0){
            author = post_items[i].contributors[0]
          }
          else{
            author = post_items[i].member
          }
          if(check_duplicate(post_items[i].legacy_url)){
            continue
          }
          related_articles +=  `<div class="" style="margin-bottom: 20px;
                                    margin: 10px;">
                                            <div class="related-carousel analytics-related-article-comp post-collection">
                                            <a href="${post_items[i].absolute_url}" aria-label="${post_items[i].title}">
                                                <div class="small-post rec-article-tile">
                                                    <div class="post-cover" style="margin: 0px;">
 
                                                        <img class="image cover ${enable_native_legacy_ui ?  " " :"aspect-ratio" } " width="${enable_native_legacy_ui ?  "230" :"260" }"  style="object-fit: cover; ${window?.get_image_style_from_meta_data?.(post_items[i]?.media_file_banner)}" src="${post_items[i].short_banner_url}" loading="lazy" alt="${post_items[i].title}">
                                                        <span class="recommended-icon ${post_items[i].video_block_cssclass}">
                                                                ${get_video_icon()}
                                                            </span>
                                                            <span class="recommended-icon ${post_items[i].web_story_block_cssclass}"
                                                                >
                                                                  <img
                                                                  alt="logo"
                                                                  class="web-story-recommended-logo"
                                                                  src="${web_story_logo}"
                                                                  width="100"
                                                                  height="100"
                                                              >
                                                            </span>
                                                            <span class="recommended-icon ${post_items[i].gallery_block_cssclass}">
                                                                <img
                                                                alt="web-stroy-logo"
                                                                class="gallery-logo"
                                                                src="${gallery_logo}"
                                                                width="100"
                                                                height="100"
                                                                
                                                                >
                                                            </span>
                                                            ${get_live_icon(post_items[i])}
                                                    </div>
                                                    <div class="para-rec">
                                                    <div class="rec-article-title primary_font">
                                                      ${post_items[i].title}
                                                    </div>
                                                    </div>
                                                </div>
                                        
                                            </a>
                                            </div>
                                    </div>`
            
        }
        const amp_base_carousel = `${related_articles}`
        $("#related_articles").append(amp_base_carousel)
      
      }
      else{
        console.error("error")
      }
    }
   
})}

let PaywallDetails = (legacy_url)=>{
  fetch(`${publisher_actual_domain}/reader/details?legacy_url=${legacy_url}`)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
  if(data?.items[0].legacy_url == legacy_url){
    if(data?.items[0].readability_status == "1"){
      document.querySelector('#postContent')?.classList.remove("hide-full-content")
      document.getElementById('post-container').style.display =""
      document.querySelector('.login-wall')?.classList.add("d-none")
      document.querySelector('.bottom-shadow-mobile')?.classList.add("d-none")
      document.querySelectorAll('.access-wall-comp').forEach(function(element) {element.classList.remove('d-none');});
      handleLoginWallDisplay(true)
      accessWallArticleDisplay()
    }
    else{
      document.querySelector(`#reader-login-status`).innerHTML = 2
      document.querySelector('#postContent')?.classList.add("hide-full-content")
      document.querySelector('.login-wall')?.classList.remove("d-none")
      document.querySelector('.bottom-shadow-mobile')?.classList.remove("d-none")
      handleLoginWallDisplay(false)
      let paywall_container = document.getElementById('pub-paywall-container')
      if(paywall_container){
        paywall_container.innerHTML += paywall_content_html(data?.items[0].paywall)
        document.getElementById('pub-paywall-container').style.backgroundColor = data?.items[0].paywall.content.background_color
        document.getElementById('pub-cta-btn').addEventListener('click', function(){
          localStorage.setItem('redirect_url', window.location.href);
          console.log('URL stored in localStorage');
          // or alert('URL stored in localStorage');
        })
      }
    }
  }
  })
  .catch(err => {
    console.log(err);
  });
}

let HandleMulitpleCta =(data)=>{
  try{
    if(data.content.cta.length >= 1){  
      let cta_data = data.content.cta
      let cta_btns = ""
      for (let i = 0; i < cta_data.length; i++) {
        cta_btns += `
        <a id="pub-cta-btn" class="pub-wall-btn" style="background-color:${data.content?.link_color};color:${data.content?.text_color}" href="${cta_data[i].cta_link}" aria-label="">${cta_data[i].cta_text}</a>
        `
      }
      return cta_btns
    }
  }
  catch(err){
    console.error("error",err)
  }
  return ''
}
document.addEventListener('DOMContentLoaded', function() {
  if(post_access_type === "Paid"){
    PaywallDetails(article_legacy_url)
  }
});

let paywall_content_html = (data)=>{
  return `
  <div class="login-wall--inner" style="background-color:${data.content.background_color};color:${data.content?.text_color};">
    <img src="${data.content.logo}" id="pub-paywall-logo" alt="login-icon">
    <div id="pub_paywall_content">
      ${data.content.information}
    </div>
    ${HandleMulitpleCta(data)}
  </div>
  `
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

try{
  function shareContent(url, title) {
    const shareData = {
      title: title,
      text: title,
      url: url,
    };

    // Trigger the share dialog
    navigator.share(shareData)
      .then(() => console.log('Shared successfully.'))
      .catch((error) => console.log('Error sharing:', error));
  }
}catch(err){
  console.log('shareContent error ',err);
}

