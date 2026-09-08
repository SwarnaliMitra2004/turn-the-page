package BookTracker.controller;

import BookTracker.model.Book;
import BookTracker.service.BookService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

// BOOK CONTROLLER
@CrossOrigin(origins = "http://localhost:63342")
@RestController
public class BookController {

    private final BookService bookService;

    // CONSTRUCTOR
    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    // GET ALL BOOKS
    @GetMapping("/books")
    public List<Book> getBooks() {
        return bookService.getAllBooks();
    }

    // ADD BOOK
    @PostMapping("/books")
    public Book addBook(@RequestBody Book book) {
        return bookService.addBook(book);
    }

    // GET BOOK BY ID
    @GetMapping("/books/{id}")
    public Book getBookById(@PathVariable Long id) {
        return bookService.getBookById(id);
    }

    // UPDATE BOOK
    @PutMapping("/books/{id}")
    public Book updateBook(
            @PathVariable Long id,
            @RequestBody Book updatedBook
    ) {
        return bookService.updateBook(id, updatedBook);
    }

    // DELETE BOOK
    @DeleteMapping("/books/{id}")
    public void deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
    }
}