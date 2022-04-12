import { Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Loading from '@/components/Loading'
import Index from '@/pages/Index/index'

function App() {
    return (
        <div>
            <BrowserRouter basename="">
                <Suspense fallback={<Loading />}>
                    <Routes>
                        <Route path="/" element={<Index />}></Route>
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </div>
    )
}

export default App
