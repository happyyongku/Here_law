// 스토어는 리덕스의 중앙 저장소입니다. 여기서 애플리케이션 전체의 상태를 관리합니다.
// 애플리케이션의 모든 상태를 저장하는 중앙 저장소
//여기에 caseReducer를 사용해 상태를 관리합니다.

import { configureStore } from "@reduxjs/toolkit";
import caseReducer from "./reducers/caseReducer"; // 리듀서를 임포트
const store = configureStore({
  reducer: {
    cases: caseReducer, // 리듀서를 스토어에 전달하여 상태를 관리합니다.
  },
});

export default store; // 이 스토어를 애플리케이션 전역에서 사용할 수 있도록 내보냄
