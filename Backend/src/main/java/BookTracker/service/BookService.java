package BookTracker.service;

import BookTracker.model.Book;
import BookTracker.repository.BookRepository;
import org.springframework.stereotype.Service;
import BookTracker.exception.BookNotFoundException;

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
            .orElseThrow(() -> new BookNotFoundException("Book not found with id: " + id));
}

// UPDATE BOOK
public Book updateBook(Long id, Book updatedBook) {

    Book existingBook = bookRepository.findById(id).orElse(null);

    if (existingBook == null) {
        return null;
    }

    existingBook.setTitle(updatedBook.getTitle());
    existingBook.setAuthor(updatedBook.getAuthor());
    existingBook.setStatus(updatedBook.getStatus());
    existingBook.setCurrentPage(updatedBook.getCurrentPage());
    existingBook.setTotalPages(updatedBook.getTotalPages());

    return bookRepository.save(existingBook);
}

// DELETE BOOK
public void deleteBook(Long id) {

    if (!bookRepository.existsById(id)) {
        throw new BookNotFoundException("Book not found with id: " + id);
    }

    bookRepository.deleteById(id);
}

    // ADD BOOK
    public Book addBook(Book book) {
        return bookRepository.save(book);
    }
}