import { useState, useEffect } from 'react'

const SearchBar = ({ objects, setSelectedIdx }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  useEffect(() => {
    if (!query) {
      setResults([])
      return
    }
    const q = query.toLowerCase()
    const matches = objects.filter(obj => obj.name.toLowerCase().includes(q))
    setResults(matches.slice(0, 10))
  }, [query, objects])

  const handleSelect = (obj) => {
    const idx = objects.findIndex(o => o.id === obj.id)
    if (idx !== -1) {
      setSelectedIdx(idx)
    }
    setQuery('')
    setResults([])
  }

  return (
    <div className='relative'>
      <input
        className='p-1 rounded text-black text-sm w-40'
        type='text'
        placeholder='Search satellites...'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {results.length > 0 && (
        <ul className='absolute z-10 bg-stone-800 text-white mt-1 max-h-40 overflow-y-auto w-full rounded'>
          {results.map(obj => (
            <li
              key={obj.id}
              className='p-1 hover:bg-stone-600 cursor-pointer text-sm'
              onClick={() => handleSelect(obj)}
            >
              {obj.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SearchBar
