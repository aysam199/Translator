const search = document.getElementById("search");   
const transResult = document.getElementById("translated");
const selectFrom = document.getElementById("from");
const selectTo = document.getElementById("to");

const myHandler = function () {
  if (search.value.length === 0) {
    transResult.value = "";
  } else {
    translate();
  }
};
const dHandler = debounced(200, myHandler);
search.addEventListener("input", dHandler);  

selectTo.addEventListener("change", myHandler);
selectFrom.addEventListener("change", myHandler);
function translate() {
  let searchVal = search.value;
  let fromLang = selectFrom.value;
  let toLang = selectTo.value;
  postRequest({ searchVal, fromLang, toLang }, "/search", (error, response) => {
    if (error) {
      transResult.value = "something went wrong please contact us";
    } else if (response.status === 200) {
      let translated = response.data.translations[0].translation;
      transResult.value = translated;
    } else {
      transResult.value = "something went wrong please contact us";
    }
  });
}

function speakSearch() {
  speechSynthesis.speak(new SpeechSynthesisUtterance(search.value));
}
function speakTranslated() {
  speechSynthesis.speak(new SpeechSynthesisUtterance(transResult.value));
}

const postRequest = (body, url, cb) => {
  axios
    .post(url, body)
    .then(result => {
      cb(null, result);
    })
    .catch(error => {
      cb(error);
    });
};

function debounced(delay, fn) {
  let timerId;
  return function (...args) {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      fn(...args);
      timerId = null;
    }, delay);
  };
}
