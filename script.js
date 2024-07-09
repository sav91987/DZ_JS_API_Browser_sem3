//Для работы подставить в строке 75 вместо YOUR_ACCESS_KEY свой ключ с сайта https://unsplash.com/

const cardEl = document.querySelector(".card");
const hystoryEl = document.querySelector(".history");

document.addEventListener("DOMContentLoaded", app());

let likesCount = 0;

const key = "photo";

if (!localStorage.getItem(key)) {
    localStorage.setItem(key, `[]`);
}

const photos = JSON.parse(localStorage.getItem(key));

async function app() {
    const data = await fetchPhoto();
    photos.push({
        id: data.id,
        url: data.urls.regular,
        likes: likesCount,
    });

    localStorage.setItem(key, JSON.stringify(photos));
    cardEl.insertAdjacentHTML("beforeend", createBlock(data.urls.regular, 0));
    if (photos.length > 1) {
        cardEl.insertAdjacentHTML(
            "beforeend",
            `<button class="history_btn_show">Показать историю</button>
            <button class="history_btn_close hidden">Скрыть историю</button`
        );
    }

    const likesCounterEl = cardEl.querySelector(".likes_counter");
    const likesEl = cardEl.querySelector(".like");
    const dislikesEl = cardEl.querySelector(".dislike");
    const showHystoryEl = cardEl.querySelector(".history_btn_show");
    const closeHystoryEl = cardEl.querySelector(".history_btn_close");


    cardEl.addEventListener("click", (e) => {
        if (e.target.classList.contains("like")) {
            likesCount++;
            changeLikes(dislikesEl, e.target, likesCounterEl);
        }
        if (e.target.classList.contains("dislike")) {
            likesCount--;
            changeLikes(likesEl, e.target, likesCounterEl);
        }
        if (e.target.classList.contains("history_btn_show")) {
            showHystoryEl.classList.add('hidden');
            closeHystoryEl.classList.remove('hidden');
            photos.forEach((element) => {
                hystoryEl.insertAdjacentHTML(
                    "beforeend",
                    createBlock(element.url, element.likes)
                );
                hystoryEl.classList.remove("hidden");
            });
            const hystoryLikesEls = hystoryEl.querySelectorAll(".like");
            hystoryLikesEls.forEach((element) => {
                element.classList.add("hidden");
            });
        }
        if (e.target.classList.contains("history_btn_close")) {
            showHystoryEl.classList.remove('hidden');
            closeHystoryEl.classList.add('hidden');
            hystoryEl.classList.add('hidden');
        }
    });
}

async function fetchPhoto() {
    const response = await fetch(
        `https://api.unsplash.com/photos/random?client_id=YOUR_ACCESS_KEY`
    );

    if (!response.ok) {
        throw new Error(`Warning!!!! ${response.status}`);
    }

    return await response.json();
}

function createBlock(path, count) {
    return `<div class="photo">
          <img src="${path}" alt="img" />
        </div>
        <h2>Автор: <span class="card__span">Сотников Андрей</span></h2>
        <div class="card__btn">
    <div class="btn_wrapper">
        <img src="./2445095.svg" alt="like_logo">
        <h3 class="likes_counter">${count}</h3>
        <button class="like">Like</button>
    </div>
    <div>
        <button class="dislike hidden">Dislike</button> 
    </div>
    </div>
        `;
}

function changeLikes(elem, targetEl, likeDislikeElem) {
    likeDislikeElem.innerHTML = likesCount;
    photos[photos.length - 1].likes = likesCount;
    localStorage.setItem(key, JSON.stringify(photos));
    targetEl.classList.add("hidden");
    elem.classList.remove("hidden");
}
