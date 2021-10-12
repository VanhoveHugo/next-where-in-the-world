export async function getAllData() {
    const req = await fetch('https://restcountries.com/v2/all')
    const data = await req.json()
    const res = await data.map(v => 
        v = { name: v.name, capital: v.capital || null, region: v.region, population: v.population, flag: v.flag}
    )
    return res
}


export async function getCountryData({ country }) {
    let props = getAllData()
}



export async function getAllRegions(countries) {
    let arr = new Array()
    countries.forEach( country => {
        if(!arr.includes(country.region) &&  country.region != '')
            arr.push(country.region)
    })
    return arr
}

