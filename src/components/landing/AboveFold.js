import React from 'react'
import { Image } from 'cloudinary-react'
import { Typography, Button } from '@material-ui/core'
import scrollIntoView from 'scroll-into-view-if-needed'

import './AboveFold.css'
import LogoName from './LogoName'
// import ElonLanding from './ElonLanding'

const scrollTo = (selector) => () => {
  scrollIntoView(document.querySelector(selector), {
    behavior: 'smooth',
    block: 'start',
    inline: 'nearest',
  })
}

const AboveFold = () => (
  <div className="AboveFold">
    <div className="AboveFold-container">
      <div className="AboveFold-main-container">
        <LogoName />
        <div className="AboveFold-main">
          {/* <ElonLanding /> */}
          <div className="AboveFold-text">
            <Typography className="AboveFold-title" variant="h4">
              GraphQL is the <span className="-nowrap">new REST</span>
            </Typography>
            <Typography className="AboveFold-subtitle" variant="body1">
              GraphQL is the best way to fetch data for your app, and the
              GraphQL&nbsp;Guide is the best way to learn how.
            </Typography>
          </div>
          <div className="AboveFold-buttons">
            <Button variant="contained" onClick={scrollTo('.BelowFold')}>
              Learn more
            </Button>
            <Button
              color="primary"
              variant="contained"
              onClick={scrollTo('.Pricing')}
            >
              Get the book
            </Button>
          </div>
        </div>
      </div>
    </div>
    <div className="AboveFold-hero-container">
      <Image
        className="AboveFold-hero"
        publicId="book"
        fetchFormat="auto"
        quality="auto"
      />
    </div>
  </div>
)

export default AboveFold
