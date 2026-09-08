package BookTracker.repository;

import BookTracker.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;

// BOOK REPOSITORY
public interface BookRepository extends JpaRepository<Book, Long> {
}