package usecases

import (
	"errors"
	"fmt"
	"scrapper/internal/repositories"
	"scrapper/internal/structs"
)

func SaveListing(listingItem structs.ListingItem) (bool, error) {
	listing := structs.NewListingItem(listingItem)

	listingFound, _ := GetListing(listing.Id)

	if listingFound != nil {
		return false, errors.New("listing already in database")
	}

	_, err := repositories.SaveOne(listing)

	if err != nil {
		fmt.Println("Cannot save listing", err)
		return false, err
	}
	return true, nil
}
