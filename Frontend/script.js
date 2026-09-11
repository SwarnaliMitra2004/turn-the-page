// PAGE ELEMENTS
const dashboardPage = document.getElementById("dashboard-page");
const libraryPage = document.getElementById("library-page");
const addBookPage = document.getElementById("add-book-page");


// DASHBOARD STAT CARDS
const totalBooksCard = document.getElementById("total-books-card");
const readingCard = document.getElementById("reading-card");
const finishedCard = document.getElementById("finished-card");
const wantToReadCard = document.getElementById("want-to-read-card");


// NAVIGATION BUTTONS
const dashboardBtn = document.getElementById("dashboard-btn");
const libraryBtn = document.getElementById("library-btn");
const addBookBtn = document.getElementById("add-book-nav-btn");
const viewAllBtn = document.getElementById("view-all-btn");


// FORM AND SEARCH
const bookForm = document.getElementById("book-form");
const searchInput = document.getElementById("search-input");


// APP STATE
let currentFilter = "all";
let editingBookId = null;
let books = [];

// STORES THE READING JOURNEY CHART
let readingChart = null;


// NAVIGATION
dashboardBtn.addEventListener("click", function () {

    // SAVE CURRENT PAGE IN URL
    window.location.hash = "dashboard";

    dashboardPage.classList.remove("hidden");
    libraryPage.classList.add("hidden");
    addBookPage.classList.add("hidden");
});


libraryBtn.addEventListener("click", function () {

    // SAVE CURRENT PAGE IN URL
    window.location.hash = "library";

    dashboardPage.classList.add("hidden");
    addBookPage.classList.add("hidden");
    libraryPage.classList.remove("hidden");

    currentFilter = "all";

    setActiveFilter("all");

    displayLibrary(
        "all",
        searchInput.value.trim()
    );
});


// CURRENTLY READING CARD
readingCard.addEventListener("click", function () {

    // SAVE CURRENT PAGE IN URL
    window.location.hash = "library";

    // OPEN MY LIBRARY
    dashboardPage.classList.add("hidden");
    addBookPage.classList.add("hidden");
    libraryPage.classList.remove("hidden");

    // SHOW CURRENTLY READING BOOKS
    currentFilter = "reading";

    setActiveFilter("reading");

    displayLibrary(
        "reading",
        searchInput.value.trim()
    );
});


// FINISHED CARD
finishedCard.addEventListener("click", function () {

    // SAVE CURRENT PAGE IN URL
    window.location.hash = "library";

    // OPEN MY LIBRARY
    dashboardPage.classList.add("hidden");
    addBookPage.classList.add("hidden");
    libraryPage.classList.remove("hidden");

    // SHOW FINISHED BOOKS
    currentFilter = "finished";

    setActiveFilter("finished");

    displayLibrary(
        "finished",
        searchInput.value.trim()
    );
});


// WANT TO READ CARD
wantToReadCard.addEventListener("click", function () {

    // SAVE CURRENT PAGE IN URL
    window.location.hash = "library";

    // OPEN MY LIBRARY
    dashboardPage.classList.add("hidden");
    addBookPage.classList.add("hidden");
    libraryPage.classList.remove("hidden");

    // SHOW WANT TO READ BOOKS
    currentFilter = "want-to-read";

    setActiveFilter("want-to-read");

    displayLibrary(
        "want-to-read",
        searchInput.value.trim()
    );
});


// ADD BOOK NAVIGATION
addBookBtn.addEventListener("click", function () {

    // SAVE CURRENT PAGE IN URL
    window.location.hash = "add-book";

    // RESET EDIT MODE
    editingBookId = null;

    bookForm.reset();

    document.querySelector("#add-book-page h2").textContent =
        "Add a Book 📖";

    document.querySelector(".add-book-btn").textContent =
        "+ Add Book";

    dashboardPage.classList.add("hidden");
    libraryPage.classList.add("hidden");
    addBookPage.classList.remove("hidden");
});


// VIEW ALL CURRENTLY READING
viewAllBtn.addEventListener("click", function () {

    // SAVE CURRENT PAGE IN URL
    window.location.hash = "library";

    dashboardPage.classList.add("hidden");
    addBookPage.classList.add("hidden");
    libraryPage.classList.remove("hidden");

    currentFilter = "reading";

    setActiveFilter("reading");

    displayLibrary(
        "reading",
        searchInput.value.trim()
    );
});


