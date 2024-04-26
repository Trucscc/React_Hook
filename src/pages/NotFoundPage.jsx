import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
    return (
        <div className="flex flex-col gap-4">
            404 Not Found
            <span>, </span>
            <Link to="/"> Return Home </Link>
            <span>, </span>
            <a href="/">Home From A</a>
        </div>
    )
}

