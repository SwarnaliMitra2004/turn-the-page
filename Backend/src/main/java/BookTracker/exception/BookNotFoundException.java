package BookTracker.exception;

// BOOK NOT FOUND EXCEPTION
public class BookNotFoundException extends RuntimeException {

    public BookNotFoundException(String message) {
        super(message);
    }
}