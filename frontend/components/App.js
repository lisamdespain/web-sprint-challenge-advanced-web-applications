import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import { AuthRoute } from './AuthRoute'
import { axiosWithAuth } from '../axios/index'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState('')
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { /* ✨ implement */ 
    navigate(`/`);
}
  const redirectToArticles = () => { /* ✨ implement */ }

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    localStorage.removeItem('token')
    setMessage("Goodbye!");
    redirectToLogin();
  }

  const login = ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
    setMessage("");
    setSpinnerOn(true);
    axiosWithAuth().post('/login', { username, password })
    .then(res => {
      console.log(res)
      localStorage.setItem('token', res.data.token)
      setSpinnerOn(false);
      setMessage(res.data.message);
      navigate(`/articles/`);
    })
    .catch(err => console.log(err))
    setSpinnerOn(false);
  }

  const getArticles = () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
    setMessage("");
    setSpinnerOn(true);
    axiosWithAuth().get('/articles')
    .then(res => {
      setArticles(res.data.articles)
      setSpinnerOn(false);
      setMessage(res.data.message);
      
    })
    .catch(err => {
      console.log(err)
      setSpinnerOn(false);
      navigate(`/`);
    })
  }

  const postArticle = article => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    setMessage("");
    setSpinnerOn(true);
    axiosWithAuth().post('/articles', article)
    .then(res => {
      console.log(res)
      setSpinnerOn(false);
      setMessage(res.data.message);
      const newArticle= {
        article_id: res.data.article.article_id, 
        title: res.data.article.title, 
        text: res.data.article.text, 
        topic: res.data.article.topic
      }
      setArticles([...articles, newArticle])
    })
    .catch(err => {
      console.log(err)
      setSpinnerOn(false);
      navigate(`/`);
    })
  }

  const updateArticle = (article) => {
    // ✨ implement
    // You got this!
    setMessage("");
    setSpinnerOn(true);
    axiosWithAuth().put(`articles/${currentArticleId}`, article)
    .then(res => {
      console.log(res)
      const updatedArticle= {
        article_id: res.data.article.article_id, 
        title: res.data.article.title, 
        text: res.data.article.text, 
        topic: res.data.article.topic
      }
      setArticles([...articles, updatedArticle])
      setSpinnerOn(false);
      setMessage(res.data.message);
  })
  .catch(err => {
    console.log(err)
    setSpinnerOn(false);
})
  }

  const deleteArticle = id => {
    // ✨ implement
    axiosWithAuth().delete(`/articles/${id}`)
    .then(res=>{
      console.log(res)
      setMessage(res.data.message);
      setArticles(articles.filter((article) => id !== article.article_id))
      setCurrentArticleId('');
    })
    .catch(err=> console.log(err))
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner spinnerOn={spinnerOn}/>
      <Message message={message}/>
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path='/articles' element={
            <AuthRoute>
              <Articles 
              getArticles={getArticles} 
              articles={articles} 
              deleteArticle={deleteArticle} 
              setCurrentArticleId={setCurrentArticleId}
              currentArticleId={currentArticleId}
              updateArticle={updateArticle} 
              postArticle={postArticle}/>
            </AuthRoute>
          }>

          </Route>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route path="articles" element={
            <>
              <ArticleForm  />
              <Articles />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}
