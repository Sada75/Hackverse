import streamlit as st
import requests


CHAT_URL = "http://127.0.0.1:5000/chat"

st.title("Medi Help")


st.header("Chat with the Office HR Assistant")
    
 # Input for user query
user_query = st.text_area("Ask a question related to HR or office policies:")

if st.button("Send Query"):
    if not user_query:
        st.error("Please enter your question.")
    else:
        # Send the query to the Flask app
        response = requests.post(CHAT_URL, json={"query": user_query})
        
        if response.status_code == 200:
            answer = response.json().get("answer", "No response received.")
            st.success(f"Assistant: {answer}")
        else:
            st.error(f"Failed to process query: {response.json().get('error')}")