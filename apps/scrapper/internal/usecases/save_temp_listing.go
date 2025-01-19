package usecases

import (
	"errors"
	"fmt"
	"scrapper/internal/repositories"
	"scrapper/internal/structs"
)

func SaveTempListing(listingItem structs.ListingItem) (bool, error) {
	listing := structs.NewListingItem(listingItem)

	listingFound, _ := GetListing(listing.Id)

	if listingFound != nil {
		return false, errors.New("listing already in database")
	}

	_, err := repositories.SaveOneTemp(listing)

	if err != nil {
		fmt.Println("Cannot save listing", err)
		return false, err
	}
	return true, nil
}
