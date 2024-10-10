import "./MagazineHotfixCard.css";

function MagazineHotfixCard({ item }) {
  // 반복용으로 임시로 만든거임
  const something = ["", ""];
  console.log(item[1]);

  return (
    <div className="magazine-hotfix-card-container">
      <div className="magazine-hotfix-card-head-box">
        <div className="magazine-hotfix-card-title">{item[0]}</div>
        <div className="design-box"></div>
      </div>
      <hr />
      {/* 반복으로 돌려서 컨텐츠 뽑아야 한다. */}

      <div className="magazine-hotfix-content-box">
        {item[1].map((item, index) => (
          <div key={index} className="magazine-hotfix-content-box-title">
            {item.law_name}
            <div>
              {item.diff.map((item2, index) => (
                <div key={index}>
                  {Object.entries(item2).map((item3, index) => (
                    <div key={index}>
                      <div>{item3[0]}</div>
                      <div>
                        {item3[1].map((item4, index) => (
                          <div key={index}>
                            <div>{item4.index}</div>
                            <div className="magazine-hotfix-content-box-content">
                              {item4.content}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* <div>{item[1][0].law_name}</div> */}
      {/* {something.map((item, index) => (
        <div className="magazine-hotfix-content-box" key={index}>
          <div className="magazine-hotfix-content-box-title">
            증거 수집 방식 강화
          </div>
          <div className="magazine-hotfix-content-box-content">
            새로운 조항이 추가되어, 경찰이 범죄 현장에서 증거를 수집할 때 특정
            절차를 준수해야 함. 제123조, 제7항 새로운 조항이 추가되어, 경찰이
            범죄 현장에서 증거를 수집할 때 특정 절차를 준수해야 함. 제123조,
            제7항
          </div>
        </div>
      ))} */}
    </div>
  );
}

export default MagazineHotfixCard;
