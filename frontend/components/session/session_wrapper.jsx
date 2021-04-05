import React from "react"
import DoggieLogo from "../utils/doggie_logo"

export default function SessionWrapper({className, children}){
  return (
    <div className={`session-wrapper ${className}`}>
      <section className={`session ${className}`}>
        <DoggieLogo color='cr' />
        
        {children}
      </section>
    </div>
  )
}