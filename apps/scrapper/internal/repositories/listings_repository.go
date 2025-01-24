package repositories

import (
	"fmt"
	"scrapper/config"
	"scrapper/internal/structs"
	"strconv"

	supa "github.com/nedpals/supabase-go"
)

type ListingsRepository struct {
	db *supa.Client
}

func NewListingsRepository(db *supa.Client) *ListingsRepository {
	return &ListingsRepository{
		db: db,
	}
}

func GetAll() ([]structs.ListingItem, error) {
	client, err := config.SupabaseClient()
	if err != nil {
		fmt.Println("cannot initalize client supabase", err)
		return nil, err
	}

	var results = []structs.ListingItem{}

	err = client.DB.From("scrapped_listings").Select("*").Execute(&results)
	if err != nil {
		fmt.Println("cannot get listings from database", err)
		return nil, err
	}

	return results, nil
}

func Save(scrappedListings []structs.ListingItem) (bool, error) {
	client, err := config.SupabaseClient()
	if err != nil {
		return false, err
	}

	var results []structs.ListingItem
	for _, scrappedListing := range scrappedListings {
		err = client.DB.From("scrapped_listings").Upsert(scrappedListing).Execute(&results)
		if err != nil {
			return false, err
		}
	}
	return true, nil
}

func SaveOne(listingItem *structs.ListingItem) (bool, error) {
	client, err := config.SupabaseClient()
	if err != nil {
		return false, err
	}

	var results []structs.ListingItem
	err = client.DB.From("scrapped_listings").Upsert(listingItem).Execute(&results)
	if err != nil {
		return false, err
	}
	return true, nil
}

type UpdateData struct {
	Id               int
	PlaceholderImage string
}

func Update(data structs.ListingItem) (bool, error) {
	client, err := config.SupabaseClient()
	if err != nil {
		return false, err
	}

	var listings = []structs.ListingItem{}
	err = client.DB.From("scrapped_listings").Update(data).Eq("id", strconv.Itoa(data.Id)).Execute(&listings)
	if err != nil {
		return false, nil
	}

	return true, nil
}

func Delete(id int) (bool, error) {
	client, err := config.SupabaseClient()
	if err != nil {
		return false, err
	}

	var results []structs.ListingItem

	err = client.DB.From("listings").Delete().Eq("id", strconv.Itoa(id)).Execute(&results)
	if err != nil {
		return false, err
	}

	return true, nil
}
