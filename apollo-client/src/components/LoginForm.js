import React, { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'

const loginForm = {
    marginTop: 30,
    display: 'flex', 
    flexDirection: 'column',
    alignItems: 'flex-start'
}

const LoginForm = ({show, setToken, redirectPage}) => {
    const [username, setUsername] = useState('')
    const [pass, setPass] = useState('')
    const [login, result] = useMutation(LOGIN)

    useEffect(() => {
        if(result.data) {
            const token = result.data.login.value
            setToken(token)
            redirectPage('authors')
            localStorage.setItem('books-app-token', token)
        }
    }, [result.data])

    const handleSubmit = (e) => {
        e.preventDefault()
    
        login({variables: {username, password: pass}})
        setUsername('')
        setPass('')
    }

    if(!show) {
        return null
    }

    return (
        <form style={loginForm} onSubmit={handleSubmit}>
            <label>
                username:
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </label>
            <label>
                password:
                <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} />
            </label>
            <button>Login</button>
        </form>
    )
}

export default LoginForm
