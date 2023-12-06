function handleSubmit(e) {
  e.preventDefault();
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = document.getElementById("inputBookYear").value;
  const isComplete = document.getElementById("inputBookIsComplete").checked;
  const currentYear = new Date().getFullYear();


  if (year.length !== 4 || year > currentYear) {
    document.getElementById("yearError").innerText =
      "Tolong masukkan 4 digit numerik sampai tahun sekarang";
  } else if (/[-!@#$%^&*()_+={}[\]:;<>,.?/~\\]/.test(year) || year < 0) {
    document.getElementById("yearError").innerText =
      "Tidak boleh memasukkan karakter selain angka";
  } else {
    document.getElementById("yearError").innerText = "";

    const book = {
      id: generateId(),
      title: title,
      author: author,
      year: Number(year),
      isComplete: isComplete,
    };

    const existingBooks = JSON.parse(localStorage.getItem("books")) || [];
    existingBooks.push(book);

    localStorage.setItem("books", JSON.stringify(existingBooks));

    document.getElementById("inputBookTitle").value = "";
    document.getElementById("inputBookAuthor").value = "";
    document.getElementById("inputBookYear").value = "";
    document.getElementById("inputBookIsComplete").checked = false;
    displayBooks(existingBooks);
  }
}

function handleIsCompleteChange() {
  updateBookStatus();
}

function updateBookStatus() {
  const isComplete = document.getElementById("inputBookIsComplete").checked;
  const bookStatus = document.getElementById("bookStatus");
  bookStatus.textContent = isComplete
    ? "Sudah selesai dibaca"
    : "Belum selesai dibaca";
}

function displayBooks(books) {
  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );
  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );

  incompleteBookshelfList.innerHTML = "";
  completeBookshelfList.innerHTML = "";

  books.forEach((book) => {
    const bookArticle = document.createElement("article");
    bookArticle.classList.add("book_item");
    bookArticle.innerHTML = `<h3>${book.title}</h3>
            <p>Penulis: ${book.author}</p>
            <p>Tahun: ${book.year}</p>

            <div class="action">
              <button class="green" onclick="handleClickFinished(${book.id})">${
      book.isComplete ? "Belum Selesai" : "Sudah Selesai"
    }</button>
              <button class="red" onclick="handleClickRemoved(${
                book.id
              })">Hapus buku</button>
            </div>`;
    book.isComplete
      ? completeBookshelfList.appendChild(bookArticle)
      : incompleteBookshelfList.appendChild(bookArticle);
  });
}

function handleClickFinished(bookId) {
  const existingBooks = JSON.parse(localStorage.getItem("books")) || [];
  const updatedBooks = existingBooks.map((book) => {
    if (book.id === bookId) {
      book.isComplete = !book.isComplete;
    }
    return book;
  });

  localStorage.setItem("books", JSON.stringify(updatedBooks));
  displayBooks(updatedBooks);
}

function handleClickRemoved(bookId) {
  const existingBooks = JSON.parse(localStorage.getItem("books")) || [];
  const updatedBooks = existingBooks.filter((book) => book.id !== bookId);
  localStorage.setItem("books", JSON.stringify(updatedBooks));
  displayBooks(updatedBooks);
}

function searchBook(e) {
  e.preventDefault();
  const searchBookTitle = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();
  const existingBooks = JSON.parse(localStorage.getItem("books")) || [];
  const filteredBooks = existingBooks.filter((book) => {
    return book.title.toLowerCase().includes(searchBookTitle);
  });
  displayBooks(filteredBooks);
}

function generateId() {
  return Math.floor(Math.random() * 10000000000);
}

// Call the displayBooks function when the page loads
window.onload = function () {
  const existingBooks = JSON.parse(localStorage.getItem("books")) || [];
  displayBooks(existingBooks);
};
