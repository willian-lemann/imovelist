package repositories

import (
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

func SaveOneTemp(listingItem *structs.ListingItem) (bool, error) {
	client, err := config.SupabaseClient()
	if err != nil {
		return false, err
	}

	var results []structs.ListingItem
	err = client.DB.From("temp_agents_listings").Upsert(listingItem).Execute(&results)
	if err != nil {
		return false, err
	}
	return true, nil
}

func GetListingsImages() []structs.ListingItem {
	client, err := config.SupabaseClient()
	if err != nil {
		return nil
	}

	var listings = []structs.ListingItem{}

	err = client.DB.From("scrapped_listings").Select("*").Execute(&listings)
	if err != nil {
		return nil
	}

	return listings
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

	var results []structs.ListingItem

	err = client.DB.From("scrapped_listings").Delete().Eq("id", strconv.Itoa(id)).Execute(&results)
	if err != nil {
		return false, err
	}

	return true, nil
}
