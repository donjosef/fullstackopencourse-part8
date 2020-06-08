import React, { useEffect } from 'react'
import { useQuery, useLazyQuery } from '@apollo/client'
import { BOOKS, ME } from '../queries'

const Recommendations = ({ show }) => {
    /* filter with backend */
    const [getBooks, booksResult] = useLazyQuery(BOOKS)
    const result = useQuery(ME)

    useEffect(() => {
        if(result.data) {
            const favoriteGenre = result.data.me.favoriteGenre
            getBooks({ variables: {genre : favoriteGenre}})
        }
    }, [result.data])

    let books = []
    if(booksResult.data) {
        books = booksResult.data.allBooks
    }

    if (!show) {
        return null
    }

    return (
        <div>
            <h2>Recommendations</h2>
            {/* <h3>Books in your favorite genre {favoriteGenre}</h3> */}
            <table>
                <tbody>
                    <tr>
                        <th>title</th>
                        <th>author</th>
                        <th>published</th>
                    </tr>
                    {books.map(a =>
                        <tr key={a.title}>
                            <td>{a.title}</td>
                            <td>{a.author.name}</td>
                            <td>{a.published}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default Recommendations
