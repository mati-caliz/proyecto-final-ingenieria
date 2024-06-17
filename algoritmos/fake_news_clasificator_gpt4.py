from openai import OpenAI

client = OpenAI(api_key="sk-proj-ISd2YDCvCl5KLGV8juc9T3BlbkFJJCwEgXlcJuI81GZlVjfg")

def fake_news_clasificator_gpt4(prompt:str):
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role":"user","content":prompt}]
    )
    return response.choices[0].message.content.strip()

if __name__ == "__main__":
    while True:
        user_input = input("You: ")
        if user_input.lower() in ["quit", "exit", "bye"]:
            break
        response = fake_news_clasificator_gpt4(user_input)
        print("Chatbot: ", response)