import ollama

def fake_news_clasificator_ollama(prompt:str):
    response = ollama.chat(model='llama3', messages=[
    {
      'role': 'user',
      'content': 'hola, como estas?',
    },
  ])
    return response['message']['content']

if __name__ == "__main__":
    while True:
        user_input = input("You: ")
        if user_input.lower() in ["quit", "exit", "bye"]:
            break
        response = fake_news_clasificator_ollama(user_input)
        print("Chatbot: ", response)