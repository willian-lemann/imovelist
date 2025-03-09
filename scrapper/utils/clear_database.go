package utils

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"scrapper/internal/repositories"
	"scrapper/internal/usecases"

	"github.com/joho/godotenv"
	_ "github.com/mattn/go-sqlite3"
)

func ClearDatabase() {
	// Load environment variables from .env file
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file: %s", err)
	}

	// Database file path from environment variable
	dbPath := os.Getenv("DATABASE_PATH")
	if dbPath == "" {
		log.Fatal("DATABASE_PATH environment variable is not set")
	}

	// Open SQLite database connection
	db, err := sql.Open("sqlite3", "../database/production.db")
	if err != nil {
		log.Fatalf("Unable to connect to database: %v", err)
	}
	defer db.Close()

	scrappedListings, err := repositories.GetAll()
	if err != nil {
		log.Fatalf("Failed to retrieve listings: %v", err)
	}

	tableName := "scrapped_listings"
	query := fmt.Sprintf("DELETE FROM %s", tableName)
	_, err = db.Exec(query)
	if err != nil {
		log.Fatalf("Failed to truncate table: %v", err)
	}

	fmt.Println("listings in scrapped", len(scrappedListings))

	// Insert the data into the 'listings' table
	for _, listing := range scrappedListings {
		_, err := usecases.SaveListing(listing, "listings")
		if err != nil {
			log.Printf("Failed to save listing: %v", err)
		}
	}

	fmt.Printf("Listings truncated and saved successfully!\n")
}
