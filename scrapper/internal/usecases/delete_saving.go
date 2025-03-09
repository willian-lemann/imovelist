package usecases

import "scrapper/internal/repositories"

func DeleteSaving(id int) (bool, error) {
	deleted, err := repositories.Delete(id)
	if err != nil {
		return deleted, err
	}
	return deleted, nil
}
