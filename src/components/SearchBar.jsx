import { useState, useEffect, useRef } from 'react'
import { CATEGORY_COLORS } from '../constants'

const SearchBar = ({ objects, setSelectedIdx, activeCategories }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [focused, setFocused] = useState(false)
  const inputRef = useRef()

  useEffect(() => {
    if (!query) {
      setResults([])
      return
    }
    const q = query.toLowerCase()
    const matches = objects
      .filter(obj => activeCategories?.has(obj.category) !== false)
      .filter(obj => obj.name.toLowerCase().includes(q))
    setResults(matches.slice(0, 12))
  }, [query, objects, activeCategories])

  const handleSelect = (obj) => {
    const idx = objects.findIndex(o => o.id === obj.id)
    if (idx !== -1) setSelectedIdx(idx)
    setQuery('')
    setResults([])
    inputRef.current?.blur()
  }

  return (
    <div className="search-container">
      <div className={`search-input-wrapper ${focused ? 'focused' : ''}`}>
        <svg className="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          ref={inputRef}
          className="search-input"
          type="text"
          placeholder="Search satellites..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
        />
        {query && (
          <button className="search-clear" onClick={() => { setQuery(''); setResults([]) }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      {results.length > 0 && (
        <ul className="search-results">
          {results.map(obj => (
            <li
              key={obj.id}
              className="search-result-item"
              onClick={() => handleSelect(obj)}
            >
              <span className="search-result-dot" style={{ backgroundColor: CATEGORY_COLORS[obj.category] || '#fff' }} />
              <span className="search-result-name">{obj.name}</span>
              <span className="search-result-cat">{obj.category}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SearchBar
