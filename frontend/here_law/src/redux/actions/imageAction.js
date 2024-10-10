// 액션 타입 정의
export const SET_IMAGE_ARRAY = "SET_IMAGE_ARRAY";

// 이미지 배열을 설정하는 액션
export const setImageArray = (imageArray) => ({
  type: SET_IMAGE_ARRAY,
  payload: imageArray,
});
