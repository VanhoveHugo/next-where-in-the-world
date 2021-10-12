import React, { useState, useEffect,useLayoutEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import styles from '../styles/[name].module.css'
import { getAllData, getAllRegions, getAllPath } from "../lib/flags";

export default function Home({ data }) {
  const [theme, setTheme] = useState(undefined) // false == Dark

  const formatNumber = (x) => { return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') }

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
    // changeThemeState()
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

  return (
    <>
      <Head>
        <title>Where is {data[0].name}</title>
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
        <Link href="/">
          <a className={styles.back}>
            Back
          </a>
        </Link>
        <div className={styles.flex}>
          <div>
            <Image src={data[0].flag} alt={`An image of ${data[0].name}`} layout="fill" />
          </div>
          <div>
            <div className={styles.desc}>
              <h1>{data[0].name}</h1>
              <ul>
                <li>Native Name: <span>{data[0].nativeName}</span></li>
                <li>Population: <span>{formatNumber(data[0].population)}</span></li>
                <li>Region: <span>{data[0].region}</span></li>
                <li>Sub Region: <span>{data[0].subregion}</span></li>
                <li>Capital: <span>{data[0].capital}</span></li>
                <li>Top Level Domain: <span>{data[0].topLevelDomain}</span></li>
                <li>Currencies: <span>{data[0].currencies[0].name}</span></li>
                <li>Languages: <span>{data[0].languages.map((lang, i) => (
                    <strong key={i}>{lang.name}</strong>
                  )
                )}</span></li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export async function getStaticPaths() {
  const req = await fetch('https://restcountries.com/v2/all')
  const data = await req.json()
  const paths = data.map(country =>({
      params: {name: country.name.replace(/\s/gi, '%20')},
  }))
  return {
      paths,
      fallback: false
  }
}

export async function getStaticProps({ params }) {
  const req = await fetch(`https://restcountries.com/v2/name/${params.name}`)
  console.log(params.name);
  const data = await req.json()
  return {
    props: {
      data
    }
  }
}
