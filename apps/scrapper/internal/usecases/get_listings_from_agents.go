package usecases

import (
	"fmt"
	"scrapper/config"
	"scrapper/internal/structs"
	"strconv"
)

func GetListingsFromAgents() ([]structs.ListingItem, error) {
	client, err := config.SupabaseClient()
	if err != nil {
		fmt.Println("cannot initalize client supabase", err)
		return nil, err
	}

	var results = []structs.ListingItem{}
	emptyId := 0
	err = client.DB.From("scrapped_listings").Select("*").Not().Eq("agent_id", strconv.Itoa(emptyId)).Execute(&results)
	if err != nil {
		fmt.Println("cannot get listings from database", err)
		return nil, err
	}

	return results, nil
}
