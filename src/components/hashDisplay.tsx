import React from 'react'

interface HashDisplayProps {
    hash?: string
    className?: string
}

const HashDisplay = ({hash, className}:HashDisplayProps) => {
    if (hash)
        return <span className={className}>{hash.substring(0,5)}...{hash.substring(hash.length-5)}</span>
    else
        return null
}

export default HashDisplay
