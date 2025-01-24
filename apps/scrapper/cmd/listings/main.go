package main

import (
	"fmt"
	"scrapper/internal/scrappers"
	"scrapper/utils"
	"sync"
	"time"

	"github.com/robfig/cron/v3"
)

func main() {
	c := cron.New()
	c.AddFunc("0 3 * * *", func() {
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
	})
	c.Start()

	select {}
}
