import requests
import json
import os

# Your API URL
url = 'http://localhost:5000/books'

# Get the directory where the script is located
script_dir = os.path.dirname(os.path.abspath(__file__))
print(script_dir)
# Create the full path to the JSON file
json_file_path = os.path.join(script_dir, 'Amazon_popular_books_dataset.json')

# Read books from JSON file
with open(json_file_path, 'r', encoding='utf-8') as file:
    books = json.load(file)

# Define a function to clean the data
def clean_book_data(book):
    # Only keep the required fields
    required_fields = ['title', 'author', 'price', 'url', 'rating', 'description', 'image_url', 'categories']
    # Extract rating as float from string like "4.6 out of 5 stars"
    if book.get('rating'):
        try:
            rating = float(book['rating'].split()[0])
        except:
            rating = None
    else:
        rating = None
    book['rating'] = rating
    
    # Filter the book object to only include required fields
    cleaned_book = {key: book.get(key) for key in required_fields}

    # Some fields might need renaming or defaults
    cleaned_book['author'] = book.get('brand', 'Unknown Author')  # Using 'brand' as author
    cleaned_book['price'] = book.get('final_price', 0)  # Using 'final_price' as price
    cleaned_book['description'] = book.get('description', 'No description available')  # Default description

    return cleaned_book

# Your token for authentication
headers = {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMzNjExNDQ2LCJleHAiOjE3MzM2MTUwNDZ9.KrSuX2sbRXX4sFZqexbhPmjavWWR3U6FcYNax6qTpnI',
    'Content-Type': 'application/json'
}

cnt=0
# Seed the data
for book in books:
  if cnt==1500:
    break
  cnt+=1
  cleaned_book = clean_book_data(book)
  response = requests.post(url, headers=headers, data=json.dumps(cleaned_book))
  if response.status_code == 201:
    print(f"Added book: {cleaned_book['title']}")
  else:
    print(f"Failed to add book: {cleaned_book['title']} - Status Code: {response.status_code}")
