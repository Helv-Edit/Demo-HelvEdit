#!/bin/bash

STORE="pokestore-8gh7qawh.myshopify.com"

# Create Protections Collection
echo "Creating Protections collection..."
shopify api call --store=$STORE --method POST /2024-01/graphql.json << 'QUERY'
{
  "query": "mutation { collectionCreate(input: {title: \"Protections\", handle: \"protections\", descriptionHtml: \"Sleeves premium, toploaders & housses acryliques sur mesure.\"}) { collection { id } errors { message } } }"
}
QUERY

# Create Sealed Products Collection
echo "Creating Sealed Products collection..."
shopify api call --store=$STORE --method POST /2024-01/graphql.json << 'QUERY'
{
  "query": "mutation { collectionCreate(input: {title: \"Produits Scellés\", handle: \"produits-scelles\", descriptionHtml: \"Boosters, ETB, Bundles & Displays. Produits authentiques, scellés d'usine.\"}) { collection { id } errors { message } } }"
}
QUERY

echo "Collections created! Now you can add products in Shopify admin."
