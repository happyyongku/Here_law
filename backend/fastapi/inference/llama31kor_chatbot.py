import os
from llama_cpp import Llama

class Llama31KorChatbot:
    '''
      챗봇
	'''
    def __init__(self, **kwargs):
            self.model = Llama.from_pretrained(
                # repo_id="Saxo/Linkbricks-Horizon-AI-Korean-llama-3.1-sft-dpo-8B",
				# filename="ggml-model-q4_k_m.gguf",
                repo_id="meetkai/functionary-small-v3.2-GGUF", #TODO: parameterize
                filename ="*Q4_0.gguf",
                # local_dir= os.path.join(os.path.dirname(os.path.abspath(__file__)), "gguf"),
				**kwargs
			)
