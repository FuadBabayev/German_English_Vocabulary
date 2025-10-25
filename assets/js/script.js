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
            const collapseId = `collapseWord${currentIndex}`; // unique ID

            const item = $(`
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button collapsed text-center" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}">
                            <p>${mainWord}</p>
                        </button>
                    </h2>
                    <div id="${collapseId}" class="accordion-collapse collapse">
                        <div class="accordion-body highlight text-center">
                            ${translation}
                        </div>
                    </div>
                </div>
            `);

            accordion.append(item).addClass("show");

            // Initialize Bootstrap collapse for dynamically added element
            const collapseEl = document.getElementById(collapseId);
            new bootstrap.Collapse(collapseEl, { toggle: false });
        }, 0);
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

    // Keyboard events for Next, Previous, and Toggle
    $(document).on("keydown", function (e) {
        if (e.ctrlKey && e.key.toLowerCase() === "e") {
            e.preventDefault();
            currentLang = "english";
            loadData();
        } else if (e.ctrlKey && e.key.toLowerCase() === "g") {
            e.preventDefault();
            currentLang = "german";
            loadData();
        }

        if (e.code === "ArrowRight") {
            if (currentIndex < shuffledWords.length - 1) {
                currentIndex++;
                renderAccordion();
            }
        } else if (e.code === "ArrowLeft") {
            if (currentIndex > 0) {
                currentIndex--;
                renderAccordion();
            }
        } else if (e.code === "Space" || e.code === "Enter") {
            e.preventDefault();
            const collapseId = `collapseWord${currentIndex}`;
            const collapseEl = document.getElementById(collapseId);
            const bsCollapse = bootstrap.Collapse.getInstance(collapseEl) || new bootstrap.Collapse(collapseEl, { toggle: false });
            bsCollapse.toggle();
        }
    });

    // Fetch data and initialize
    $(document).ready(function () {
        fetchData();
    });
});
