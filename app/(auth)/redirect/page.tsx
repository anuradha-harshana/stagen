import { Button } from '@/components/ui/button'
import Link from 'next/link'

const page = () => {
  return (
    <div className='w-full h-screen bg-oatmeal flex flex-col items-center justify-center font-cream'>
      <h1 className='text-3xl text-truffle-trouble'>Oops seems like you are not authenticated!</h1>
      <span className='text-2xl text-'>Go back to the start!</span>
      <Link href="/login">
        <Button className='mt-3 w-30 h-10 bg-blue-fantastic text-burning-flame border-2 cursor-pointer hover:text-white hover:bg-truffle-trouble hover:border-blue-fantastic' variant="outline">
            <span className='text-2xl'>Login</span>
        </Button>
      </Link>  
    </div>
  )
}

export default page
