import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

const Error = () => {
    const router = useRouter()
    useEffect(() => {
        setTimeout(() => {
            router.push('/tasks')
        },1000)
    }, [router])
  return (
    <div>
        <div className='text-center text-6xl text-violet-500'>404</div>
        <h5>Что-то не так</h5>

    </div>
  )
}

export default Error