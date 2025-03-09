package usecases

import (
	"database/sql"
	"fmt"
	"scrapper/config"
	"scrapper/internal/structs"

	_ "github.com/mattn/go-sqlite3"
)

func GetListing(id int) (*structs.ListingItem, error) {
	// Initialize SQLite database connection
	db, err := config.DatabaseConfig()
	// Prepare query to fetch the listing with the given ID
	query := "SELECT * FROM scrapped_listings WHERE id = ?"

	// Create a map to hold the result (column name -> value)
	row := db.QueryRow(query, id)

	// Using a map to scan the result into dynamic fields
	var result map[string]interface{}
	err = row.Scan(&result)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("no listing found with ID %d", id)
		}
		return nil, err
	}

	// Map result back into ListingItem struct if needed
	var listing structs.ListingItem
	// Map columns in `result` into `listing` fields as needed

	return &listing, nil
}
