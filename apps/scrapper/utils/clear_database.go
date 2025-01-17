package utils

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

func ClearDatabase() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file %s", err)
	}

	connStr := os.Getenv("DATABASE_URL")

	dbpool, err := pgxpool.New(context.Background(), connStr)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v", err)
	}
	defer dbpool.Close()

	tableName := "listings"

	query := fmt.Sprintf("TRUNCATE TABLE %s RESTART IDENTITY;", tableName)

	_, err = dbpool.Exec(context.Background(), query)
	if err != nil {
		log.Fatalf("Failed to truncate table: %v", err)
	}

	fmt.Printf("Table '%s' truncated successfully!\n", tableName)
}
