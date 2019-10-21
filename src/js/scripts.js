/* HC Offcanvas menu navigation */
$('#main-nav').hcOffcanvasNav({
    maxWidth: 980,
    disableBody: false,
    insertClose: false,
    position: 'left',
    labelBack: ''
});

/** Sticky Header */
(() => {
    let header = document.querySelector('header');
    let sticky = document.querySelector('nav');
    let stickyOffset = sticky.offsetTop;

    window.onscroll = () => {
        if (window.pageYOffset > stickyOffset) {
            sticky.classList.add("active");
            header.classList.add("sticky-active");
        } else {
            if (document.querySelector('.hc-nav-yscroll') == null) {
                sticky.classList.remove("active");
                header.classList.remove("sticky-active");
            }
        }
    };
})();


/* Search */
(() => {
    let main_nav = document.querySelector('#main-nav');
    let search_btn = document.querySelector('.icons .search-btn');
    let search_container = document.querySelector('.search-container');
    search_btn.addEventListener('click', () => {
        main_nav.classList.toggle('invisible');
        search_container.classList.toggle('visible');
        search_btn.classList.toggle('icon-close');
        search_btn.classList.toggle('icon-lupe');
    });

})();


/* AutoComplete */
new autoComplete({
    data: {                              // Data src [Array, Function, Async] | (REQUIRED)
        src: async () => {
            // User search query
            const query = document.querySelector("#autoComplete").value;
            // Fetch External Data Source
            const source = await fetch(`http://futog.com/dummy-api/?q=${query}`);
            // Format data into JSON
            return await source.json();
        },
        key: ["name"],
        cache: false
    },
    sort: (a, b) => {                    // Sort rendered results ascendingly | (Optional)
        if (a.match < b.match) return -1;
        if (a.match > b.match) return 1;
        return 0;
    },
    placeHolder: "Search",     // Place Holder text                 | (Optional)
    selector: "#autoComplete",           // Input field selector              | (Optional)
    threshold: 2,                        // Min. Chars length to start Engine | (Optional)
    debounce: 300,                       // Post duration for engine to start | (Optional)
    searchEngine: "strict",              // Search Engine type/mode           | (Optional)
    resultsList: {                       // Rendered results list object      | (Optional)
        render: true,
        destination: document.querySelector("#autoComplete"),
        position: "afterend",
        element: "ul"
    },
    maxResults: 5,                         // Max. number of rendered results | (Optional)
    highlight: true,                       // Highlight matching results      | (Optional)
    resultItem: {                          // Rendered result item            | (Optional)
        content: (data, source) => {
            source.innerHTML = data.match;
        },
        element: "li"
    },
    noResults: () => {                     // Action script on noResults      | (Optional)
        const result = document.createElement("li");
        result.setAttribute("class", "no_result");
        result.setAttribute("tabindex", "1");
        result.innerHTML = "No Results";
        document.querySelector("#autoComplete_results_list").appendChild(result);
    },
    onSelection: feedback => {             // Action script onSelection event | (Optional)
        console.log(feedback.selection.value);
    }
});

/* Ratings */
(() => {
    let ratings_btn = document.querySelector('#ratings .ratings-btn');
    if (ratings_btn) {
        let close_btn = document.querySelector('#ratings .close-btn');
        let ratings_popup = document.querySelector('.ratings-popup');
        let ratings_submit = document.querySelector('#ratings .ratings-submit');

        ratings_btn.addEventListener('click', (event) => {
            ratings_popup.classList.toggle('visible')
        });

        close_btn.addEventListener('click', (event) => {
            ratings_popup.classList.remove('visible')
        });

        ratings_submit.addEventListener('click', (event) => {
            // todo: create api and send ajax call with rating value
            let rating_value = event.target.dataset.rating;
            console.log(rating_value);
        });
    }
})();

/* Range Slider */

$(".price-range").ionRangeSlider({
    type: "double",
    min: 0,
    max: 1000000,
    from: 200000,
    to: 800000,
    prefix: '€ ',
    skin: "round",
    hide_min_max: true,
    onStart: function (data) {
        $('.range-from').val('€ ' + data.from);
        $('.range-to').val('€ ' + data.to);
    },
    onChange: function (data) {
        $('.range-from').val('€ ' + data.from);
        $('.range-to').val('€ ' + data.to);
    }
});


/* Bootstrap fix */
$('#filter .dropdown-menu').click(function (e) {
    e.stopPropagation();
});
