package repositories

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"scrapper/config"
	"scrapper/internal/structs"

	_ "github.com/mattn/go-sqlite3"
)

type ListingsRepository struct {
	db *sql.DB
}

func NewListingsRepository(db *sql.DB) *ListingsRepository {
	return &ListingsRepository{
		db: db,
	}
}

func GetAll() ([]structs.ListingItem, error) {
	db, err := config.DatabaseConfig()
	if err != nil {
		return nil, err
	}

	query := `SELECT 
	id, link, image, address, price, area, bedrooms, bathrooms, type,
	forSale, parking, content, photos, agency, placeholderImage, ref
	FROM scrapped_listings
	`
	rows, err := db.Query(query)
	if err != nil {
		fmt.Println("Cannot get listings from database:", err)
		return nil, err
	}
	defer rows.Close()

	var results []structs.ListingItem
	var photosJSON string

	// Scan rows into structs
	for rows.Next() {
		var result structs.ListingItem
		err := rows.Scan(
			&result.Id,
			&result.Link,
			&result.Image,
			&result.Address,
			&result.Price,
			&result.Area,
			&result.Bedrooms,
			&result.Bathrooms,
			&result.Type,
			&result.ForSale,
			&result.Parking,
			&result.Content,
			&photosJSON,
			&result.Agency,
			&result.PlaceholderImage,
			&result.Ref,
		)
		if err != nil {
			fmt.Println("Error scanning row:", err)
			return nil, err
		}

		if err := json.Unmarshal([]byte(photosJSON), &result.Photos); err != nil {
			fmt.Println("Error parsing photos JSON:", err)
			return nil, err
		}

		results = append(results, result)
	}

	// Check for any errors after the loop
	if err := rows.Err(); err != nil {
		fmt.Println("Error iterating rows:", err)
		return nil, err
	}

	fmt.Println("inside get all", results)
	return results, nil
}

func Save(scrappedListings []structs.ListingItem) (bool, error) {
	db, err := config.DatabaseConfig()
	if err != nil {
		return false, err
	}

	query := "INSERT INTO scrapped_listings (Field1, Field2) VALUES (?, ?)"

	// Start a transaction
	tx, err := db.Begin()
	if err != nil {
		return false, err
	}
	defer tx.Rollback()

	// Iterate and insert each listing
	for _, scrappedListing := range scrappedListings {
		_, err := tx.Exec(query, scrappedListing) // Adjust fields accordingly
		if err != nil {
			return false, err
		}
	}

	// Commit the transaction
	err = tx.Commit()
	if err != nil {
		return false, err
	}

	return true, nil
}

func SaveOne(listingItem *structs.ListingItem, table string) (bool, error) {
	db, err := config.DatabaseConfig()
	if err != nil {
		return false, err
	}

	query := fmt.Sprintf(`INSERT INTO %s (
		Id, link, image, address, price, area, bedrooms, bathrooms, type, 
		forSale, parking, content, photos, agency, placeholderImage, ref
	) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, table)

	_, err = db.Exec(query, listingItem.Id,
		listingItem.Link,
		listingItem.Image,
		listingItem.Address,
		listingItem.Price,
		listingItem.Area,
		listingItem.Bedrooms,
		listingItem.Bathrooms,
		listingItem.Type,
		listingItem.ForSale,
		listingItem.Parking,
		listingItem.Content,
		convertPhotosToJSON(listingItem.Photos),
		listingItem.Agency,
		listingItem.PlaceholderImage,
		listingItem.Ref)
	if err != nil {
		return false, err
	}

	return true, nil
}

func Update(data structs.ListingItem) (bool, error) {

	db, err := config.DatabaseConfig()
	if err != nil {
		return false, err
	}

	query := "UPDATE scrapped_listings SET Field1 = ?, Field2 = ? WHERE id = ?"

	// Execute the update
	_, err = db.Exec(query, &data) // Adjust fields accordingly
	if err != nil {
		return false, err
	}

	return true, nil
}

func Delete(id int) (bool, error) {
	db, err := config.DatabaseConfig()
	if err != nil {
		return false, err
	}

	query := "DELETE FROM scrapped_listings WHERE id = ?"

	// Execute the delete
	_, err = db.Exec(query, id)
	if err != nil {
		return false, err
	}

	return true, nil
}

func convertPhotosToJSON(photos []structs.Photos) string {
	photosJSON, err := json.Marshal(photos)
	if err != nil {
		return ""
	}
	return string(photosJSON)
}
