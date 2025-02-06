import { Loader } from "lucide-react"

const LoadingPage = () => {
  return (
    <div className="h-screen flex items-center justify-center"><Loader className="animate-spin" size={60} /></div>
  )
}

export default LoadingPage
