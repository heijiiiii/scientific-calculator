# Git 사용 가이드

## 브랜치 전략

```
main
  └── develop
       ├── feature/calculator-ui
       ├── feature/scientific-functions
       └── feature/memory-operations
```

## 커밋 메시지 컨벤션

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅, 세미콜론 누락, 코드 변경이 없는 경우
refactor: 코드 리팩토링
test: 테스트 코드, 리팩토링 테스트 코드 추가
chore: 빌드 업무 수정, 패키지 매니저 수정
```

## 기본 Git 명령어

### 1. 저장소 초기화 및 원격 저장소 연결
```bash
# 저장소 초기화
git init

# 원격 저장소 연결
git remote add origin [repository-url]
```

### 2. 브랜치 관리
```bash
# 새 브랜치 생성
git branch [branch-name]

# 브랜치 전환
git checkout [branch-name]

# 브랜치 생성 및 전환
git checkout -b [branch-name]

# 브랜치 목록 확인
git branch
```

### 3. 변경사항 관리
```bash
# 변경사항 확인
git status

# 파일 스테이징
git add [file-name]
git add .  # 모든 변경사항 스테이징

# 변경사항 커밋
git commit -m "커밋 메시지"

# 원격 저장소에 푸시
git push origin [branch-name]
```

### 4. 변경사항 가져오기
```bash
# 원격 저장소의 변경사항 가져오기
git pull origin [branch-name]

# 특정 브랜치의 변경사항 현재 브랜치에 병합
git merge [branch-name]
```

## Git Flow 작업 순서

1. 새로운 기능 개발 시작
```bash
git checkout -b feature/new-feature develop
```

2. 기능 개발 완료 후
```bash
git add .
git commit -m "feat: 새로운 기능 추가"
git push origin feature/new-feature
```

3. Pull Request 생성
- GitHub/GitLab에서 PR 생성
- 코드 리뷰 진행
- 승인 후 develop 브랜치에 병합

4. develop 브랜치 업데이트
```bash
git checkout develop
git pull origin develop
```

## .gitignore 설정

현재 프로젝트의 .gitignore 파일에 포함된 주요 항목:

```
# 의존성
node_modules/
.pnp
.pnp.js

# 빌드 결과물
dist/
build/

# 환경 설정
.env*

# IDE 설정
.vscode/
.idea/

# 로그
*.log
```

## 문제 해결

### 1. 커밋 되돌리기
```bash
# 마지막 커밋 수정
git commit --amend

# 특정 커밋으로 되돌리기
git revert [commit-hash]
```

### 2. 스테이징 취소
```bash
# 특정 파일 스테이징 취소
git reset [file-name]

# 모든 스테이징 취소
git reset
```

### 3. 브랜치 삭제
```bash
# 로컬 브랜치 삭제
git branch -d [branch-name]

# 원격 브랜치 삭제
git push origin --delete [branch-name]
``` 