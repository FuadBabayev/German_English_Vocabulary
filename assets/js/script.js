$(function () {
    "use strict";

    let dataEnglishGerman = {};
    let dataGermanEnglish = {};
    let currentLang = "english";
    let shuffledWords = [];
    let currentIndex = 0;

    function shuffleArray(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    function fetchData() {
        $.getJSON('data/randomVocabulary.json', function (jsonData) {
            dataEnglishGerman = jsonData.germanEnglish;
            dataGermanEnglish = Object.fromEntries(
                Object.entries(dataEnglishGerman).map(([en, de]) => [de, en])
            );
            loadData();
        }).fail(function (error) {
            console.error("Failed to fetch JSON:", error);
        });
    }

    function loadData() {
        shuffledWords = shuffleArray(
            Object.entries(currentLang === "german" ? dataEnglishGerman : dataGermanEnglish)
        );
        currentIndex = 0;
        renderAccordion();
    }

    function renderAccordion() {
        const accordion = $("#wordAccordion");
        accordion.removeClass("show");
        setTimeout(() => {
            accordion.empty();
            const [mainWord, translation] = shuffledWords[currentIndex];

            const item = $(`
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button class="accordion-button collapsed  text-center" type="button" data-bs-toggle="collapse" data-bs-target="#collapseWord">
                <p>${mainWord}</p>
          </button>
        </h2>
        <div id="collapseWord" class="accordion-collapse collapse">
          <div class="accordion-body highlight text-center">
            ${translation}
          </div>
        </div>
      </div>
    `);

            accordion.append(item).addClass("show");
        }, 200);
    }

    $("#englishBtn").on("click", function () {
        currentLang = "english";
        loadData();
    });

    $("#germanBtn").on("click", function () {
        currentLang = "german";
        loadData();
    });

    $("#nextBtn").on("click", function () {
        if (currentIndex < shuffledWords.length - 1) {
            currentIndex++;
            renderAccordion();
        }
    });

    $("#prevBtn").on("click", function () {
        if (currentIndex > 0) {
            currentIndex--;
            renderAccordion();
        }
    });

    // Fetch data and initialize
    $(document).ready(function () {
        fetchData();
    });


});