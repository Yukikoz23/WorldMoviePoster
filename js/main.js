'use strict';
{

  const apiKey = "051bf6155530635beb0d51f0855f45d8";
  const posterBaseUrl = "https://image.tmdb.org/t/p/w342";
  const ja = document.querySelector(".search__radio--ja");
  const moviesSection = document.querySelector(".movies");
  const postersSection = document.querySelector(".posters");

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
      const encodeObject =
        encodeURIComponent(key) + "=" + encodeURIComponent(object[key]);
      encodeObjects.push(encodeObject);
    });
    return encodeObjects.join("&");
  }

  // ulの子要素を全て削除
  function ulRemoveChild(ul) {
    while (ul.firstChild) {
      ul.removeChild(ul.firstChild);
    }
  }

  class Posters {
    constructor(id, title, poster) {
      this.id = id;
      this.title = title;
      this.poster = poster;
    }

    showPoster() {
      const postersLists = document.querySelector(".posters__lists");
      const postersMainTitle = document.querySelector(".posters__main-title");
      const backBtn = document.querySelector(".posters__btn--back");
      const topBtn = document.querySelector(".posters__btn--top");
      const country = [
        ["Japan", "日本", "ja-JP"],
        ["USA", "アメリカ", "en-US"],
        ["Italy", "イタリア", "it-IT"],
        ["France", "フランス", "fr-FR"],
        ["Norway", "ノルウェー", "no-NO"],
        ["Iceland", "アイスランド", "is-IS"],
        ["Russia", "ロシア", "ru-RU"],
        ["Brazil", "ブラジル", "pt-BR"],
        ["Mexico", "メキシコ", "es-MX"],
        ["India", "インド", "hi-IN"],
        ["South Korea", "韓国", "ko-KR"],
        ["China", "中国", "zh-CN"],
        ["Turkey", "トルコ", "tr-TR"],
        ["Egypt", "エジプト", "ar-AE"]
      ];

      for (let i = 0; i < country.length; i++) {
        const searchPosterItem = {
          api_key: apiKey,
          language: country[i][2]
        };
        const movieUrl = `https://api.themoviedb.org/3/movie/${this.id}?`;
        const searchPosterUrl = `${movieUrl}${encodeString(searchPosterItem)}`;

        ulRemoveChild(postersLists);

        search(searchPosterUrl).then(posterObj => {
          if (
            (ja.checked && i === 0) ||
            (en.checked && i === 1) ||
            posterObj.poster_path !== this.poster
          ) {
            const eachCountryPosterUrl = `${posterBaseUrl}${posterObj.poster_path}`;
            const posterLi = document.createElement("li");
            const posterImg = document.createElement("img");
            const posterCountry = document.createElement("p");
            const posterTitle = document.createElement("p");

            posterImg.src = eachCountryPosterUrl;
            posterCountry.textContent = ja.checked
              ? country[i][1]
              : country[i][0];
            posterTitle.textContent = posterObj.title;

            posterLi.classList.add("posters__list");
            posterImg.classList.add("posters__img");
            posterCountry.classList.add("posters__country");
            posterTitle.classList.add("posters__title");

            posterLi.appendChild(posterImg);
            posterLi.appendChild(posterCountry);
            posterLi.appendChild(posterTitle);
            postersLists.appendChild(posterLi);
          }
        });
      }
      postersMainTitle.textContent = this.title;
      moviesSection.classList.add("hidden");
      postersSection.classList.remove("hidden");

      backBtn.addEventListener("click", () => {
        postersSection.classList.add("hidden");
        moviesSection.classList.remove("hidden");
      });

      topBtn.addEventListener("click", () => {
        location = '';
      });
    }
  }

  class Movies {
    constructor(keyword) {
      this.keyword = keyword;
      this.movies = [];
    }

    showMovies() {
      const searchMovieItem = {
        api_key: apiKey,
        page: 1,
        language: ja.checked ? "ja-JP" : "en-US",
        query: this.keyword
      };
      const searchBaseUrl = "https://api.themoviedb.org/3/search/movie?";
      const searchMovieUrl = `${searchBaseUrl}${encodeString(searchMovieItem)}`;
      const moviesLists = document.querySelector(".movies__lists");

      this.movies.length = 0;

      search(searchMovieUrl).then(movieObj => {
        // 検索件数とテキストを表示
        const moviesTextCount = document.querySelector(".movies__text--count");
        const moviesTextFixed = document.querySelector(".movies__text--fixed");
        moviesTextCount.textContent = ja.checked
          ? `検索結果： ${movieObj.results.length}件`
          : `${movieObj.results.length} results`;
        moviesTextFixed.textContent = ja.checked
          ? "映画を選択してください。"
          : "Please select a movie.";

        // moviesにデータを格納
        movieObj.results.forEach(result => {
          const movieItem = {
            id: result.id,
            title: result.title,
            poster: result.poster_path
          };
          this.movies.push(movieItem);
        });

        ulRemoveChild(moviesLists);

        // moviesを表示
        this.movies.forEach(movie => {
          // console.log(movie);
          const movieLi = document.createElement("li");
          const movieImg = document.createElement("img");
          const moviesImgText = document.createElement("p");
          const moviesTitle = document.createElement("p");
          const moviePosterUrl = `${posterBaseUrl}${movie.poster}`;

          movieImg.src = moviePosterUrl;
          moviesImgText.textContent = ja.checked
            ? "世界のポスターを見る"
            : "other country posters";
          moviesTitle.textContent = movie.title;

          movieLi.classList.add("movies__list");
          movieImg.classList.add("movies__img");
          moviesImgText.classList.add("movies__img-text");
          moviesImgText.classList.add("hidden");
          moviesTitle.classList.add("movies__title");

          movieLi.appendChild(movieImg);
          movieLi.appendChild(moviesImgText);
          movieLi.appendChild(moviesTitle);
          moviesLists.appendChild(movieLi);

          // ポスターにマウスオーバー
          movieImg.addEventListener("mouseover", () => {
            moviesImgText.classList.remove("hidden");
          });

          // ポスターからマウスアウト
          movieImg.addEventListener("mouseout", () => {
            moviesImgText.classList.add("hidden");
          });

          // ポスターをクリック
          movieImg.addEventListener("click", () => {
            const posters = new Posters(movie.id, movie.title, movie.poster);
            posters.showPoster();
          });
        });

        postersSection.classList.add("hidden");
        moviesSection.classList.remove("hidden");
      });
    }
  }

  class App {
    constructor() {
      const searchBtn = document.querySelector(".search__btn");
      const searchMessage = document.querySelector(".search__message");
      const searchKeyword = document.querySelector(".search__keyword");

      searchBtn.addEventListener("click", e => {
        e.preventDefault();

        const keyword = document.querySelector(".search__keyword").value;
        const movies = new Movies(keyword);
        movies.showMovies();
      });

      ja.addEventListener("click", () => {
        searchMessage.textContent = "世界の映画ポスターを見てみよう";
        searchKeyword.placeholder = "映画、ドラマのタイトル...";
        backBtn.textContent = "← 検索結果に戻る";
        topBtn.textContent = "別の映画を検索する";
      });

      en.addEventListener("click", () => {
        searchMessage.textContent = "Let's look at movie posters of the world.";
        searchKeyword.placeholder = "Movie or TV drama title...";
        backBtn.textContent = "← back";
        topBtn.textContent = "search another movie";
      });
    }
  }

  new App();

}
