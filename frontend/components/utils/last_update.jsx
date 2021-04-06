import React from 'react';

export default function LastUpdate({time}){
  function getTimeString(diff){
    const mins = (diff / 60) | 0;
    const hours = (diff / 3600) | 0;
    const days = (diff / 86400) | 0;
    const weeks = (diff / 86400 * 7) | 0;

    if (weeks === 0){
      if (days === 0){
        if (hours === 0){
          if (mins === 0){
            return "seconds";
          }

          return `${mins} minute${mins > 1 ? "s" : ""}`
        }

        return `${hours} hour${hours > 1 ? "s" : ""}`
      }

      return `${days} day${days > 1 ? "s" : ""}`
    }

    return "More than a week";
  }



  const diff = (new Date() - new Date(time)) / 1000;

  return (
    <div className='last-update'>{`Last update was ${getTimeString(diff)} ago`}</div>
  )
}