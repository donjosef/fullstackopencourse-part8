import React, { useState } from 'react'
import {useQuery} from '@apollo/client'
import { BOOKS } from '../queries'

const Books = (props) => {
  const [genre, setGenre] = useState('')
  const { data = { allBooks: [] } } = useQuery(BOOKS)

  if (!props.show) {
    return null
  }

  const genres = data.allBooks.reduce((acc, book) => {
    return [
      ...acc,
      ...book.genres.filter(genre => !acc.includes(genre))
    ]
  }, [])

  let books = data.allBooks
  if(genre) {
    books = books.filter(book => book.genres.includes(genre))
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>
              author
            </th>
            <th>
              published
            </th>
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
      {
        [
          ...genres.map(genre => <button key={genre} onClick={() => setGenre(genre)}>{genre}</button>),
          <button key={'all'} onClick={() => setGenre('')}>all</button>
        ]
      }
    </div>
  )
}

export default Books