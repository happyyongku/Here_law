// reducers/caseReducer.js
const initialState = {
  cases: [],
  totalResults: 0,
  currentPage: 1,
  totalPages: 1,
  loading: false,
  error: null,
};

const caseReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOAD_CASES":
      return {
        ...state,
        cases: action.payload.cases, // 판례 데이터 업데이트
        totalResults: action.payload.totalResults, // 총 결과 수 업데이트
        currentPage: action.payload.currentPage, // 현재 페이지 업데이트
        totalPages: action.payload.totalPages, // 총 페이지 수 업데이트
      };
    // 다른 케이스 추가 (예: 요청 시작, 실패 등)
    default:
      return state;
  }
};

export default caseReducer;
