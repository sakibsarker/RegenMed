import React from 'react'
import styled from 'styled-components'
import Cardlist from '../components/Cardlist'

const StyledSection = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  height: 25vh;
  width: 80%;
  margin: 0 auto;

  .header {
    color: #444444;
  }

  h2 {
    color: #4811ab;
    font-weight: bold;
    font-size: 2rem;
    line-height: 1.2;
    letter-spacing: 0.1em;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.2rem;
    line-height: 1.5;
    letter-spacing: 0.05em;
    margin-bottom: 0;
    color: #a41ced;
    font-weight: bold;
  }

  div {
    width: 40%;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    height: auto;

    div {
      width: 80%;
      margin: 2rem auto;
      text-align: center;
    }
  }
`

const Heading = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  h2 {
    font-size: 2rem;
    line-height: 1.2;
    letter-spacing: 0.1em;
    margin-top: 5rem;
    margin-bottom: 1rem;
  }

  #bar {
    color: #4811ab;
    text-align: center;
  }

  #paragraph {
    color: #444444;
    font-size: 1.2rem;
    line-height: 1.5;
    letter-spacing: 0.05em;
    width: 100%;
    margin-top: 1.5rem;
    text-align: center;
    margin-bottom: 0;
  }
`

const Services = () => {
  return (
    <>
      <StyledSection id='services-section'>
        <div>
          <h2>WHAT IS REGENERATIVE MEDICINE?</h2>
        </div>
        <div>
          <p>
            The process of repairing or regenerating human cells, tissues, or organs as a result of disease, aging, or defects.
          </p>
        </div>
      </StyledSection>
      <StyledSection id='about-section'>
        <Heading>
          <h2 className='header'>What you can find here</h2>
          <div id='bar'>____________</div>
          <div id='paragraph'>
            Find a Regenerative Medicine Doctor that offers the types of treatments below.
          </div>
        </Heading>
      </StyledSection>
      <Cardlist />
    </>
  )
};

export default Services
