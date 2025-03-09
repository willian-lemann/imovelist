package config

import (
	"database/sql"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

var DB *sql.DB

func DatabaseConfig() (*sql.DB, error) {
	DB, err := sql.Open("sqlite3", "../database/production.db")
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	err = DB.Ping()
	if err != nil {
		log.Fatal("Database is not reachable:", err)
	}

	// err := godotenv.Load()
	// if err != nil {
	// 	log.Fatalf("Error loading .env file %s", err)
	// }

	// supabaseUrl := os.Getenv("SUPABASE_URL")
	// supabaseKey := os.Getenv("SUPABASE_ANON_KEY")
	// client := supa.CreateClient(supabaseUrl, supabaseKey)
	return DB, nil
}
