const Countries = ({countriesToShow, handleShowCountryClick}) => {
    switch (countriesToShow.length) {
        case 0:
            return <div>No countries found</div>
        case 1:
            const country = countriesToShow[0]
            return (
                <div>
                    <h2>{country.name.common}</h2>
                    <div>Capital {country.capital}</div>
                    <div>Area {country.area}</div>
                    <h3>Languages:</h3>
                    <ul>
                        {Object.values(country.languages).map((language, i) => (
                            <li key={i}>{language}</li>
                        ))}
                    </ul>
                    <img src={country.flags.png} width="150" alt={`Flag of ${country.name.common}`} />
                </div>
            )
        default:
            return (
                <div>
                    {countriesToShow.length > 10 ? (
                        <div>Too many matches, specify another filter</div>
                    ) : (
                        countriesToShow.map((country, i) => (
                            <div key={i}>{country.name.common} <button type="button" 
                                onClick={() => handleShowCountryClick(country.name.common)}>Show</button></div>
                        ))
                    )}
                </div>
            )
    }
}

export default Countries