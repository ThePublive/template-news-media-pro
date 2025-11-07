// JavaScript files are compiled and minified during the build process to the assets/built folder. 
// See available scripts in the package.json file.

// Import JS

import {
  hideHeader ,showSubNav
} from './header';
import {
  latestSectionScrollTop 
} from './widget';
import {
  scrollTop 
} from './scrollToTopBtn';

showSubNav();
hideHeader();
scrollTop()
window.addEventListener("scroll", function () {
  latestSectionScrollTop()
  
});
