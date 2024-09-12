from llama_cpp import Llama

class Llama31KorChatbot:
    '''
      챗봇
	'''
    def __init__(self, **kwargs):
            self.model = Llama.from_pretrained(
                repo_id="Saxo/Linkbricks-Horizon-AI-Korean-llama-3.1-sft-dpo-8B",
				filename="ggml-model-q4_k_m.gguf",
				**kwargs
			)
