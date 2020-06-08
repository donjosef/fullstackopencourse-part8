
import React, { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommendations from './components/Recommendations'
import { useApolloClient, useSubscription } from '@apollo/client'
import { BOOKS, BOOK_ADDED } from './queries'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const client = useApolloClient()
  
  const updateCacheWith = (bookAdded) => {
    const includedIn = (set, object) => set.map(p => p.id).includes(object.id)  
  
    const dataInStore = client.readQuery({ query: BOOKS }) //read data inside cache
    if (!includedIn(dataInStore.allBooks, bookAdded)) { //if not included already in cache
      client.writeQuery({ //write inside cache
        query: BOOKS,
        data: { allBooks : dataInStore.allBooks.concat(bookAdded) }
      })
    }   
  }

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      console.log(subscriptionData)
      updateCacheWith(subscriptionData.data.bookAdded)
    }
  })

  useEffect(() => {
    const storageToken = localStorage.getItem('books-app-token')
    if (storageToken) {
      setToken(storageToken)
    }
  }, [])

  const handleLogout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {
          !token ? (
            <button onClick={() => setPage('login')}>login</button>
          ) : (
              <>
                <button onClick={() => setPage('recommendations')}>recommendations</button>
                <button onClick={() => setPage('add')}>add book</button>
                <button onClick={handleLogout}>logout</button>
              </>
            )
        }
      </div>

      <Authors
        show={page === 'authors'}
        loggedIn={token !== null}
      />

      <Books
        show={page === 'books'}
      />

      <Recommendations show={page === 'recommendations'} />

      <NewBook
        show={page === 'add'}
      />

      <LoginForm
        show={page === 'login'}
        setToken={setToken}
        redirectPage={setPage}
      />
    </div>
  )
}

export default App