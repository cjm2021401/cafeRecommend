###초기설정
>####데이터 베이스 설정
> <pre><code>
>CREATE TABLE USER(
>ID int(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,
>EMAIL varchar(64) NOT NULL UNIQUE,
>NAME varchar(64) NOT NULL,
>NICKNAME varchar(32) UNIQUE,
>AGE varchar(32),
>GENDER varchar(32)
>);
</code>
</pre>

###commit 형식
<pre><code>
##### 제목 - 50자 이내로 요약!

### [커밋 타입]: [작업내용]

##### 본문 - 한 줄에 최대 72 글자까지만 입력하기

# 1. 무엇을 수정했는지
# 2. 왜 수정했는지

# 꼬릿말은 아래에 작성: ex) #이슈 번호
-
#   [커밋 타입]  리스트
#   feat      : 기능 (새로운 기능)
#   fix       : 버그 (버그 수정)
#   refactor  : 리팩토링
#   style     : 스타일 (코드 형식, 세미콜론 추가: 비즈니스 로직에 변경 없음)
#   docs      : 문서 (문서 추가, 수정, 삭제)
#   test      : 테스트 (테스트 코드 추가, 수정, 삭제: 비즈니스 로직에 변경 없음)
#   chore     : 기타 변경사항 (빌드 스크립트 수정 등)
#   post     : 블로그 포스트 추가 (신규 포스트 작성 및 수정)
# ------------------
#   [체크리스트]
#     제목 첫 글자는 대문자로 작성했나요?
</code>
</pre>


