import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from test_chatbot import TestChatbot


if __name__ == "__main__":
    bot= TestChatbot()