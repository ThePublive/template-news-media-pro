export const switchThemeBtn = document.querySelector('.gh-switch-btn');
export const rootElem = document.querySelector('html[data-theme]');
const moonIcon = document.querySelector('.gh-moon-icon');
const sunIcon = document.querySelector('.gh-sun-icon');

export const changeTwitterCardTheme = () => {
  const tweets = document.querySelectorAll('[data-tweet-id]');

  const changeTweetsTheme = () => {
    const storedTheme =
      localStorage.getItem('data-theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const targetTheme = storedTheme === 'dark' ? 'light' : 'dark';

    const switchTweetTheme = (currentTheme, targetTheme) => {
      tweets.forEach((tweet) => {
        const src = tweet.getAttribute('src');
        tweet.setAttribute('src', src.replace('theme=' + currentTheme, 'theme=' + targetTheme));
      });
    };

    switchTweetTheme(targetTheme, storedTheme);
  };

  if (tweets) {
    changeTweetsTheme();
  }
};

export const switchTheme = () => {
  const changeCommentsColorOnToggle = () => {
    const rootElem = document.querySelector('html');
    const theme = rootElem.getAttribute('data-theme');
    const commentsSectionIframe = document.querySelector(
      "#ghost-comments-root > iframe[title='comments-frame']"
    );

    if (commentsSectionIframe) {
      const commentsSection =
        commentsSectionIframe.contentWindow.document.querySelector('.ghost-display');

      if (theme === 'dark') {
        commentsSection.classList.add('dark');
      } else {
        commentsSection.classList.remove('dark');
      }
    }
  };

  const currentTheme = rootElem.getAttribute('data-theme');
  
  switchIcon(currentTheme);

  rootElem.setAttribute('data-theme', currentTheme === 'light' ? 'dark' : 'light');
  localStorage.setItem('data-theme', currentTheme === 'light' ? 'dark' : 'light');
  changeTwitterCardTheme();
  changeCommentsColorOnToggle();
};

export const switchIcon = (theme) => {
  if (theme === 'light') {
    sunIcon.style.display = 'block';
    moonIcon.style.display = 'none';
  } else {
    sunIcon.style.display = 'none';
    moonIcon.style.display = 'block';
  }
};

export const defineIconTheme = () => {
  const currentTheme = rootElem.getAttribute('data-theme');

  if (currentTheme === 'light') {
    sunIcon.style.display = 'none';
    moonIcon.style.display = 'block';
  } else {
    sunIcon.style.display = 'block';
    moonIcon.style.display = 'none';
  }
};
