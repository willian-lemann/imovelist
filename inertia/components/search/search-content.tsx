import { useEffect, useState } from 'react'
import { SearchIcon, ListFilterIcon, XIcon } from 'lucide-react'
import { router } from '@inertiajs/react'

import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu'
import { Label } from '../../components/ui/label'
import { Capitalize } from '../../lib/utils'

const types = [
  { label: 'Apartamento', value: 'apartamento' },
  { label: 'Comercial', value: 'comercial' },
  { label: 'Residencial', value: 'residencial' },
]

const filters = [
  { label: 'Aluguel', value: 'aluguel' },
  { label: 'Venda', value: 'venda' },
]

export function SearchContent() {
  const params = new URLSearchParams(window.location.search)
  const [search, setSearch] = useState(params.get('q') || '')

  const hasFilters = params.has('filter') || params.has('type') || params.has('q')

  function updateURL() {
    const newUrl = `${window.location.pathname}?${params.toString()}`
    router.get(newUrl)
  }

  function handleSearch() {
    if (search) {
      params.set('q', search)
    } else {
      params.delete('q')
    }
    updateURL()
  }

  function handleFilter(filter: string) {
    params.set('filter', filter)
    params.delete('page')
    updateURL()
  }

  function handleType(type: string) {
    if (type) {
      params.set('type', type)
    } else {
      params.delete('type')
    }
    params.delete('page')
    updateURL()
  }

  function clearFilters() {
    router.get('/')
  }

  function clearQueryFilter() {
    params.delete('q')
    updateURL()
    setSearch('')
  }

  useEffect(() => {
    document.addEventListener('input', (e: any) => {
      if (!e.inputType) {
        clearQueryFilter()
      }
    })

    return () => {
      document.removeEventListener('input', (e: any) => {
        if (!e.inputType) {
          clearQueryFilter()
        }
      })
    }
  }, [])

  return (
    <>
      <div className="relative flex-1 max-w-lg flex">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Pesquise pelo nome, endereço ou código do imóvel"
          value={search}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full py-3 pl-12 pr-4 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        />

        {/* mobile filters */}
        <div className="flex md:hidden gap-1 ml-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="default" className="gap-1">
                <ListFilterIcon className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  {Capitalize(params.get('filter')) || 'Filtrar por'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {filters.map((filter) => (
                <DropdownMenuCheckboxItem
                  key={filter.value}
                  checked={params.get('filter') === filter.value}
                  onClick={() => handleFilter(filter.value)}
                >
                  {filter.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="default" className="gap-1">
                <ListFilterIcon className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  {Capitalize(params.get('type')) || 'Tipo de imóvel'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Tipo de imóvel</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {types.map((type) => (
                <DropdownMenuCheckboxItem
                  key={type.value}
                  checked={params.get('type') === type.value}
                  onClick={() => handleType(type.value)}
                >
                  {type.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Button type="button" onClick={handleSearch} className="px-6 py-3 rounded-r-lg">
        <SearchIcon className="mr-2 w-5 h-5" />
        Procurar
      </Button>

      {/* desktop filters */}
      <div className="hidden md:flex gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="default" className="gap-1">
              <ListFilterIcon className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                {Capitalize(params.get('filter')) || 'Filtrar por'}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {filters.map((filter) => (
              <DropdownMenuCheckboxItem
                key={filter.value}
                checked={params.get('filter') === filter.value}
                onClick={() => handleFilter(filter.value)}
              >
                {filter.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="default" className="gap-1">
              <ListFilterIcon className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                {Capitalize(params.get('type')) || 'Tipo de imóvel'}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Tipo de imóvel</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {types.map((type) => (
              <DropdownMenuCheckboxItem
                key={type.value}
                checked={params.get('type') === type.value}
                onClick={() => handleType(type.value)}
              >
                {type.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {hasFilters ? (
        <Button
          onClick={clearFilters}
          variant="secondary"
          className="flex items-center gap-2 animate-fadeIn"
        >
          <Label className="cursor-pointer">Limpar filtros</Label>
          <XIcon className="h-4 w-4" />
        </Button>
      ) : null}
    </>
  )
}
