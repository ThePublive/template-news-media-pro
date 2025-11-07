var elem = document.getElementById('bookmark-js');
let csrf_token = elem.getAttribute("csrf_token")
let new_page_type = elem.getAttribute("page_type")
let post_key = document.getElementById("article-post-id")?.value;
let add_bookmark_btn =   document.querySelectorAll(`#add-bookmark-btn-`+post_key)
let remove_bookmark_btn =   document.querySelectorAll(`#remove-bookmark-btn-`+post_key)
let bookmark_actual_domain = elem.getAttribute("actual_domain")

function apiCall(post_id, URL, method, callback){
  if (post_id === undefined || (typeof post_id !== "string" && typeof post_id !== "number") || isNaN(post_id)) return;
  let form = new FormData()
  form.append('post_id', post_id);
  fetch(URL, {
    method: method,
    body: form,
    headers: {
      'X-CSRFToken': csrf_token, 
    }
  }).then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Request failed with status: ' + response.status);
    }
  })
  .then(data => {
    if(callback)
      callback(data)
  })
  .catch((error) => {
    console.log(error)
  });
}

 function get_bookmark_state(){
  function handleBookmarkButtonDisplay(data){
    if(!data?.authorised) {
      return;
    } 
    let bookmark_state = data?.bookmarked
    if(bookmark_state) {
      add_bookmark_btn?.forEach(item => item.style.display = "none")
      remove_bookmark_btn?.forEach(item=> item.style.display = "block")
    } 
    else {
      remove_bookmark_btn?.forEach(item=> item.style.display = "none")
      add_bookmark_btn?.forEach(item=> item.style.display = "block")
    }
    document.querySelectorAll(`#bookmark-redirect-btn-`+post_key)?.forEach(item=> item.classList.add("display-none"))
  } 

  apiCall(post_key, `https://${bookmark_actual_domain}/reader/bookmark`, "POST",  handleBookmarkButtonDisplay)
}


window.add_bookmark = function add_bookmark(post_id){  
  document.querySelector(`#add-bookmark-btn-${post_id}`).style.display = "none"
  document.querySelector(`#remove-bookmark-btn-${post_id}`).style.display = "block"
  apiCall(post_id, `https://${bookmark_actual_domain}/reader/bookmark/bookmark-post`,"POST")
}
window.remove_bookmark = function remove_bookmark(post_id){
  document.querySelector(`#add-bookmark-btn-${post_id}`).style.display = "block"
  document.querySelector(`#remove-bookmark-btn-${post_id}`).style.display = "none"
  apiCall(post_id, `https://${bookmark_actual_domain}/reader/bookmark/remove-bookmark`,"POST")
}

if(new_page_type!='BookMarksPage') {
  $(document).ready(function(){
    get_bookmark_state()
  })
}