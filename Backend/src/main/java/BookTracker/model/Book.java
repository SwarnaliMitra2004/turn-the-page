package BookTracker.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDate;


// BOOK ENTITY
@Entity
@Table(name = "books")
public class Book {

    // BOOK DETAILS

    // PRIMARY KEY
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String author;
    private String status;
    private int currentPage;
    private int totalPages;
    private String cover;
    private LocalDate finishedDate;


    // DEFAULT CONSTRUCTOR
    public Book() {
    }


    // PARAMETERIZED CONSTRUCTOR
    public Book(
            Long id,
            String title,
            String author,
            String status,
            int currentPage,
            int totalPages,
            String cover,
            LocalDate finishedDate
    ) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.status = status;
        this.currentPage = currentPage;
        this.totalPages = totalPages;
        this.cover = cover;
        this.finishedDate = finishedDate;
    }


    // GETTERS AND SETTERS

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }


    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }


    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }


    public int getCurrentPage() {
        return currentPage;
    }

    public void setCurrentPage(int currentPage) {
        this.currentPage = currentPage;
    }


    public int getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }


    // COVER

    public String getCover() {
        return cover;
    }

    public void setCover(String cover) {
        this.cover = cover;
    }


    // FINISHED DATE

    public LocalDate getFinishedDate() {
        return finishedDate;
    }

    public void setFinishedDate(LocalDate finishedDate) {
        this.finishedDate = finishedDate;
    }
}