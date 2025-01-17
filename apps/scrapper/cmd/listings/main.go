package main

import (
	"fmt"
	"scrapper/internal/scrappers"
	"scrapper/utils"
	"sync"
	"time"
)

func main() {
	var wg sync.WaitGroup

	wg.Add(1)

	go func() {
		defer wg.Done()
		utils.ClearDatabase()
	}()

	wg.Wait()

	var scraperWG sync.WaitGroup
	scraperWG.Add(3)

	start := time.Now()

	go scrappers.ExecuteJefersonAlba(&scraperWG)
	go scrappers.CasaImoveisExecute(&scraperWG)
	go scrappers.ExecuteAuxPredial(&scraperWG)

	scraperWG.Wait()

	elapsed := time.Since(start)

	fmt.Println("Scraping finished")
	fmt.Println("It took:", elapsed.Seconds())
}
