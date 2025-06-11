import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import CategoryProducts from "../../../src/components/Products/CategoryProducts"
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/utils/react-query'


test('loads and displays products', async () => {
   render(
      <BrowserRouter>
         <QueryClientProvider client={queryClient}>
            <CategoryProducts/>
         </QueryClientProvider>
      </BrowserRouter>
   )

   expect(screen.getByText("No se pudieron encontrar productos"))
})

