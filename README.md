# About

This project was made in the context of a hackaton. Introducing Cherry, a friendly shopping assistant that will guide the client throughout their journey.

This project was built using Google ADK in the VertexAI environment, using Gemini. The chatbot is hosted through vercel, feel free to interract with it : https://la-chaise-l-aise.vercel.app/

## Features : 

- Decoration advice through a **RAG** corpus
- Possibility to view your shopping basket and add items to it.
- Finding similar products to a picture using **Google Vision API Product Search**. *Note: this may not work as the embeddings index is sometimes offline!*
- Finding a product in our Big Query table through a picture of a barcode.
- And finding a product in our BQ table through any sort of information : the price range, the style, the color etc.

Our **Big Query connection** is powered through an **MCP server**.

## About the front-end

The whole front was created using next.js and TSX. 

The icons were designed through Figma especially for this project.
