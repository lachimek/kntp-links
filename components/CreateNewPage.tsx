import { server } from 'config'
import React, { useState } from 'react'

interface Props {
  setPageUrl: React.Dispatch<React.SetStateAction<string>>
}

const CreateNewPage: React.FC<Props> = ({ setPageUrl }) => {
  const [error, setError] = useState({ error: false, message: '' })
  const [fieldData, setFieldData] = useState('')
  const [available, setAvailable] = useState(false)

  const containsSpecialChars = (text: string) => {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~ ]/
    return specialChars.test(text)
  }

  const handleSubmit = () => {
    console.log(error)
    let valid = true
    if (fieldData === '') {
      setError({ error: true, message: 'Pole wymagane' })
      valid = false
    }
    if (fieldData.length >= 20) {
      setError({ error: true, message: 'Maksymalnie 20 znaków' })
      valid = false
    }

    if (valid && available) {
      setPageUrl(fieldData)
    }
  }

  const handleCheckIfAvailable = async () => {
    if (!containsSpecialChars(fieldData) && fieldData !== '') {
      const response = await fetch(`${server}/api/page/checkIfPageExists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pageUrl: fieldData,
        }),
      })
      const json = await response.json()
      if (!json.error) setAvailable(true)
      else
        setError({
          error: true,
          message:
            json.message === 'page_url_exists'
              ? 'Nazwa strony jest zajęta'
              : '',
        })
      console.log(json)
    } else {
      setError({ error: true, message: 'Tylko litery i cyfry są dozwolone' })
    }
  }

  const handleChange = (value: string) => {
    if (!containsSpecialChars(value)) {
      setFieldData(value.trim().toLowerCase())
      setAvailable(false)
      setError({ error: false, message: '' })
    } else {
      setError({ error: true, message: 'Tylko litery i cyfry są dozwolone' })
    }
  }

  return (
    <div className="mt-16 h-80 rounded-md bg-white p-4">
      <h1 className="mb-2 text-xl text-black">
        Tworzenie nowej strony [{fieldData.length}/20]
      </h1>
      <div className="flex-grow border-t border-gray-700 py-4"></div>
      <div className="flex align-middle">
        <div className="relative">
          <input
            className={`z-0 h-14 w-96 rounded-lg border pl-2 pr-20 text-black focus:outline-none ${
              error.error && 'border-red-600'
            }`}
            id="content"
            type="text"
            placeholder="Twoja nazwa"
            maxLength={20}
            onChange={(e) => {
              handleChange(e.currentTarget.value)
            }}
            value={fieldData}
          />
          <div className="absolute top-2 right-2">
            <button
              className="h-10 w-20 rounded-lg border border-black text-black transition-colors hover:bg-black hover:text-white"
              onClick={handleCheckIfAvailable}
            >
              Zajęta?
            </button>
          </div>
        </div>
      </div>
      <div className="flex max-w-sm flex-col">
        {available ? (
          <span className="text-green-500">Nazwa jest dostępna!</span>
        ) : !error.error ? (
          <span className="text-red-500">Sprawdź czy nazwa jest dostepna</span>
        ) : (
          <span className="text-red-500">{error.message}</span>
        )}
        <span className="mt-2 text-black">
          Utworzysz stronę: {server}/{fieldData}
        </span>
      </div>
      <div className="flex w-full justify-center">
        <button
          className="mt-8 rounded-md border-2 border-black px-8 py-3 text-center text-black transition-colors hover:bg-black hover:text-white disabled:border-none disabled:bg-red-500 disabled:hover:text-black"
          onClick={handleSubmit}
          disabled={!available}
        >
          Utwórz stronę
        </button>
      </div>
    </div>
  )
}

export default CreateNewPage