// TOTAL BOOKS CARD
totalBooksCard.addEventListener("click", function () {

    // SAVE CURRENT PAGE IN URL
    window.location.hash = "library";

    // OPEN MY LIBRARY
    dashboardPage.classList.add("hidden");
    addBookPage.classList.add("hidden");
    libraryPage.classList.remove("hidden");

    // SHOW ALL BOOKS
    currentFilter = "all";

    setActiveFilter("all");

    displayLibrary(
        "all",
        searchInput.value.trim()
    );
});


// ADD OR EDIT BOOK
bookForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    // GET FORM VALUES
    const title =
        document.getElementById("title").value.trim();

    const author =
        document.getElementById("author").value.trim();

    const totalPages =
        Number(document.getElementById("total-pages").value);

    const currentPage =
        Number(document.getElementById("current-page").value);

    let status =
        document.getElementById("status").value;

    const cover =
        document.getElementById("cover").value.trim();


    // VALIDATION
    if (currentPage > totalPages) {

        alert(
            "Current page cannot be greater than total pages."
        );

        return;
    }


    if (currentPage < 0) {

        alert(
            "Current page cannot be negative."
        );

        return;
    }


    // AUTO FINISH
    if (currentPage === totalPages) {
        status = "finished";
    }


    let finalCurrentPage = currentPage;


    if (status === "finished") {
        finalCurrentPage = totalPages;
    }


    // ADD NEW BOOK
    if (editingBookId === null) {

        const book = {
            title: title,
            author: author,
            totalPages: totalPages,
            currentPage: finalCurrentPage,
            status: status,
            cover: cover
        };


        try {

            const response =
                await fetch(
                    "http://localhost:8080/books",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify(book)
                    }
                );


            // CHECK IF BACKEND REQUEST FAILED
            if (!response.ok) {

                throw new Error(
                    "Failed to add book."
                );
            }


            const savedBook =
                await response.json();


            books.push(savedBook);


            alert(
                `"${savedBook.title}" added successfully! 📚`
            );


        } catch (error) {

            console.error(
                "Error adding book:",
                error
            );

            alert(
                "Could not add book."
            );

            return;
        }
    }


    // EDIT EXISTING BOOK
    else {

        const updatedBook = {
            title: title,
            author: author,
            totalPages: totalPages,
            currentPage: finalCurrentPage,
            status: status,
            cover: cover
        };


        try {

            const response =
                await fetch(
                    `http://localhost:8080/books/${editingBookId}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(updatedBook)
                    }
                );


            // CHECK IF BACKEND REQUEST FAILED
            if (!response.ok) {

                throw new Error(
                    "Failed to update book."
                );
            }


            const savedBook =
                await response.json();


            const index =
                books.findIndex(
                    function (book) {

                        return book.id ===
                            editingBookId;
                    }
                );


            books[index] = savedBook;


            alert(
                `"${savedBook.title}" updated successfully! ✏️`
            );


            editingBookId = null;


        } catch (error) {

            console.error(
                "Error updating book:",
                error
            );

            alert(
                "Could not update book."
            );

            return;
        }
    }


    // UPDATE APP
    displayCurrentlyReading();

    displayLibrary(
        currentFilter,
        searchInput.value.trim()
    );

    updateStats();

    displayReadingJourney();


    // RESET FORM
    bookForm.reset();


    document.querySelector(
        "#add-book-page h2"
    ).textContent =
        "Add a Book 📖";


    document.querySelector(
        ".add-book-btn"
    ).textContent =
        "+ Add Book";


    // RETURN TO DASHBOARD
    window.location.hash = "dashboard";

    addBookPage.classList.add("hidden");
    libraryPage.classList.add("hidden");
    dashboardPage.classList.remove("hidden");
});


// CALCULATE PROGRESS
function calculateProgress(book) {

    if (book.totalPages <= 0) {
        return 0;
    }

    return Math.round(
        (book.currentPage / book.totalPages) * 100
    );
}

// OPEN WANT TO READ FROM EMPTY STATE
function openLibraryFromEmptyState() {

    // SAVE CURRENT PAGE IN URL
    window.location.hash = "library";


    // OPEN MY LIBRARY
    dashboardPage.classList.add("hidden");
    addBookPage.classList.add("hidden");
    libraryPage.classList.remove("hidden");


    // SHOW WANT TO READ BOOKS
    currentFilter = "want-to-read";


    setActiveFilter(
        "want-to-read"
    );


    displayLibrary(
        "want-to-read",
        searchInput.value.trim()
    );
}

// DISPLAY CURRENTLY READING
function displayCurrentlyReading() {

    const readingList =
        document.getElementById(
            "currently-reading-list"
        );


    readingList.innerHTML = "";


    const currentlyReading =
        books.filter(function (book) {

            return book.status === "reading";
        });


// EMPTY STATE
if (currentlyReading.length === 0) {

    readingList.innerHTML = `
        <div class="reading-empty-state">

            <div class="empty-book-icon">
                📖
            </div>

            <h3>
                Your next chapter starts here.
            </h3>

            <p>
                You're not currently reading anything.
                Browse your library and choose your next book.
            </p>

            <button
                class="browse-library-btn"
                onclick="openLibraryFromEmptyState()"
            >
                Browse Library
            </button>

        </div>
    `;

    return;
}


    // CREATE BOOK CARDS
    currentlyReading.forEach(function (book) {

        const progress =
            calculateProgress(book);


        readingList.innerHTML += `
            <div class="book-card">

                <!-- BOOK COVER -->

                <div class="book-cover">

                    ${
                        book.cover
                            ? `<img src="${book.cover}" alt="${book.title}">`
                            : "📖"
                    }

                </div>


                <!-- BOOK INFO -->

                <div class="book-info">

                    <h3>
                        ${book.title}
                    </h3>

                    <p>
                        ${book.author}
                    </p>


                    <!-- PROGRESS -->

                    <div class="progress-info">

                        <span>
                            ${book.currentPage} /
                            ${book.totalPages} pages
                        </span>

                        <span>
                            ${progress}%
                        </span>

                    </div>


                    <div class="progress-bar">

                        <div
                            class="progress"
                            style="width: ${progress}%"
                        ></div>

                    </div>

                </div>

            </div>
        `;
    });
}


// DISPLAY LIBRARY
function displayLibrary(
    filter = currentFilter,
    searchText = ""
) {

    const libraryList =
        document.getElementById(
            "library-list"
        );


    libraryList.innerHTML = "";


    let booksToShow = books;


    // FILTER BY STATUS
    if (filter !== "all") {

        booksToShow =
            booksToShow.filter(
                function (book) {

                    return book.status === filter;
                }
            );
    }


    // FILTER BY SEARCH
    if (searchText !== "") {

        const search =
            searchText.toLowerCase();


        booksToShow =
            booksToShow.filter(
                function (book) {

                    const title =
                        book.title.toLowerCase();

                    const author =
                        book.author.toLowerCase();


                    return (
                        title.includes(search) ||
                        author.includes(search)
                    );
                }
            );
    }


    // EMPTY STATE
    if (booksToShow.length === 0) {

        libraryList.innerHTML = `
            <p class="empty-message">
                No matching books found. 📚
            </p>
        `;

        return;
    }


    // CREATE BOOK CARDS
    booksToShow.forEach(function (book) {

        const progress =
            calculateProgress(book);


        let statusText = "";


        if (book.status === "reading") {

            statusText =
                "Currently Reading";

        } else if (
            book.status === "finished"
        ) {

            statusText =
                "Finished";

        } else {

            statusText =
                "Want to Read";
        }


        libraryList.innerHTML += `
            <div class="book-card">

                <!-- BOOK COVER -->

                <div class="book-cover">

                    ${
                        book.cover
                            ? `<img src="${book.cover}" alt="${book.title}">`
                            : "📖"
                    }

                </div>


                <!-- BOOK INFO -->

                <div class="book-info">

                    <h3>
                        ${book.title}
                    </h3>

                    <p>
                        ${book.author}
                    </p>


                    <p class="book-status">
                        ${statusText}
                    </p>


                    <!-- PROGRESS -->

                    <div class="progress-info">

                        <span>
                            ${book.currentPage} /
                            ${book.totalPages} pages
                        </span>

                        <span>
                            ${progress}%
                        </span>

                    </div>


                    <div class="progress-bar">

                        <div
                            class="progress"
                            style="width: ${progress}%"
                        ></div>

                    </div>


                    <!-- UPDATE PROGRESS -->

                    ${
                        book.status === "reading"
                            ? `
                                <button
                                    class="update-progress-btn"
                                    onclick="updateProgress(${book.id})"
                                >
                                    Update Progress
                                </button>
                              `
                            : ""
                    }


                    <!-- EDIT BOOK -->

                    <button
                        class="edit-book-btn"
                        onclick="editBook(${book.id})"
                    >
                        ✏ Edit
                    </button>


                    <!-- DELETE BOOK -->

                    <button
                        class="delete-book-btn"
                        onclick="deleteBook(${book.id})"
                    >
                        🗑 Delete
                    </button>

                </div>

            </div>
        `;
    });
}


// UPDATE PROGRESS
async function updateProgress(bookId) {

    const book =
        books.find(function (book) {

            return book.id === bookId;
        });


    if (!book) {

        alert(
            "Book not found."
        );

        return;
    }


    const newPage =
        prompt(
            `What page are you on in "${book.title}"?`,
            book.currentPage
        );


    if (newPage === null) {
        return;
    }


    const pageNumber =
        Number(newPage);


    // VALIDATION
    if (
        isNaN(pageNumber) ||
        pageNumber < 0 ||
        pageNumber > book.totalPages
    ) {

        alert(
            `Please enter a page between 0 and ${book.totalPages}.`
        );

        return;
    }


    // UPDATE PAGE
    book.currentPage =
        pageNumber;


    // AUTO FINISH
    if (
        pageNumber === book.totalPages
    ) {

        book.status =
            "finished";
    }


    try {

        const response =
            await fetch(
                `http://localhost:8080/books/${bookId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(book)
                }
            );


        // CHECK IF BACKEND REQUEST FAILED
        if (!response.ok) {

            throw new Error(
                "Failed to update progress."
            );
        }


        const updatedBook =
            await response.json();


        const index =
            books.findIndex(
                function (book) {

                    return book.id === bookId;
                }
            );


        books[index] =
            updatedBook;


    } catch (error) {

        console.error(
            "Error updating progress:",
            error
        );

        alert(
            "Could not update reading progress."
        );

        return;
    }


    // REFRESH APP
    displayCurrentlyReading();

    displayLibrary(
        currentFilter,
        searchInput.value.trim()
    );

    updateStats();

    displayReadingJourney();


    alert(
        "Reading progress updated! 📖"
    );
}


