package usecases

import (
	"fmt"
	"scrapper/config"

	"scrapper/internal/structs"
)

func GetTempListings() ([]structs.ListingItem, error) {
	client, err := config.SupabaseClient()
	if err != nil {
		fmt.Println("cannot initalize client supabase", err)
		return nil, err
	}

	var results = []structs.ListingItem{}

	err = client.DB.From("temp_agents_listings").Select("*").Execute(&results)
	if err != nil {
		fmt.Println("cannot get temp listings from database", err)
		return nil, err
	}

	return results, nil
}
