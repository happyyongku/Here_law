from ai_model.llama31_proxy import Llama31Proxy

# from langchain_core.messages import AIMessage, HumanMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_community.chat_message_histories import ChatMessageHistory

class TestChatbot:
    '''
    기능 테스트 및 Template 용 챗봇.
    '''
    def __init__(
        self,
        promptTemplate=[
            (
                "system",
                "You are a helpful assistant",
            ),
            MessagesPlaceholder(variable_name="messages"),
        ],
    ):
        self.llm = Llama31Proxy(url = "http://0.0.0.0:8000")
        self.promptTemplate = promptTemplate
        self.history = ChatMessageHistory()
        prompt = ChatPromptTemplate.from_messages(
            self.promptTemplate,
        )
        self.chain = prompt | self.llm

    def generateResponse(self, user_input):
        self.history.add_user_message(user_input)

        response = self.chain.invoke(
            {
                "messages": self.history.messages,
            }
        )
        self.history.add_ai_message(response.content)
        return response.content

    def __call__(self, user_input):
        return self.generateResponse(user_input)
    