// EDIT BOOK
function editBook(bookId) {

    const book =
        books.find(function (book) {

            return book.id === bookId;
        });


    if (!book) {

        alert(
            "Book not found."
        );

        return;
    }


    // STORE BOOK ID
    editingBookId =
        bookId;


    // FILL FORM
    document.getElementById("title").value =
        book.title;

    document.getElementById("author").value =
        book.author;

    document.getElementById("total-pages").value =
        book.totalPages;

    document.getElementById("current-page").value =
        book.currentPage;

    document.getElementById("status").value =
        book.status;

    document.getElementById("cover").value =
        book.cover || "";


    // CHANGE FORM TO EDIT MODE
    document.querySelector(
        "#add-book-page h2"
    ).textContent =
        "Edit Book ✏️";


    document.querySelector(
        ".add-book-btn"
    ).textContent =
        "Save Changes";


    // OPEN FORM
    dashboardPage.classList.add("hidden");
    libraryPage.classList.add("hidden");
    addBookPage.classList.remove("hidden");
}


// DELETE BOOK
async function deleteBook(bookId) {

    const book =
        books.find(function (book) {

            return book.id === bookId;
        });


    if (!book) {

        alert(
            "Book not found."
        );

        return;
    }


    // CONFIRM DELETE
    const shouldDelete =
        confirm(
            `Are you sure you want to delete "${book.title}"?`
        );


    if (!shouldDelete) {
        return;
    }


    try {

        const response =
            await fetch(
                `http://localhost:8080/books/${bookId}`,
                {
                    method: "DELETE"
                }
            );


        // CHECK IF BACKEND REQUEST FAILED
        if (!response.ok) {

            throw new Error(
                "Failed to delete book."
            );
        }


    } catch (error) {

        console.error(
            "Error deleting book:",
            error
        );

        alert(
            "Could not delete book."
        );

        return;
    }


    // REMOVE BOOK
    books =
        books.filter(
            function (book) {

                return book.id !== bookId;
            }
        );


    // REFRESH APP
    displayCurrentlyReading();

    displayLibrary(
        currentFilter,
        searchInput.value.trim()
    );

    updateStats();

    displayReadingJourney();


    alert(
        `"${book.title}" deleted.`
    );
}


