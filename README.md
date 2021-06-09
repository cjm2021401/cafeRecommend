# CafeRecommend

<!-- TABLE OF CONTENTS -->
<h2>목차</h2>
<ol>
  <li>
    <a href="#about-the-project">About the Project</a>
  </li>
  <li>
    <a href="#demo-link">Demo Link</a>
  </li>
  <li>
    <a href="#getting-started">Getting Started</a>
    <ul>
      <li><a href="#prerequisite">Prerequisite</a></li>
      <li><a href="#execution">Execution</a></li>
    </ul>
  </li>
  <li><a href="#function">Function</a></li>
  <li><a href="#contributing">Contributing</a></li>
  <li><a href="#contact">Contact</a></li>
</ol>


<!-- ABOUT THE PROJECT -->
## About The Project

![Capture](http://khuhub.khu.ac.kr/2015104153/CafeRecommend/uploads/6389b45b4c980ece750798201b4472ff/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2021-06-09_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_5.20.45.png)

카카오 지도 API를 활용하여 사용자가 원하는 카페들을 지도상에서 추천해주는 서비스 입니다.

<!-- DEMO LINK -->
## Demo Link
https://www.caferecommend.tk:3000


<!-- GETTING STARTED -->
## Getting Started

### Prerequisite
* <a href="https://nodejs.org/ko/">Node.js</a>
  
  
* <a href="https://www.mysql.com/">MySQL</a>
  
  
* <a href="https://aws.amazon.com/ko/?nc2=h_lg">AWS</a>
  


### Execution

1. 구글 클라우드 생성 및 프로젝트 등록 후 ClientID 발급 (https://cloud.google.com/)
2. 카카오 Developer 가입 후 애플리케이션 추가 후 Javascript API키 발급 (https://developers.kakao.com/)
3. sql폴더에 정의된 테이블 생성문 MySQL에서 실행
4. KHU-HUB repo clone
   ```
   git clone http://khuhub.khu.ac.kr/2015104153/CafeRecommend
   ```
5. 디렉토리 이동 후 npm 패키지 설치
   ```
   npm install
   ```
6. 발급받은 구글 로그인 ClientID를 `index.js` 지도 API키를 `map.ejs`에 각각 넣기
   ```
   var CLIENT_ID = "발급받은 ClientID"
   ```
   
   ```
   <script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=발급받은API키&libraries=services"></script>
   ```
7. Session File Store 설정 (index.js)
     ```
     session({
      secret: "원하는 암호", 
      resave: false,
      saveUninitialized: true,
      store: new FileStore(),
     })
   ```     
8. MySQL connection 연결 설정 (index.js)
     ```
     var connection = mysql.createConnection({
      host: "IP주소 입력 (localhost 또는 AWS 서버 주소)",
      user: "계정 입력",
      password: "암호 입력",
      database: "스키마이름 입력",
     });
   ```
9. Freenom을 통해 발급받은 도메인을 /bin/www에 넣기
   ```
   const domain = "도메인 입력";
   ```
10. 프로그램 실행
   ```
   npm run start
   ```

<!-- FUNTION -->
## Funtion
1. 로그인 및 회원가입
2. 지도에서의 카페 보여주기 및 카페추천
3. 선택된 카페 상세정보 확인 및 후기(점수)등록

<!-- CONTRIBUTING -->
## Contributing

1. 프로젝트 Fork
2. 브랜치 생성 후 변경사항 작업
3. 브랜치 push 후 Pull Request Open

<!-- CONTACT -->
## Contact

2015104153 김대철
  
  
  <a href="https://github.com/dckat">Github Link</a>


2016104174 최정민
  
  
  <a href="https://github.com/cjm2021401">Github Link</a>
