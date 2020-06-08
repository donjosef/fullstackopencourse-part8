  
import React, { useState } from 'react'
import Select from 'react-select'

import {useQuery, useMutation} from '@apollo/client'
import { ALL_AUTHORS, UPDATE_AUTHOR } from '../queries'

const Authors = ({show, loggedIn}) => {
 const [selectedOption, setSelectedOption] = useState(null)
 const [born, setBorn] = useState('')

  const { data = { allAuthors: [] } } = useQuery(ALL_AUTHORS) //destructure + default parameters because data is undefined before response is settled
  const [updateAuthor] = useMutation(UPDATE_AUTHOR, {
    refetchQueries: ['allAuthors']
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    updateAuthor( { variables: {name: selectedOption.value, setBornTo: Number(born)} } )
    setSelectedOption(null)
    setBorn('')
  }

  if (!show) {
    return null
  }

  const options = data.allAuthors.map(author => ({value: author.name, label: author.name}))

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {data.allAuthors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
      {
        loggedIn && (
          <>
            <h2>Set author birth year</h2>
            <form onSubmit={handleSubmit}>
              <Select 
                value={selectedOption} 
                onChange={(option) => setSelectedOption(option)} 
                options={options} />
              <div>
                born
                <input type="number" value={born} onChange={(e) => setBorn(e.target.value)}/>
              </div>
              <button>update author</button>
            </form>
          </>
        )
      }
    </div>
  )
}

export default Authors