// DASHBOARD STATS
function updateStats() {

    const totalBooks =
        books.length;


    const readingCount =
        books.filter(
            function (book) {

                return book.status === "reading";
            }
        ).length;


    const finishedCount =
        books.filter(
            function (book) {

                return book.status === "finished";
            }
        ).length;


    const wantCount =
        books.filter(
            function (book) {

                return book.status === "want-to-read";
            }
        ).length;


    document.getElementById(
        "total-books"
    ).textContent =
        totalBooks;


    document.getElementById(
        "reading-count"
    ).textContent =
        readingCount;


    document.getElementById(
        "finished-count"
    ).textContent =
        finishedCount;


    document.getElementById(
        "want-count"
    ).textContent =
        wantCount;
}


// READING JOURNEY - MONTHLY FINISHED BOOKS
function getMonthlyFinishedBooks() {

    // CREATE 12 MONTH COUNTERS
    // INDEX 0 = JANUARY
    // INDEX 11 = DECEMBER
    const monthlyFinished = [
        0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0
    ];


    // GET CURRENT YEAR
    const currentYear =
        new Date().getFullYear();


    books.forEach(function (book) {

        // IGNORE BOOKS WITHOUT FINISHED DATE
        if (!book.finishedDate) {
            return;
        }


        // CONVERT FINISHED DATE INTO JAVASCRIPT DATE
        const finishedDate =
            new Date(book.finishedDate);


        // ONLY COUNT BOOKS FINISHED THIS YEAR
        if (
            finishedDate.getFullYear() !==
            currentYear
        ) {

            return;
        }


        // GET MONTH
        // JANUARY = 0
        // FEBRUARY = 1
        // ...
        // DECEMBER = 11
        const month =
            finishedDate.getMonth();


        // ADD ONE BOOK TO THAT MONTH
        monthlyFinished[month]++;
    });


    return monthlyFinished;
}


