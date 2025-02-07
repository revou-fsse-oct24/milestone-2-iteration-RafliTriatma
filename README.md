# MILESTONE-2

[milestone-iteration](https://milestone-iteration.netlify.app/)

## Table of Contents

- [Installation](#installation)
- [Pages](#pages)


## Installation

This is how to install or run the project

```bash
# Clone the repository
git clone https://github.com/revou-fsse-oct24/milestone-2-iteration-RafliTriatma.git

# Navigate to the project directory
cd milestone-iteration

# Install dependencies
npm instal

# How to Run
npm run dev

# How to test Unit Testing

# Add package 
npm install -D jest jest-environment-jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom ts-node

and follow the instruction from https://nextjs.org/docs/app/building-your-application/testing/jest

# Test the Unit Test
npm run test

```


## Pages

### Login
This step, u need to login with account. If u don't have any account, u need to register before.

```bash
const API_URL = 'https://api.escuelajs.co/api/v1/auth/login'; #  <-- This is the API


export const fetchDataWithAuth = async (email: String, password: String) => {
    try {
        const response = await axios.post(API_URL, {
          email,
          password,
        });  # <-- Add parameter for authentication
    
    const accessToken = response.data.access_token; # <-- Adding Access Token

    localStorage.setItem('authToken', accessToken); # <-- Save Token u Got in LocalStorage  

    return accessToken;
      } catch (error) {
        console.error('Error during login:', error);
        throw error;
      }
    };  # <-- Call Back the Token
```
### Home Page
This step u can choose category product and select the product or add product to cart

```bash
# // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch('https://api.escuelajs.co/api/v1/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data: Category[] = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Error fetching categories. Please try again later.');
    }
  };

# // Fetch products by category
  const fetchProductsByCategory = async (categoryId: number | null) => {
    setLoading(true);
    setError(null); # // Reset error state
    try {
      const response = await fetch(
        categoryId
          ? `https://api.escuelajs.co/api/v1/products/?categoryId=${categoryId}`
          : 'https://api.escuelajs.co/api/v1/products'
      );
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data: Product[] = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Error fetching products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
```
        
       

