# Here Law Porting Manual
이 매뉴얼은 linux 환경에서 "Here law"를 clone하여 빌드 및 배포하는 방법에 대한 가이드 입니다.
## 0. 요구사항
- Ubuntu 20.04.6 LTS
    - Docker version 24.0.7, build 24.0.7-0ubuntu2~20.04.1
    - Docker compose version 1.29.2 build 5becea4c
    - openjdk 17.0.12 2024-07-16
        - 상세사항
            - OpenJDK Runtime Environment (build 17.0.12+7-Ubuntu-1ubuntu220.04)
            - OpenJDK 64-Bit Server VM (build 17.0.12+7-Ubuntu-1ubuntu220.04, mixed mode, sharing)
## 1. 빌드
다음 명령어를 통해 젠킨스 빌드를 시작
```bash
curl -X POST http://j11b109.p.ssafy.io:9000/job/J11B109_pipeline/build --user yonggu97:11930676189a18f0c280de654801e46cd3
```

## 2. 환경 변수 file 구성
각각의 .env 파일의 template를 모두 채운뒤, 각 프로젝트의 root 디렉토리에 배치

- backend/fastapi_ec2
```bash
# DB 관련 설정들
DB_DOMAIN=
DB_PORT_FASTAPI=
DB_NAME=
DB_USERNAME=
DB_PASSWORD=

# JWT 관련 설정
JWT_SECRET=
JWT_EXPIRATION=
JWT_ALGORITHM=
ACCESS_TOKEN_EXPIRE_MINUTES=

# 메일 발송 관련 설정
MAIL_HOST=
MAIL_PORT=
MAIL_USERNAME=
MAIL_PASSWORD=

# GPU 서버 통신 관련 설정
EMBEDDER_URL=
SESSION_TIMEOUT=
MAX_SESSIONS_PER_USER=
SESSIONS_CLEANUP_INTERVAL=

# 외부 API 관련 설정
FASTAPI_SERVER_PORT=
API_KEY=
CLOVA_URL=
CLOVA_KEY=
```
- backend/spring
```bash
# DB 관련 설정
DB_DOMAIN=
DB_PORT=
DB_NAME=
DB_USERNAME=
DB_PASSWORD=

# JWT 관련 설정
JWT_SECRET=
JWT_EXPIRATION=

# 메일 관련 설정
MAIL_HOST=
MAIL_PORT=
MAIL_USERNAME=
MAIL_PASSWORD=
```
## 3. Deploy
git root에서 실행
```bash
docker-compose -f docker-compose-ec2.yml down
```
이후 실행
```bash
docker-compose -f docker-compose-ec2.yml up -d
```