// DISPLAY READING JOURNEY CHART
function displayReadingJourney() {

    // GET MONTHLY FINISHED BOOK COUNTS
    const monthlyFinished =
        getMonthlyFinishedBooks();


    // GET CHART CANVAS
    const chartCanvas =
        document.getElementById(
            "reading-chart"
        );


    // MONTH LABELS
    const monthLabels = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ];


    // REMOVE OLD CHART BEFORE CREATING A NEW ONE
    if (readingChart !== null) {

        readingChart.destroy();
    }


    // CREATE LINE CHART
    readingChart =
        new Chart(
            chartCanvas,
            {

                type: "line",


                data: {

                    labels:
                        monthLabels,


                    datasets: [
                        {

                            label:
                                "Books Finished",

                            data:
                                monthlyFinished,


                            // SAGE GREEN LINE
                            borderColor:
                                "#7E8B74",


                            // SOFT SAGE AREA BELOW LINE
                            backgroundColor:
                                "rgba(126, 139, 116, 0.14)",


                            // DARK SAGE DATA POINTS
                            pointBackgroundColor:
                                "#5E6A56",


                            // CREAM BORDER AROUND POINTS
                            pointBorderColor:
                                "#FFFDF9",

                            pointBorderWidth: 2,


                            // SMOOTH LINE
                            tension: 0.4,


                            // FILL AREA BELOW LINE
                            fill: true,


                            // LINE WIDTH
                            borderWidth: 3,


                            // DATA POINT SIZE
                            pointRadius: 4,


                            // DATA POINT SIZE ON HOVER
                            pointHoverRadius: 6
                        }
                    ]
                },


                options: {

                    // RESPONSIVE CHART
                    responsive: true,


                    // USE HEIGHT FROM CSS CONTAINER
                    maintainAspectRatio: false,


                    plugins: {

                        // HIDE DEFAULT LEGEND
                        legend: {
                            display: false
                        },


                        // CUSTOM TOOLTIP
                        tooltip: {

                            callbacks: {

                                label:
                                    function (context) {

                                        const count =
                                            context.raw;


                                        if (count === 1) {

                                            return "1 book finished";
                                        }


                                        return `${count} books finished`;
                                    }
                            }
                        }
                    },

                    scales: {

                        // HORIZONTAL MONTH AXIS
                        x: {

                            // REMOVE VERTICAL GRID LINES
                            grid: {
                                display: false
                            },

                            // STYLE MONTH LABELS
                            ticks: {
                                color: "#777E72",
                                font: {
                                    family: "DM Sans",
                                    size: 12
                                }
                            },

                            // SOFT AXIS BORDER
                            border: {
                                color: "#E5DED3"
                            }
                        },


                        // VERTICAL BOOK COUNT AXIS
                        y: {

                            // START GRAPH AT ZERO
                            beginAtZero: true,

                            // SHOW ONLY WHOLE BOOK NUMBERS
                            ticks: {
                                precision: 0,
                                stepSize: 1,
                                color: "#777E72",

                                font: {
                                    family: "DM Sans",
                                    size: 12
                                }
                            },

                            // SOFT HORIZONTAL GRID LINES
                            grid: {
                                color:
                                    "rgba(126, 139, 116, 0.12)"
                            },

                            // REMOVE LEFT AXIS BORDER
                            border: {
                                display: false
                            }
                        }
                    }
                }
            }
        );
}


