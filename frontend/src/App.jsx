import { useState, useEffect } from 'react'
import axios from 'axios'

// Configure axios to show full error details
axios.interceptors.request.use(config => {
  console.log('Request:', config.method?.toUpperCase(), config.url)
  return config
})

axios.interceptors.response.use(response => {
  console.log('Response:', response.status, response.config.url)
  return response
}, error => {
  console.error('API Error:', {
    url: error.config?.url,
    method: error.config?.method,
    status: error.response?.status,
    message: error.message
  })
  return Promise.reject(error)
})

function App() {
  const [memos, setMemos] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  })
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    fetchMemos()
  }, [])

  const fetchMemos = async () => {
    try {
      const response = await axios.get('/api/memos')
      console.log('API Response:', response.data) // Debug log
      setMemos(response.data)
    } catch (error) {
      console.error('API Error Details:', {
        message: error.message,
        config: error.config,
        response: error.response?.data
      })
      alert(`Failed to load memos: ${error.message}`)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await axios.put(`/api/memos/${editingId}`, formData)
      } else {
        await axios.post('/api/memos', formData)
      }
      resetForm()
      fetchMemos()
    } catch (error) {
      console.error('Error saving memo:', error)
    }
  }

  const handleEdit = (memo) => {
    setFormData({
      title: memo.title,
      content: memo.content
    })
    setEditingId(memo.id)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this memo permanently?')) return
    
    try {
      await axios.delete(`/api/memos/${id}`)
      fetchMemos()
    } catch (error) {
      console.error('Delete failed:', error)
      alert('Delete failed. Check console for details.')
    }
  }

  const resetForm = () => {
    setFormData({ title: '', content: '' })
    setEditingId(null)
  }

  return (
    <div className="container">
      <h1>Memo App</h1>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          required
        />
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Content"
          required
        />
        <button type="submit">
          {editingId ? 'Update Memo' : 'Add Memo'}
        </button>
        {editingId && (
          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      <div className="memo-grid">
        {memos.map((memo) => (
          <div key={memo.id} className="memo-card">
            <h3>{memo.title}</h3>
            <p>{memo.content}</p>
            <div className="memo-actions">
              <button onClick={() => handleEdit(memo)}>Edit</button>
              <button onClick={() => handleDelete(memo.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
