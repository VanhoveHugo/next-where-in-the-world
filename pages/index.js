import React, { useState, useLayoutEffect, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import styles from '../styles/index.module.css'
import { getAllData, getAllRegions } from '../lib/flags'

export default function Index({data, regions}) {
  
  const [theme, setTheme] = useState(undefined) // false == Dark
  const [props, setProps] = useState(data)

  // Initialization of theme color
  useLayoutEffect(() => {
    if(localStorage.getItem('theme') != undefined) {
      if(localStorage.getItem('theme') == "true") {
        setTheme(true)
      } else {
        setTheme(false)
      }
    } else {
      setTheme(false)
    }
  }, [])
  // LocalStorage Hook change
  useEffect(() => {
    localStorage.setItem('theme', theme);

    let textNode = document.querySelector('nav button span')
    let iconNode = document.querySelector('nav button i')
    let body = document.querySelector('nav').parentNode.parentNode

    if ( theme == false ) {
      textNode.innerHTML = 'Light Mode'
      iconNode.className = 'fa fa-sun-o'
      body.classList.add('dark')
    } else {
      textNode.innerHTML = 'Dark Mode'
      iconNode.className = 'fa fa-moon-o'
      body.classList.remove('dark')
    }

    if(!body.classList.contains('display')) {
      body.classList.add('display')
    }
  }, [theme])
  // 1000 to 1,000
  const formatNumber = (x) => { return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') }

  //
  const selectClick = (e) => {
    let value = e.target.value
    if(value !== "") 
      return setProps(data.filter(c => c.region == value))
    return setProps(data)
  }

  let countries = []
  // store every data name in countries variable
  data.forEach(e => {
    countries.push(e.name)
  })
  // A - Z
  countries.sort()
  
  // 
  const searchInput = (e) => {
    let value = e.target.value
    if(value !== "") 
      return setProps(data.filter(c => c.name.substring(0, value.length) == value.substring(0, 1).toUpperCase() + value.substring(1, value.length)))
    return setProps(data)
  }
  
  return (
    <>
      <Head>
        <title>Where in the world?</title>
        <meta name="description" content="Un projet dans lequel je met en pratique mes compétences." />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
      </Head>

      <nav className={styles.nav}>
        <p className={styles.navTitle}>Where in the world?</p>
        <button className={styles.navButton} onClick={(e) => setTheme(v => v = !v)}>
          <i className="fa fa-moon-o" aria-hidden="true"></i>
          <span>Light Mode</span>
        </button>
      </nav>
      <main className={styles.main}>
        <div className={styles.toolbar}>
          <input onChange={(e) => searchInput(e)} placeholder="Search for a country..." type="search"></input>
          <select onChange={(e) => selectClick(e)}>
            <option value="" selected>All</option>
            {regions.map((region, i) => (
              <option key={i} value={region}>{region}</option>
            ))}
          </select>
        </div>
        <ul className={styles.list}>
          {props.map((country, i) => (
            <li key={i} className={styles.item}>
              <Link href={ "/" + country.name}>
                <a>
                  <Image src={country.flag} alt={`An image of ${country.name}`} layout="fill" />
                  <h2>{country.name}</h2>
                  <p>Population: {formatNumber(country.population)}</p>
                  <p>Région: {country.region}</p>
                  <p>Capital: {country.capital}</p>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </>
  )
}

export async function getStaticProps() {
  const data = await getAllData()
  const regions = await getAllRegions(data)
  return {
    props: {
      data,
      regions
    }
  }
}