// FILTER BUTTONS
const filterButtons =
    document.querySelectorAll(
        ".filter-btn"
    );


filterButtons.forEach(function (button) {

    button.addEventListener(
        "click",
        function () {

            currentFilter =
                button.dataset.filter;


            setActiveFilter(
                currentFilter
            );


            const searchText =
                searchInput.value.trim();


            displayLibrary(
                currentFilter,
                searchText
            );
        }
    );
});


// ACTIVE FILTER
function setActiveFilter(filter) {

    filterButtons.forEach(
        function (button) {

            button.classList.remove(
                "active"
            );


            if (
                button.dataset.filter === filter
            ) {

                button.classList.add(
                    "active"
                );
            }
        }
    );
}


// SEARCH
searchInput.addEventListener(
    "input",
    function () {

        const searchText =
            searchInput.value.trim();


        displayLibrary(
            currentFilter,
            searchText
        );
    }
);


// LOAD BOOKS FROM BACKEND
async function loadBooks() {

    try {

        const response =
            await fetch(
                "http://localhost:8080/books"
            );


        // CHECK IF BACKEND REQUEST FAILED
        if (!response.ok) {

            throw new Error(
                "Failed to load books."
            );
        }


        books =
            await response.json();


        displayCurrentlyReading();

        displayLibrary(
            currentFilter,
            ""
        );

        updateStats();


        // DISPLAY READING JOURNEY GRAPH
        displayReadingJourney();


    } catch (error) {

        console.error(
            "Error loading books:",
            error
        );
    }
}


// INITIAL LOAD
loadBooks();


// RESTORE LIBRARY PAGE AFTER REFRESH
if (
    window.location.hash === "#library"
) {

    dashboardPage.classList.add("hidden");
    addBookPage.classList.add("hidden");
    libraryPage.classList.remove("hidden");

    currentFilter = "all";

    setActiveFilter("all");

    displayLibrary(
        "all",
        searchInput.value.trim()
    );
}


// RESTORE ADD BOOK PAGE AFTER REFRESH
if (
    window.location.hash === "#add-book"
) {

    dashboardPage.classList.add("hidden");
    libraryPage.classList.add("hidden");
    addBookPage.classList.remove("hidden");
}