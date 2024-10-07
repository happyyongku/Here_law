import subprocess
import schedule
import time

# auto_downloder.py 실행 함수
def run_auto_downloader():
    print("Running auto_downloder.py...")
    result = subprocess.run(["python", "schedule/auto_downloder.py"], capture_output=True, text=True)
    
    # auto_downloder.py 실행이 성공했는지 확인
    if result.returncode == 0:
        print("auto_downloder.py completed successfully.")
        # 성공하면 make_post.py 실행
        run_make_post()
    else:
        print(f"auto_downloder.py failed with error:\n{result.stderr}")

# make_post.py 실행 함수
def run_make_post():
    print("Running make_post.py...")
    result = subprocess.run(["python", "schedule/make_post.py"], capture_output=True, text=True)
    
    # make_post.py 실행이 성공했는지 확인
    if result.returncode == 0:
        print("make_post.py completed successfully.")
    else:
        print(f"make_post.py failed with error:\n{result.stderr}")

# 스케줄러 설정 - 예: 매일 실행
schedule.every().day.at("00:00").do(run_auto_downloader)

# 무한 루프를 돌면서 스케줄을 실행
while True:
    schedule.run_pending()
    time.sleep(1)
