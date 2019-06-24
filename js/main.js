'use strict';
{

const searchBtn = document.querySelector('.search__btn');
const moviesSection = document.querySelector('.movies');
const postersSection = document.querySelector('.posters');
const moviesLists = document.querySelector('.movies__lists');
const postersLists = document.querySelector('.posters__lists');
const moviesTextCount = document.querySelector('.movies__text--count');
const moviesTextFixed = document.querySelector('.movies__text--fixed');
const postersMainTitle = document.querySelector('.posters__main-title');
const searchMessage = document.querySelector('.search__message');
const searchKeyword = document.querySelector('.search__keyword');
const ja = document.querySelector('.search__radio--ja');
const en = document.querySelector('.search__radio--en');
const backBtn = document.querySelector('.posters__btn--back');
const topBtn = document.querySelector('.posters__btn--top');
const apiKey = '051bf6155530635beb0d51f0855f45d8';
const searchBaseUrl = 'https://api.themoviedb.org/3/search/movie?';
const posterBaseUrl = 'https://image.tmdb.org/t/p/w342';

const country = [
  ['Japan', '日本', 'ja-JP'],
  ['USA', 'アメリカ', 'en-US'],
  ['Italy', 'イタリア', 'it-IT'],
  ['France', 'フランス', 'fr-FR'],
  ['Norway', 'ノルウェー', 'no-NO'],
  ['Iceland', 'アイスランド', 'is-IS'],
  ['Russia', 'ロシア', 'ru-RU'],
  ['Brazil', 'ブラジル', 'pt-BR'],
  ['Mexico', 'メキシコ', 'es-MX'],
  ['India', 'インド', 'hi-IN'],
  ['South Korea', '韓国', 'ko-KR'],
  ['China', '中国', 'zh-CN'],
  ['Turkey', 'トルコ', 'tr-TR'],
  ['Egypt', 'エジプト', 'ar-AE']
]

// sectionを非表示
function hideSection(section) {
  section.classList.add('hidden');
}

// sectionを表示
function showSection(section) {
  section.classList.remove('hidden');
}

// ulの子要素を全て削除
function ulRemoveChild(ul) {
  while (ul.firstChild) {
    ul.removeChild(ul.firstChild);
  }
}

// APIから情報取得
async function search(url) {
  const data = await fetch(url);
  const obj = await data.json();
  // console.log(obj);
  return obj;
}

// エンコード
function encodeString(object) {
  let encodeObjects = [];
  Object.keys(object).forEach(function(key) {
    const encodeObject = (encodeURIComponent(key) + '=' + encodeURIComponent(object[key]));
    encodeObjects.push(encodeObject);
  });
  return encodeObjects.join('&');
}

// 検索結果を表示
function showMovies(movieObj) {
  for (let i = 0; i < movieObj.results.length; i++) {
    const movieObjTitle = movieObj.results[i].title;
    const movieObjId = movieObj.results[i].id;
    const movieObjPosterPath = movieObj.results[i].poster_path;
    const movieObjPosterUrl = `${posterBaseUrl}${movieObjPosterPath}`;
    const movieUrl = `https://api.themoviedb.org/3/movie/${movieObjId}?`;
    const li = document.createElement('li');
    const img = document.createElement('img');
    const moviesImgText = document.createElement('p');
    const moviesTitle = document.createElement('p');

    li.classList.add('movies__list');
    img.src = movieObjPosterUrl;
    img.classList.add('movies__img');
    moviesImgText.textContent = ja.checked ? "世界のポスターを見る":"other country posters";
    moviesImgText.classList.add('movies__img-text');
    moviesImgText.classList.add('hidden');
    moviesTitle.textContent = movieObjTitle;
    moviesTitle.classList.add('movies__title');

    li.appendChild(img);
    li.appendChild(moviesImgText);
    li.appendChild(moviesTitle);
    moviesLists.appendChild(li);

    // ポスターにマウスオーバー
    img.addEventListener('mouseover', () => {
      moviesImgText.classList.remove('hidden');
    });

    // ポスターからマウスアウト
    img.addEventListener('mouseout', () => {
      moviesImgText.classList.add('hidden');
    });

    // ポスターをクリック
    img.addEventListener('click', () => {
      ulRemoveChild(postersLists);
      hideSection(moviesSection);
      showSection(postersSection);
      postersMainTitle.textContent = movieObjTitle;

      // 各国のポスターを表示
      for (let i = 0; i < country.length; i++) {
        const searchMovieObject = {
          "api_key" : apiKey,
          "language" : country[i][2]
        };
        const searchPosterUrl = `${movieUrl}${encodeString(searchMovieObject)}`;

        search(searchPosterUrl).then(posterObj => {

          // 言語選択している国のポスターと、それと被っていないポスターを表示
          if ((ja.checked && i === 0) || (en.checked && i === 1) || (posterObj.poster_path !== movieObjPosterPath)) {
            const eachCountryPosterUrl = `${posterBaseUrl}${posterObj.poster_path}`;
            const posterLi = document.createElement('li');
            const posterImg = document.createElement('img');
            const posterCountry = document.createElement('p');
            const posterTitle = document.createElement('p');

            posterLi.classList.add('posters__list');
            posterImg.src = eachCountryPosterUrl;
            posterImg.classList.add('posters__img');
            posterCountry.textContent = ja.checked ? country[i][1] : country[i][0];
            posterCountry.classList.add('posters__country');
            posterTitle.textContent = posterObj.title;
            posterTitle.classList.add('posters__title');

            posterLi.appendChild(posterImg);
            posterLi.appendChild(posterCountry);
            posterLi.appendChild(posterTitle);
            postersLists.appendChild(posterLi);
          }
        });
      }
    });
  }
}

// searchボタンをクリック
searchBtn.addEventListener('click', (e) => {
  e.preventDefault();

  function searchMovies() {
    const searchMovieObject = {
      "api_key" : apiKey,
      "page" : 1,
      "language" : ja.checked ? "ja-JP":"en-US",
      "query" : searchKeyword.value
    };
    const searchMovieUrl = `${searchBaseUrl}${encodeString(searchMovieObject)}`;

    search(searchMovieUrl).then(movieObj => {
      // console.log(movieObj);

      ulRemoveChild(moviesLists);
      hideSection(postersSection);
      showSection(moviesSection);

      moviesTextCount.textContent = ja.checked ? `検索結果： ${movieObj.results.length}件`:`${movieObj.results.length} results`;
      moviesTextFixed.textContent = ja.checked ? "映画を選択してください。":"Please select a movie.";

      showMovies(movieObj);

    });
  }

  searchMovies();

  backBtn.addEventListener('click', () => {
    searchMovies();
  });

  topBtn.addEventListener('click', () => {
    ulRemoveChild(moviesLists);
    ulRemoveChild(postersLists);
    hideSection(postersSection);
  })

});

ja.addEventListener('click', () => {
  searchMessage.textContent = "世界の映画ポスターを見てみよう";
  searchKeyword.placeholder = "映画、ドラマのタイトル...";
  backBtn.textContent = "← 戻る";
  topBtn.textContent = "別の映画を検索する";
});

en.addEventListener('click', () => {
  searchMessage.textContent = "Let's look at movie posters of the world.";
  searchKeyword.placeholder = "Movie or TV drama title...";
  backBtn.textContent = "← back";
  topBtn.textContent = "search another movie";
});

}
