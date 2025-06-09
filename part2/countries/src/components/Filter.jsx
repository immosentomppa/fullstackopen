const Filter = ({countriesFilter, handleCountriesFilterChange}) => {
    return (
        <div>
            find countries <input value={countriesFilter} onChange={handleCountriesFilterChange}/>
        </div>
    )
}

export default Filter