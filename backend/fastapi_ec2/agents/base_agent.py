from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import MemorySaver
import logging

MODEL_OPENAI = "gpt-4o"
MODEL_LOCAL = "functionary_3.2_KR_custom"

class BaseAgent:

    def __init__(self, gpu_url=None, api_key=None, temperature=None, tools= None ):
        self.gpu_url = gpu_url
        self.api_key = api_key
        self.temperature = temperature
        
        if not self.api_key and not self.gpu_url:
            raise ValueError("'api_key' 나 'gpu_url' 둘 중 최소 하나는 필요함!")
        
        model_name = MODEL_LOCAL if self.gpu_url else MODEL_OPENAI
        
        logging.debug(f"BaseAgent: model name is {model_name}")
        if self.api_key is None:
            logging.debug("OpenAI api key 없음. Local 모델을 사용합니다...")
            self.api_key = "dummy_api_key"
        
        proxy_args = {
            "api_key": self.api_key,
            "model": model_name,
        }

        if model_name == MODEL_LOCAL:
            proxy_args["base_url"] = self.gpu_url

        self.tools = tools
        self.model = ChatOpenAI(temperature=self.temperature, streaming=False, **proxy_args)
        self.config = {"configurable": {"thread_id": "thread-1"}}
        self.graph = create_react_agent(self.model, tools, checkpointer=MemorySaver()) 

    def _print_stream(self, inputs):
        """
        __call__ 이지만, output을 return 하지 않고 그냥 출력함. 디버깅용.
        """
        for s in self.__call__(inputs):
            message = s["messages"][-1]
            if isinstance(message, tuple):
                print(message)
            else:
                message.pretty_print()

    def __call__(self, inputs):
        """
        dict 를 넣으시오.
        예시: {"messages": [("user", "안녕! 너는 누구니?")]}
        """
        return self.graph.stream(inputs, self.config, stream_mode="values")      




