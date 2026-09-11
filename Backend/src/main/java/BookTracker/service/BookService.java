package BookTracker.service;

import BookTracker.exception.BookNotFoundException;
import BookTracker.model.Book;
import BookTracker.repository.BookRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;


// BOOK SERVICE
@Service
public class BookService {

    private final BookRepository bookRepository;


    // CONSTRUCTOR
    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }


    // GET ALL BOOKS
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }


    // GET BOOK BY ID
    public Book getBookById(Long id) {

        return bookRepository.findById(id)
                .orElseThrow(
                        () -> new BookNotFoundException(
                                "Book not found with id: " + id
                        )
                );
    }


    // UPDATE BOOK
    public Book updateBook(Long id, Book updatedBook) {

        Book existingBook = bookRepository.findById(id)
                .orElseThrow(
                        () -> new BookNotFoundException(
                                "Book not found with id: " + id
                        )
                );


        // STORE OLD STATUS
        String previousStatus = existingBook.getStatus();


        // UPDATE BOOK DETAILS
        existingBook.setTitle(updatedBook.getTitle());
        existingBook.setAuthor(updatedBook.getAuthor());
        existingBook.setStatus(updatedBook.getStatus());
        existingBook.setCurrentPage(updatedBook.getCurrentPage());
        existingBook.setTotalPages(updatedBook.getTotalPages());
        existingBook.setCover(updatedBook.getCover());


        // FINISHED DATE LOGIC

        // If book becomes finished for the first time,
        // save today's date
        if (
                "finished".equals(updatedBook.getStatus())
                        && !"finished".equals(previousStatus)
        ) {

            existingBook.setFinishedDate(LocalDate.now());
        }


        // If book is changed from finished
        // back to another status, remove finished date
        if (
                !"finished".equals(updatedBook.getStatus())
                        && "finished".equals(previousStatus)
        ) {

            existingBook.setFinishedDate(null);
        }


        return bookRepository.save(existingBook);
    }


    // DELETE BOOK
    public void deleteBook(Long id) {

        if (!bookRepository.existsById(id)) {

            throw new BookNotFoundException(
                    "Book not found with id: " + id
            );
        }

        bookRepository.deleteById(id);
    }


    // ADD BOOK
    public Book addBook(Book book) {

        // If a new book is added as finished,
        // save today's date automatically
        if ("finished".equals(book.getStatus())) {
            book.setFinishedDate(LocalDate.now());
        }

        return bookRepository.save(book);
    }
}